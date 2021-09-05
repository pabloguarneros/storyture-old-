# Generated by Django 3.1.6 on 2021-04-09 22:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0064_audience_trailer_time_seconds'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user_collection',
            name='bya',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='collection_creator', to=settings.AUTH_USER_MODEL),
        ),
    ]