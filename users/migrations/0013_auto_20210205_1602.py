# Generated by Django 3.1.6 on 2021-02-05 16:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('films', '0002_auto_20210204_1719'),
        ('users', '0012_auto_20210203_0010'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Audience',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('seen', models.BooleanField()),
                ('country_pass', models.IntegerField(blank=True, choices=[(0, 'No'), (1, 'Yes'), (2, 'Idk')])),
                ('audience', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='audience_from', to=settings.AUTH_USER_MODEL)),
                ('comment', models.ManyToManyField(blank=True, to='users.Comment')),
                ('movie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movie_to', to='films.film')),
            ],
        ),
        migrations.AddField(
            model_name='customuser',
            name='films',
            field=models.ManyToManyField(related_name='recommending_to', through='users.Audience', to='films.Film'),
        ),
    ]