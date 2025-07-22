from django.db import models
from users.models import User
from submissions.models import Submission, Competition

class Rubric(models.Model):
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='rubrics')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    max_score = models.PositiveIntegerField(default=100)

    def __str__(self):
        return f"{self.name} ({self.competition.name})"

class Judge(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='judge_profile')
    expertise = models.CharField(max_length=255, blank=True)
    competitions = models.ManyToManyField(Competition, related_name='judges', blank=True)

    def __str__(self):
        return self.user.username

class Score(models.Model):
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='scores')
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='scores')
    judge = models.ForeignKey(Judge, on_delete=models.CASCADE, related_name='scores')
    rubric = models.ForeignKey(Rubric, on_delete=models.CASCADE, related_name='scores')
    score = models.PositiveIntegerField()
    comment = models.TextField(blank=True)
    scored_at = models.DateTimeField(auto_now_add=True)
    evaluation_file = models.FileField(upload_to='judge_evaluations/', blank=True, null=True)
    evaluation_link = models.URLField(blank=True, null=True)

    class Meta:
        unique_together = ('competition', 'submission', 'judge', 'rubric')

    def __str__(self):
        return f"{self.submission.title} - {self.judge.user.username} - {self.rubric.name}: {self.score}"

class RubricVersion(models.Model):
    name = models.CharField(max_length=255)
    competitions = models.ManyToManyField(Competition, related_name='rubric_versions')

    def __str__(self):
        return self.name

class RubricCriterion(models.Model):
    rubric = models.ForeignKey(RubricVersion, related_name='criteria', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    weight = models.PositiveIntegerField()  # e.g., 50 for 50%

    def __str__(self):
        return f"{self.name} ({self.weight}%)"
