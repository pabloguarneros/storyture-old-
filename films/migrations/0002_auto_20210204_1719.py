# Generated by Django 3.1.5 on 2021-02-04 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('films', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='film',
            name='poster',
            field=models.URLField(default='https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/TRAPPIST-1e_Const_CMYK_Print.png/166px-TRAPPIST-1e_Const_CMYK_Print.png'),
        ),
    ]