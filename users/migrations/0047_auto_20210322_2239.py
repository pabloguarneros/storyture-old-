# Generated by Django 3.1.6 on 2021-03-22 22:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0046_user_collection'),
    ]

    operations = [
        migrations.RenameField(
            model_name='relationship',
            old_name='seen_count',
            new_name='visits_to',
        ),
    ]
