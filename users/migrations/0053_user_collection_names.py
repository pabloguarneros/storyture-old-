# Generated by Django 3.1.6 on 2021-03-25 04:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0052_action_removed'),
    ]

    operations = [
        migrations.AddField(
            model_name='user_collection',
            name='names',
            field=models.CharField(default=None, max_length=20, null=True),
        ),
    ]
