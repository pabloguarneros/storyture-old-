# Generated by Django 3.1.6 on 2021-02-24 15:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('films', '0011_auto_20210224_1515'),
    ]

    operations = [
        migrations.AlterField(
            model_name='film',
            name='year',
            field=models.CharField(default=0, max_length=4),
            preserve_default=False,
        ),
    ]
