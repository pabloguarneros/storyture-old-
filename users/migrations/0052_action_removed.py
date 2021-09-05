# Generated by Django 3.1.6 on 2021-03-24 21:55

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0051_auto_20210324_1512'),
    ]

    operations = [
        migrations.AddField(
            model_name='action',
            name='removed',
            field=models.ManyToManyField(blank=True, related_name='removed_by_me', to=settings.AUTH_USER_MODEL),
        ),
    ]
