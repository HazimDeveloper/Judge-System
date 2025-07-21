from rest_framework import serializers
from .models import Participant, Submission, Competition

class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = ['id', 'name', 'description', 'start_date', 'end_date']

class ParticipantSerializer(serializers.ModelSerializer):
    competitions = CompetitionSerializer(many=True, read_only=True)
    class Meta:
        model = Participant
        fields = ['id', 'user', 'institution', 'phone', 'competitions']

class SubmissionSerializer(serializers.ModelSerializer):
    participant = ParticipantSerializer(read_only=True)
    competition = CompetitionSerializer(read_only=True)
    competition_id = serializers.PrimaryKeyRelatedField(queryset=Competition.objects.all(), source='competition', write_only=True)

    class Meta:
        model = Submission
        fields = ['id', 'participant', 'competition', 'competition_id', 'title', 'description', 'file', 'link', 'submitted_at', 'status']
        read_only_fields = ['id', 'submitted_at', 'status', 'participant', 'competition'] 