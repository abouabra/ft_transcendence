# Generated by Django 5.1.1 on 2024-11-06 06:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0005_alter_tournamentroom_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournamentroom',
            name='room_size',
            field=models.IntegerField(default=4),
        ),
    ]
