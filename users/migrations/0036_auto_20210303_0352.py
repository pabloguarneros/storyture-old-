# Generated by Django 3.1.6 on 2021-03-03 03:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0035_auto_20210302_1752'),
    ]

    operations = [
        migrations.AlterField(
            model_name='freview',
            name='points',
            field=models.IntegerField(blank=True, choices=[(1, 'Do Not Think Of Watching'), (2, 'Nononono'), (3, 'Gonna Regret It'), (4, 'There Are Better Things To Watch'), (5, 'Meh'), (6, 'Go For It'), (7, 'Nice Pick'), (8, 'Great Pick'), (9, 'You Will Love This'), (10, 'Best Film You Will Ever Watch')]),
        ),
    ]