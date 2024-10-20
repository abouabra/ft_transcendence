# Generated by Django 5.1.1 on 2024-09-21 19:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Game_Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player1', models.IntegerField()),
                ('player2', models.IntegerField()),
                ('game_type', models.CharField(choices=[('pong', 'Pong'), ('space_invaders', 'Space Invaders'), ('road_fighter', 'Road Fighter')], max_length=20)),
                ('player_1_score', models.IntegerField(default=0)),
                ('player_2_score', models.IntegerField(default=0)),
                ('player1_elo_change', models.IntegerField(default=0)),
                ('player2_elo_change', models.IntegerField(default=0)),
                ('winner', models.IntegerField()),
                ('game_date', models.DateTimeField(auto_now_add=True)),
                ('game_duration', models.IntegerField(default=0)),
            ],
            options={
                'verbose_name_plural': 'Game History',
            },
        ),
        migrations.AlterField(
            model_name='gamestats',
            name='game_type',
            field=models.CharField(choices=[('pong', 'Pong'), ('space_invaders', 'Space Invaders'), ('road_fighter', 'Road Fighter')], max_length=20),
        ),
        migrations.AlterModelOptions(
            name='gamestats',
            options={'verbose_name_plural': 'Game Stats'},
        ),
        migrations.AddField(
            model_name='gamestats',
            name='games_drawn',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='gamestats',
            name='games_lost',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='gamestats',
            name='games_won',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='gamestats',
            name='total_games_played',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='gamestats',
            name='total_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='gamestats',
            name='user_id',
            field=models.IntegerField(default=None),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='GameType',
        ),
    ]
