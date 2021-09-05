from django.db import models

class Market(models.Model):
    item_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30)
    
    class Market_Categ(models.IntegerChoices):
        THEATRE = 0
        PROJECTOR = 1
        SPEAKER = 2
        POPCORN = 3
        SEAT = 4

    categ = models.IntegerField(choices=Market_Categ.choices,blank=True)

    lvl = models.IntegerField()
    #svg = models.FileField(upload_to='market/', max_length=100, null=True,blank=True)
    cost = models.IntegerField()
    describe =  models.TextField(blank=True)
    svg_link = models.CharField(max_length=100, default="market/icons/chair_1.svg")
    level_up = models.ForeignKey('self', blank=True,null=True,on_delete=models.SET_NULL)

    def __str__(self):
        return f'{self.categ} ({self.lvl})'