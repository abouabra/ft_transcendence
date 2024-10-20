# Generated by Django 5.1.1 on 2024-09-21 19:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GameType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='GameStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('current_elo', models.FloatField(default=25)),
                ('peak_elo', models.FloatField(default=25)),
                ('total_time_spent', models.IntegerField(default=0)),
                ('game_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.gametype')),
            ],
        ),
    ]
