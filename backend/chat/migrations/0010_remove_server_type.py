# Generated by Django 5.1.1 on 2024-09-25 09:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0009_alter_server_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='server',
            name='type',
        ),
    ]
