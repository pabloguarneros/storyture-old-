# Generated by Django 3.1.5 on 2021-02-02 02:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_auto_20210202_0223'),
    ]

    operations = [
        migrations.DeleteModel(
            name='FriendRelationships',
        ),
        migrations.DeleteModel(
            name='RelationshipType',
        ),
    ]
