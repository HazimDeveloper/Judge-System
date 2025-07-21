from django.db import models
from users.models import User

# Create your models here.

class Participant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='participant_profile')
    institution = models.CharField(max_length=255)
    phone = models.CharField(max_length=30, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.institution})"

class Submission(models.Model):
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='submissions')
    title = models.CharField(max_length=255)
    description = models.TextField()
    file = models.FileField(upload_to='submissions/', blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='pending')

    def __str__(self):
        return f"{self.title} by {self.participant.user.username}"
