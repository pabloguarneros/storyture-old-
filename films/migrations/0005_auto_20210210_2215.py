# Generated by Django 3.1.6 on 2021-02-10 22:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('films', '0004_auto_20210210_2206'),
    ]

    operations = [
        migrations.AlterField(
            model_name='film',
            name='poster',
            field=models.URLField(default='https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/TRAPPIST-1e_Const_CMYK_Print.png/166px-TRAPPIST-1e_Const_CMYK_Print.png', null=True),
        ),
    ]
