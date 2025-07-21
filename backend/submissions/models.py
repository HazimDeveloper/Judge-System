from django.db import models
from users.models import User

# Create your models here.

class Competition(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Participant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='participant_profile')
    institution = models.CharField(max_length=255)
    phone = models.CharField(max_length=30, blank=True)
    # Optionally, track which competitions a participant has joined
    competitions = models.ManyToManyField(Competition, related_name='participants', blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.institution})"

class Submission(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        UNDER_REVIEW = 'UNDER_REVIEW', 'Under Review'
        COMPLETED = 'COMPLETED', 'Completed'
        REJECTED = 'REJECTED', 'Rejected'

    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='submissions')
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='submissions')
    title = models.CharField(max_length=255)
    description = models.TextField()
    file = models.FileField(upload_to='submissions/', blank=True, null=True)
    link = models.URLField(max_length=500, blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=50, 
        choices=Status.choices, 
        default=Status.UNDER_REVIEW
    )

    def __str__(self):
        return f"{self.title} by {self.participant.user.username}"
