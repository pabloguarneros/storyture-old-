# Generated by Django 3.1.6 on 2021-03-31 15:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0057_user_collection_popularity'),
    ]

    operations = [
        migrations.AddField(
            model_name='dummyfilm',
            name='co2_t',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
    ]
