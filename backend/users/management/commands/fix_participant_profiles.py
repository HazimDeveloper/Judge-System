from django.core.management.base import BaseCommand
from users.models import User
from submissions.models import Participant

class Command(BaseCommand):
    help = 'Create missing Participant profiles for users with role=PARTICIPANT.'

    def handle(self, *args, **options):
        participants = User.objects.filter(role=User.Role.PARTICIPANT)
        count = 0
        for user in participants:
            obj, created = Participant.objects.get_or_create(user=user)
            if created:
                count += 1
        self.stdout.write(self.style.SUCCESS(f'Created {count} missing Participant profile(s).')) 