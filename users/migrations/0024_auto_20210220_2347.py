# Generated by Django 3.1.6 on 2021-02-20 23:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0023_citation_comment'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='by',
        ),
        migrations.RemoveField(
            model_name='comment',
            name='hover_time',
        ),
        migrations.RemoveField(
            model_name='comment',
            name='replies',
        ),
        migrations.DeleteModel(
            name='Citation',
        ),
        migrations.DeleteModel(
            name='Comment',
        ),
    ]