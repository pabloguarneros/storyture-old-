# Generated by Django 3.1.6 on 2021-03-25 04:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0053_user_collection_names'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user_collection',
            name='names',
        ),
    ]