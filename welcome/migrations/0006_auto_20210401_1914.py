# Generated by Django 3.1.6 on 2021-04-01 19:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('welcome', '0005_meta_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='meta',
            name='hide_bot',
            field=models.BooleanField(default=1),
        ),
    ]