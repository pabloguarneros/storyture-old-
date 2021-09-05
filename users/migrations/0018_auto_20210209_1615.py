# Generated by Django 3.1.6 on 2021-02-09 16:15

from django.db import migrations, models
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0017_auto_20210209_1453'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='prof_pic',
            field=models.ImageField(default='default.jpg', upload_to=users.models.user_directory_path),
        ),
        migrations.AlterField(
            model_name='audience',
            name='country_pass',
            field=models.IntegerField(blank=True, choices=[(0, 'No'), (1, 'Yes'), (2, 'Idk'), (4, 'Not Played')], default=4),
        ),
    ]