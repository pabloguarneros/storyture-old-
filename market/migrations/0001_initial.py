# Generated by Django 3.1.6 on 2021-02-07 20:50

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
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
                ('svg_link', models.CharField(default='users/market/chair_1.svg', max_length=100)),
            ],
        ),
    ]
