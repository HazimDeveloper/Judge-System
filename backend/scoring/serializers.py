from rest_framework import serializers
from .models import Rubric, Judge, Score, RubricVersion, RubricCriterion
from submissions.serializers import CompetitionSerializer
from submissions.models import Competition
from users.serializers import UserSerializer

class RubricSerializer(serializers.ModelSerializer):
    competition = CompetitionSerializer(read_only=True)
    competition_id = serializers.PrimaryKeyRelatedField(queryset=Competition.objects.all(), source='competition', write_only=True)
    class Meta:
        model = Rubric
        fields = ['id', 'competition', 'competition_id', 'name', 'description', 'max_score']

class JudgeSerializer(serializers.ModelSerializer):
    competitions = CompetitionSerializer(many=True, read_only=True)
    competitions_ids = serializers.PrimaryKeyRelatedField(queryset=Competition.objects.all(), many=True, write_only=True, source='competitions')
    user = UserSerializer(read_only=True)
    class Meta:
        model = Judge
        fields = ['id', 'user', 'expertise', 'competitions', 'competitions_ids']

    def update(self, instance, validated_data):
        competitions = validated_data.pop('competitions', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if competitions is not None:
            instance.competitions.set(competitions)
        return instance

class ScoreSerializer(serializers.ModelSerializer):
    participant_name = serializers.SerializerMethodField()
    judge_name = serializers.SerializerMethodField()
    rubric_name = serializers.CharField(source='rubric.name', read_only=True)
    competition = CompetitionSerializer(read_only=True)
    competition_id = serializers.PrimaryKeyRelatedField(queryset=Competition.objects.all(), source='competition', write_only=True)
    evaluation_file = serializers.FileField(required=False, allow_null=True)
    evaluation_link = serializers.URLField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Score
        fields = ['id', 'competition', 'competition_id', 'submission', 'rubric', 'participant_name', 'judge_name', 'rubric_name', 'score', 'comment', 'evaluation_file', 'evaluation_link', 'scored_at']
        read_only_fields = ['id', 'scored_at']

    def get_participant_name(self, obj):
        return obj.submission.participant.user.username if obj.submission and obj.submission.participant and obj.submission.participant.user else ''

    def get_judge_name(self, obj):
        return obj.judge.user.username if obj.judge and obj.judge.user else ''

class RubricCriterionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RubricCriterion
        fields = ['id', 'name', 'weight']

class RubricVersionSerializer(serializers.ModelSerializer):
    criteria = RubricCriterionSerializer(many=True)
    competitions = serializers.PrimaryKeyRelatedField(queryset=Competition.objects.all(), many=True)

    class Meta:
        model = RubricVersion
        fields = ['id', 'name', 'competitions', 'criteria']

    def validate_criteria(self, value):
        total_weight = sum(c['weight'] for c in value)
        if total_weight != 100:
            raise serializers.ValidationError("Total weight must be 100%")
        return value

    def create(self, validated_data):
        criteria_data = validated_data.pop('criteria')
        competitions = validated_data.pop('competitions')
        rubric = RubricVersion.objects.create(**validated_data)
        rubric.competitions.set(competitions)
        for c in criteria_data:
            RubricCriterion.objects.create(rubric=rubric, **c)
        return rubric 