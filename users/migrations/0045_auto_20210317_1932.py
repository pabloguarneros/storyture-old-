# Generated by Django 3.1.6 on 2021-03-17 19:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0044_dummyfilm_new_film'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dummyfilm',
            name='movie_ID',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
