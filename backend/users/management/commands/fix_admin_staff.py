from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Set is_staff=True for all users with role=ADMIN.'

    def handle(self, *args, **options):
        admins = User.objects.filter(role=User.Role.ADMIN)
        count = 0
        for user in admins:
            if not user.is_staff:
                user.is_staff = True
                user.save()
                count += 1
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {count} admin user(s) to is_staff=True.')) 