# Generated by Django 3.1.5 on 2021-01-31 15:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('films', '0001_initial'),
        ('users', '0002_auto_20210130_1925'),
    ]

    operations = [
        migrations.CreateModel(
            name='Market',
            fields=[
                ('item_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=30)),
                ('lvl', models.IntegerField()),
                ('categ', models.CharField(max_length=23)),
                ('svg', models.FileField(blank=True, null=True, upload_to='market/')),
                ('cost', models.IntegerField()),
                ('describe', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Kubs',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_pic', models.ImageField(default='prof_pics/default.jpg', upload_to='user_directory_path')),
                ('purpose', models.TextField(default='For me, films are a way to...')),
                ('theatre_name', models.TextField(default='My Theatre')),
                ('level', models.IntegerField(default=1)),
                ('bucket_list', models.ManyToManyField(blank=True, related_name='bucket_list', to='films.Film')),
                ('country', models.ManyToManyField(blank=True, default="''", to='films.Country')),
                ('fav_films', models.ManyToManyField(blank=True, related_name='fav_film', to='films.Film')),
                ('projector', models.ForeignKey(default=2, on_delete=django.db.models.deletion.PROTECT, related_name='projector', to='users.market')),
                ('role_models', models.ManyToManyField(blank=True, to='films.Person')),
                ('seat', models.ForeignKey(default=4, on_delete=django.db.models.deletion.PROTECT, related_name='seat', to='users.market')),
                ('speaker', models.ForeignKey(default=3, on_delete=django.db.models.deletion.PROTECT, related_name='speaker', to='users.market')),
                ('theatre', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, related_name='theatre', to='users.market')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
