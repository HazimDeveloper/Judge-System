from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Participant, Submission, Competition
from .serializers import ParticipantSerializer, SubmissionSerializer, CompetitionSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import SAFE_METHODS

# Create your views here.

class CompetitionPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff

class CompetitionListCreateView(generics.ListCreateAPIView):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    permission_classes = [CompetitionPermission]

class CompetitionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    permission_classes = [permissions.IsAdminUser]

class ParticipantListCreateView(generics.ListCreateAPIView):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        competition_id = self.request.query_params.get('competition')
        qs = Participant.objects.all()
        if competition_id:
            qs = qs.filter(competitions__id=competition_id)
        return qs

class SubmissionListCreateView(generics.ListCreateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        competition_id = self.request.query_params.get('competition')
        qs = Submission.objects.all()
        if competition_id:
            qs = qs.filter(competition__id=competition_id)
        if user.role == user.Role.ADMIN:
            return qs
        elif user.role == user.Role.PARTICIPANT:
            return qs.filter(participant__user=user)
        elif user.role == user.Role.JUDGE:
            # Judges should see submissions for competitions they are assigned to
            return qs
        elif user.role == user.Role.COMMITTEE:
            # Committee members should see all submissions for the selected competition
            return qs
        return Submission.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != user.Role.PARTICIPANT:
            raise PermissionDenied('Only participants can submit projects.')
        participant = Participant.objects.get(user=user)
        competition = serializer.validated_data['competition']
        participant.competitions.add(competition)
        serializer.save(participant=participant)

class SubmissionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == user.Role.ADMIN:
            return Submission.objects.all()
        elif user.role == user.Role.PARTICIPANT:
            return Submission.objects.filter(participant__user=user)
        return Submission.objects.none()
