# Generated by Django 3.1.6 on 2021-02-08 21:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0015_auto_20210207_2103'),
    ]

    operations = [
        migrations.AddField(
            model_name='recommend',
            name='message',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='relationship',
            name='msg_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='relationship',
            name='rmmd_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='relationship',
            name='seen_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='relationship',
            name='status',
            field=models.IntegerField(choices=[(0, 'No Relationship'), (1, 'Following'), (2, 'Friends'), (4, 'Blocked')], default=0),
        ),
    ]