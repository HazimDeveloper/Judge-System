from rest_framework import serializers
from .models import Participant, Submission

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['id', 'user', 'institution', 'phone']

class SubmissionSerializer(serializers.ModelSerializer):
    participant = ParticipantSerializer(read_only=True)
    participant_id = serializers.PrimaryKeyRelatedField(
        queryset=Participant.objects.all(), source='participant', write_only=True
    )

    class Meta:
        model = Submission
        fields = ['id', 'participant', 'participant_id', 'title', 'description', 'file', 'submitted_at', 'status']
        read_only_fields = ['id', 'submitted_at', 'status'] 