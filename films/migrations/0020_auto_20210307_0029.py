# Generated by Django 3.1.6 on 2021-03-07 00:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('films', '0019_film_dup'),
    ]

    operations = [
        migrations.AlterField(
            model_name='prodco',
            name='name',
            field=models.CharField(max_length=120, primary_key=True, serialize=False),
        ),
    ]