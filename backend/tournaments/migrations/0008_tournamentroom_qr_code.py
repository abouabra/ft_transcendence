# Generated by Django 5.1.1 on 2024-11-06 16:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0007_alter_tournamentroom_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournamentroom',
            name='qr_code',
            field=models.CharField(default='/assets/images/tournament_qr_code/default.jpg', max_length=255),
        ),
    ]
