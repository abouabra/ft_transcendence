# Generated by Django 4.2.15 on 2024-09-16 21:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_message'),
    ]

    operations = [
        migrations.RenameField(
            model_name='server',
            old_name='member_ids',
            new_name='members',
        ),
    ]
