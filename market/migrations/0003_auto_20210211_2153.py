# Generated by Django 3.1.6 on 2021-02-11 21:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('market', '0002_auto_20210207_2058'),
    ]

    operations = [
        migrations.AlterField(
            model_name='market',
            name='categ',
            field=models.IntegerField(blank=True, choices=[(0, 'Theatre'), (1, 'Projector'), (2, 'Speaker'), (4, 'Seat')]),
        ),
    ]
