# Generated by Django 3.1.6 on 2021-03-07 00:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('films', '0020_auto_20210307_0029'),
    ]

    operations = [
        migrations.AlterField(
            model_name='genre',
            name='name',
            field=models.CharField(max_length=30, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='language',
            name='name',
            field=models.CharField(max_length=40, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='tag',
            name='name',
            field=models.CharField(max_length=30, primary_key=True, serialize=False),
        ),
    ]
