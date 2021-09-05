# Generated by Django 3.1.6 on 2021-04-09 22:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('films', '0041_auto_20210407_0425'),
    ]

    operations = [
        migrations.AlterField(
            model_name='film',
            name='mpa_rate',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='mpa_rate_score', to='films.score_mpa'),
        ),
    ]
