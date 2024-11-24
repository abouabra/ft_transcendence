# Create this file in your_app/management/commands/collectadminstatic.py

from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.conf import settings
import shutil
import os

class Command(BaseCommand):
    help = 'Collect only Django admin static files'

    def handle(self, *args, **options):
        # Save original INSTALLED_APPS
        original_installed_apps = settings.INSTALLED_APPS
        
        # Temporarily modify INSTALLED_APPS to include only admin-related apps
        settings.INSTALLED_APPS = [
            'django.contrib.admin',
            'django.contrib.auth',
            'django.contrib.contenttypes',
            'django.contrib.staticfiles',
        ]

        # Run collectstatic
        call_command(
            'collectstatic',
            interactive=False,
            verbosity=1
        )

        # Restore original INSTALLED_APPS
        settings.INSTALLED_APPS = original_installed_apps

        # Keep only admin directory
        static_root = settings.STATIC_ROOT
        if os.path.exists(static_root):
            # Get all directories in static root
            entries = os.listdir(static_root)
            
            # Remove everything except 'admin' directory
            for entry in entries:
                if entry != 'admin':
                    path = os.path.join(static_root, entry)
                    if os.path.isdir(path):
                        shutil.rmtree(path)
                    else:
                        os.remove(path)

        self.stdout.write(
            self.style.SUCCESS('Successfully collected admin static files')
        )