# Generated by Django 5.1.1 on 2024-11-11 20:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0006_game_history_has_ended'),
    ]

    operations = [
        migrations.AddField(
            model_name='gamestats',
            name='isTournemantMatch',
            field=models.BooleanField(default=False),
        ),
    ]