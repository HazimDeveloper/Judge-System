from rest_framework import serializers
from .models import Rubric, Judge, Score

class RubricSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rubric
        fields = ['id', 'name', 'description', 'max_score']

class JudgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Judge
        fields = ['id', 'user', 'expertise']

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ['id', 'submission', 'judge', 'rubric', 'score', 'comment', 'scored_at']
        read_only_fields = ['id', 'scored_at'] 