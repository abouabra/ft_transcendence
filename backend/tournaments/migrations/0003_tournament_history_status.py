# Generated by Django 5.1.1 on 2024-09-26 17:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0002_alter_tournament_bracket_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournament_history',
            name='status',
            field=models.CharField(default='Waiting for players', max_length=255),
        ),
    ]
