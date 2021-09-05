from django.db import models

# Create your models here.

class Meta(models.Model):

    title_id = models.CharField(max_length=15,primary_key=True)
    title_print =models.CharField(max_length=70)
    description = models.TextField(null=True, default=None)
    text=models.TextField()
    hide_bot = models.BooleanField(default=1)
