# Generated by Django 3.1.6 on 2021-04-01 04:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('collection', '0002_auto_20210401_0442'),
    ]

    operations = [
        migrations.RenameField(
            model_name='deleted_collection',
            old_name='time_created',
            new_name='time_built',
        ),
    ]
