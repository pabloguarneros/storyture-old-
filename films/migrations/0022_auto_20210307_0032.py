# Generated by Django 3.1.6 on 2021-03-07 00:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('films', '0021_auto_20210307_0031'),
    ]

    operations = [
        migrations.AlterField(
            model_name='film',
            name='title',
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
    ]
