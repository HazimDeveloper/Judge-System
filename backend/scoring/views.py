from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Rubric, Judge, Score
from .serializers import RubricSerializer, JudgeSerializer, ScoreSerializer
from rest_framework.exceptions import PermissionDenied

# Create your views here.

class RubricListCreateView(generics.ListCreateAPIView):
    queryset = Rubric.objects.all()
    serializer_class = RubricSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            if self.request.user.role != self.request.user.Role.ADMIN:
                raise PermissionDenied('Only admin can create rubrics.')
        return super().get_permissions()

class RubricDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rubric.objects.all()
    serializer_class = RubricSerializer
    permission_classes = [permissions.IsAuthenticated]

class JudgeListView(generics.ListAPIView):
    queryset = Judge.objects.all()
    serializer_class = JudgeSerializer
    permission_classes = [permissions.IsAuthenticated]

class JudgeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Judge.objects.all()
    serializer_class = JudgeSerializer
    permission_classes = [permissions.IsAuthenticated]

class ScoreListCreateView(generics.ListCreateAPIView):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == user.Role.ADMIN:
            return Score.objects.all()
        elif user.role == user.Role.JUDGE:
            return Score.objects.filter(judge__user=user)
        elif user.role == user.Role.COMMITTEE:
            return Score.objects.all()
        return Score.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != user.Role.JUDGE:
            raise PermissionDenied('Only judges can score submissions.')
        judge = Judge.objects.get(user=user)
        serializer.save(judge=judge)

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it,
    or admins to do anything.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Admins can do anything.
        if request.user.role == 'ADMIN':
            return True

        # Write permissions are only allowed to the owner of the score.
        return obj.judge.user == request.user

class ScoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
