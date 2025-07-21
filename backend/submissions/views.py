from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Participant, Submission
from .serializers import ParticipantSerializer, SubmissionSerializer
from rest_framework.exceptions import PermissionDenied

# Create your views here.

class ParticipantListCreateView(generics.ListCreateAPIView):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]

class SubmissionListCreateView(generics.ListCreateAPIView):
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

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != user.Role.PARTICIPANT:
            raise PermissionDenied('Only participants can submit projects.')
        participant = Participant.objects.get(user=user)
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
