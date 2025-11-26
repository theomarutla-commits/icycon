from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create a dummy user for dry run testing.'

    def handle(self, *args, **options):
        username = 'dryrunuser'
        password = 'dryrunpass123'
        if not User.objects.filter(username=username).exists():
            User.objects.create_user(username=username, password=password)
            self.stdout.write(self.style.SUCCESS(f'Created user {username}'))
        else:
            self.stdout.write(self.style.WARNING(f'User {username} already exists'))
