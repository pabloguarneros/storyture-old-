# Generated by Django 3.1.6 on 2021-02-09 16:27

from django.db import migrations, models
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0018_auto_20210209_1615'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='prof_pic',
            field=models.ImageField(default='prof_pics/ninja.png', upload_to=users.models.user_directory_path),
        ),
    ]
