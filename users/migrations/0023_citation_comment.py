# Generated by Django 3.1.6 on 2021-02-20 23:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0022_auto_20210220_2334'),
    ]

    operations = [
        migrations.CreateModel(
            name='Citation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=120)),
                ('url', models.CharField(max_length=400)),
                ('description', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comment_from', to=settings.AUTH_USER_MODEL)),
                ('hover_time', models.ManyToManyField(blank=True, to='users.Citation')),
                ('replies', models.ManyToManyField(blank=True, related_name='_comment_replies_+', to='users.Comment')),
            ],
        ),
    ]