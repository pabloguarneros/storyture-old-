# Generated by Django 3.1.6 on 2021-04-07 04:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('films', '0039_auto_20210407_0404'),
    ]

    operations = [
        migrations.AlterField(
            model_name='score_mpa',
            name='score',
            field=models.CharField(max_length=30, primary_key=True, serialize=False),
        ),
    ]
