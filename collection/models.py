from django.db import models
from films.models import Film
from users.models import Tag, CustomUser

# Create your models here.
class Deleted_Collection(models.Model):

    '''
    Deleted Collections
    To improve: right now in timefield ahhhh!! WOWO THANKS UNIT TESTING!:) 
    '''

    def __str__(self):
        return f"{self.collection_name}"

    time_built = models.TimeField(null=True,default=None)
    time_deleted = models.TimeField(auto_now_add=True)
    #date_deleted = models.DateField(null=True,default=None,auto_now_add=True)
    former_owner = models.ForeignKey(CustomUser,null=True,on_delete=models.SET_NULL)
    collection_name = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    films = models.ManyToManyField(Film)
    follow_count = models.IntegerField(default=0)
    copy_count = models.IntegerField(default=0)
    tags = models.ManyToManyField(Tag, blank=True, related_name="deleted_collection_tags")
    popularity = models.IntegerField(default=0)

    class Privacy(models.IntegerChoices):
        '''
        Privacy setting: who can see the collection?
        '''
        PRIVATE = 0
        PUBLIC = 1
        FRIENDS = 2
    
    privacy = models.IntegerField(choices=Privacy.choices,default=1)

    def migrate_collection(self,deleted):
        self.former_owner = deleted.bya
        self.time_built = deleted.time_built
        self.collection_name = deleted.collection_name
        self.description = deleted.description
        self.popularity = deleted.popularity
        self.follow_count = deleted.followers.all().count()
        self.copy_count = deleted.copied_by.all().count()
        
        for film in deleted.films.all():
            self.films.add(film)
            self.save()
        for tag in deleted.tags.all():
            self.tags.add(tag)
            self.save()
        self.save()