# Generated by Django 5.1.1 on 2024-10-24 18:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0005_alter_game_history_winner'),
    ]

    operations = [
        migrations.AddField(
            model_name='game_history',
            name='has_ended',
            field=models.BooleanField(default=False),
        ),
    ]
