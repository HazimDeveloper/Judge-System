from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        JUDGE = 'JUDGE', 'Judge'
        COMMITTEE = 'COMMITTEE', 'Committee'
        PARTICIPANT = 'PARTICIPANT', 'Participant'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.PARTICIPANT)

    def save(self, *args, **kwargs):
        if self.role == self.Role.ADMIN:
            self.is_staff = True
        else:
            self.is_staff = False
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.role})"
