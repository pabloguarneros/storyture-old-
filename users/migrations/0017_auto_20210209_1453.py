# Generated by Django 3.1.6 on 2021-02-09 14:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0016_auto_20210208_2124'),
    ]

    operations = [
        migrations.AlterField(
            model_name='audience',
            name='seen',
            field=models.BooleanField(default=0),
        ),
    ]
