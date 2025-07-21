from django.db import models
from users.models import User
from submissions.models import Submission

class Rubric(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    max_score = models.PositiveIntegerField(default=100)

    def __str__(self):
        return self.name

class Judge(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='judge_profile')
    expertise = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.user.username

class Score(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='scores')
    judge = models.ForeignKey(Judge, on_delete=models.CASCADE, related_name='scores')
    rubric = models.ForeignKey(Rubric, on_delete=models.CASCADE, related_name='scores')
    score = models.PositiveIntegerField()
    comment = models.TextField(blank=True)
    scored_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('submission', 'judge', 'rubric')

    def __str__(self):
        return f"{self.submission.title} - {self.judge.user.username} - {self.rubric.name}: {self.score}"
