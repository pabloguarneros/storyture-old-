# Generated by Django 3.1.6 on 2021-03-17 15:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0042_dummyfilm'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dummyfilm',
            name='imdb_code',
        ),
        migrations.AlterField(
            model_name='dummyfilm',
            name='movie_ID',
            field=models.IntegerField(blank=True),
        ),
    ]