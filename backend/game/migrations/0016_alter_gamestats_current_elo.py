# Generated by Django 5.1.1 on 2024-11-20 20:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0015_alter_gamestats_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gamestats',
            name='current_elo',
            field=models.IntegerField(default=25),
        ),
    ]
