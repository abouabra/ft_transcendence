# Generated by Django 4.2.15 on 2024-09-09 20:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0002_user_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='status',
            field=models.CharField(default='offline', max_length=255),
        ),
    ]