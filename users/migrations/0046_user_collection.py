# Generated by Django 3.1.6 on 2021-03-22 21:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('films', '0033_auto_20210320_1947'),
        ('users', '0045_auto_20210317_1932'),
    ]

    operations = [
        migrations.CreateModel(
            name='User_Collection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('description', models.TextField(blank=True)),
                ('image', models.ImageField(blank=True, default='collections/default/pink.png', null=True, upload_to=users.models.collection_directory_path)),
                ('privacy', models.IntegerField(choices=[(0, 'Private'), (1, 'Public'), (2, 'Friends')], default=1)),
                ('bya', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='collection_creator', to=settings.AUTH_USER_MODEL)),
                ('films', models.ManyToManyField(to='films.Film')),
                ('followers', models.ManyToManyField(blank=True, related_name='collection_followers', to=settings.AUTH_USER_MODEL)),
                ('tags', models.ManyToManyField(blank=True, related_name='collection_tags', to='films.Tag')),
            ],
        ),
    ]