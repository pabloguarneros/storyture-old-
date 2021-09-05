# Generated by Django 3.1.5 on 2021-02-01 22:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_customuser_xp'),
    ]

    operations = [
        migrations.CreateModel(
            name='RelationshipType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('types', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='FriendRelationships',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('from_contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='from_contacts', to=settings.AUTH_USER_MODEL)),
                ('to_contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='to_contacts', to=settings.AUTH_USER_MODEL)),
                ('types', models.ManyToManyField(blank=True, related_name='relationship_strength', to='users.RelationshipType')),
            ],
            options={
                'unique_together': {('from_contact', 'to_contact')},
            },
        ),
        migrations.AddField(
            model_name='customuser',
            name='friends',
            field=models.ManyToManyField(related_name='_customuser_friends_+', through='users.FriendRelationships', to=settings.AUTH_USER_MODEL),
        ),
    ]
