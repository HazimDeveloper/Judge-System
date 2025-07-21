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

class ScoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer
    permission_classes = [permissions.IsAuthenticated]
