# Generated by Django 3.1.6 on 2021-02-19 00:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('films', '0007_film_poster_pic'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='film',
            name='poster_pic',
        ),
    ]
