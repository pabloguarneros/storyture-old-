# Generated by Django 3.1.6 on 2021-04-02 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0061_remove_customuser_ab_groups'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='ab_groups',
            field=models.CharField(default='00010100000011010', max_length=17),
        ),
    ]
