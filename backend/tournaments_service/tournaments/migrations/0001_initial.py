# Generated by Django 5.1.1 on 2024-11-18 20:26

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tournament_History',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('avatar', models.CharField(default='/assets/images/tournament_avatars/default_tournament.jpg', max_length=255)),
                ('qr_code', models.CharField(default='/assets/images/servers_qr_codes/default.jpg', max_length=255)),
                ('tournament_winner', models.IntegerField(default=0)),
                ('visibility', models.CharField(choices=[('public', 'Public'), ('private', 'Private')], default='public', max_length=20)),
                ('password', models.CharField(blank=True, max_length=255, null=True)),
                ('bracket_data', models.JSONField(default=dict)),
                ('members', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('game_name', models.CharField(choices=[('pong', 'Pong'), ('space_invaders', 'Space Invaders'), ('road_fighter', 'Road Fighter')], max_length=20)),
                ('room_size', models.IntegerField(default=4)),
                ('total_number_of_players', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(default='Waiting for players', max_length=255)),
            ],
            options={
                'verbose_name_plural': 'Tournament History',
            },
        ),
        migrations.CreateModel(
            name='TournamentStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField()),
                ('game_name', models.CharField(choices=[('pong', 'Pong'), ('space_invaders', 'Space Invaders'), ('road_fighter', 'Road Fighter')], max_length=20)),
                ('total_games_played', models.IntegerField(default=0)),
                ('games_won', models.IntegerField(default=0)),
            ],
            options={
                'verbose_name_plural': 'Tournament Stats',
            },
        ),
    ]