# Generated by Django 3.1.6 on 2021-02-20 17:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('market', '0004_auto_20210220_1647'),
    ]

    operations = [
        migrations.AddField(
            model_name='market',
            name='svg_next',
            field=models.CharField(default='market/icons/chair_2.svg', max_length=100),
        ),
    ]