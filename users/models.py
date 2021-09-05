from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
import random
from django.conf import settings
from PIL import Image
from films.models import Person, Film, Country, Searchdata, Language, Genre, Tag, ProdCo
from market.models import Market
from django.db.models import Q, Count
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist

def user_directory_path(instance, filename): 
    # file will be uploaded to MEDIA_ROOT / user_<id>/<filename> 
    return 'prof_pics/user_{0}/{1}'.format(instance.username, f"{filename}") 

def bi_string():
    string = ""
    for i in range(17):
        string += str(random.randint(0,1))
    return string

class CustomUser(AbstractUser):

    '''
    Profile for each user.
    
    '''

    def get_absolute_url(self):
        return f"/user/{self.username}/"


    email = models.EmailField('email', unique=True)
    prof_pic = models.ImageField(default='prof_pics/ninja.png',upload_to=user_directory_path)
    # access actions with self.user_actions.actions.all()
    ab_groups = models.CharField(default=bi_string,max_length=17)
    purpose = models.TextField(default="For me, films are a way to...")
    theatre_name = models.CharField(max_length=60,default="My Theatre")
    stage = models.ForeignKey(Market, on_delete=models.PROTECT, default=1,related_name="theatre")
    speaker = models.ForeignKey(Market, on_delete=models.PROTECT, default=3, related_name="speaker")
    seat = models.ForeignKey(Market, on_delete=models.PROTECT,default=4, related_name="seat")
    projector = models.ForeignKey(Market, on_delete=models.PROTECT,default=2, related_name="projector")
    popcorn = models.ForeignKey(Market, on_delete=models.PROTECT,default=25, related_name="popcorn")

    level = models.IntegerField(default=1)
    xp = models.IntegerField(default=0)
    kn = models.IntegerField(default=0)

    searches = models.ManyToManyField(Searchdata, blank=True)
    country = models.ManyToManyField(Country, blank=True, default="''")
    fav_films = models.ManyToManyField(Film, blank=True, related_name="fav_film")
    bucket_list = models.ManyToManyField(Film, blank=True, related_name="bucket_list")
    former_bucket = models.ManyToManyField(Film, blank=True, related_name="rip_bucket")
    role_models = models.ManyToManyField(Person, blank=True)

    films = models.ManyToManyField(Film, through='Audience',
                                           symmetrical=False,
                                           related_name='recommending_to')
    relationships = models.ManyToManyField('self', through='Relationship',
                                           symmetrical=False,
                                           related_name='related_to')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        img = Image.open(self.prof_pic.path)

        if img.height > 250 or img.width > 250:
            new_img = (250, 250)
            img.thumbnail(new_img)
            img = img.convert('RGB') #convert transparency to new image!
            img.save(self.prof_pic.path)  # saving image at the same path

    def send_request(self,friend):


        m_self, _ = Relationship.objects.get_or_create(
            from_person=self,
            to_person=friend)

        m_friend, _  = Relationship.objects.get_or_create(
            from_person=friend,
            to_person=self)

        m_self.status=1
        m_self.save()

        m_friend.status=0
        m_friend.save()

        ##this later on, when all users have action you sub it!
        action_ID, _ = ActionID.objects.get_or_create(user=self)
        action_ID.add_act(3,rel_users=friend)
    
    def acc_request(self,friend):

        '''
        Accepted Request
            self(object): friend that is doing the accepting
            friend(object): friend who got accepted
        '''

        m_self = Relationship.objects.get(
            from_person=self,
            to_person=friend)
        m_friend  = Relationship.objects.get(
            from_person=friend,
            to_person=self)
        
        if m_self and m_friend:
            m_self.status=2
            m_self.save()

            m_friend.status=2
            m_friend.save()

            ##this later on, when all users have action you sub it!
            action_ID, created = ActionID.objects.get_or_create(user=self)
            action_ID.add_act(2,rel_users=friend)

        else:
            return "No Relationship Identified"

    def cancel_request(self,friend):
        m_self = Relationship.objects.get(
            from_person=self,
            to_person=friend)
        m_self.status=0
        m_self.save()
    
    def block_friend(self,friend):
        m_self = Relationship.objects.get(
            from_person=self,
            to_person=friend)
        m_friend  = Relationship.objects.get(
            from_person=friend,
            to_person=self)
        
        if m_self and m_friend:
            m_self.status=4
            m_self.save()

            m_friend.status=4
            m_friend.save()

        else:
            return "No Relationship Identified"

    def rem_friend(self,friend):
        m_self = Relationship.objects.get(
        from_person=self,
        to_person=friend)
        m_friend  = Relationship.objects.get(
        from_person=friend,
        to_person=self)
        
        if m_self and m_friend:
            m_self.status=0
            m_self.save()

            m_friend.status=0
            m_friend.save()

        else:
            return "No Relationship Identified"

    def get_friends(self):

        return self.relationships.filter(
            to_people__status=2,
            to_people__from_person=self,
            from_people__status=2,
            from_people__to_person=self)
    
    def get_friends_sorted(self):

        return self.relationships.filter(
            to_people__status=2,
            to_people__from_person=self,
            from_people__status=2,
            from_people__to_person=self).order_by('-to_people__visits_to')

    def get_requests(self):
        return self.related_to.filter(
            from_people__status=1, #from person following
            from_people__to_person=self,
            to_people__status=0, #to_person rec being sent, they are still in null
            to_people__from_person=self)

    def get_users_requests_sent(self):
        return self.related_to.filter(
            from_people__status=0, #from person following
            from_people__to_person=self,
            to_people__status=1, #to_person rec being sent, they are still in null
            to_people__from_person=self)
            
    def get_movie_recommendations(self):
        recs = Recommend.objects.all().filter(to_person=self)
        if recs:
            return recs
        else:
            return ""
    
    def has_seen(self,film):

        h_seen, _ = Audience.objects.get_or_create(
            audience=self,
            movie=film)
        if h_seen.seen == 1:
            return 1
        else:
            return 0

    def add_bucket(self, film):

        action_ID, _ = ActionID.objects.get_or_create(user=self)
        action_ID.add_act(6,rel_films=film)
    
        self.bucket_list.add(film)

    def add_fav(self,film):

        action_ID, _ = ActionID.objects.get_or_create(user=self)
        action_ID.add_act(5,rel_films=film)

        self.fav_films.add(film)

    def has_rev(self,film,friend):
        return Freview.objects.filter(from_person=self,to_person=friend,film=film).exists()

    def has_rec(self,film,friend):
        return Recommend.objects.filter(from_person=friend,to_person=self,film=film).exists()

    def get_users_shared_preference(self):
        seen_films = Audience.objects.filter(seen=1,audience=self)
        audiences = []
        users = []
        for film in seen_films.all():
            audiences.append(Audience.objects.filter(seen=1,movie=film.movie).exclude(audience=self))
        for instances in audiences:
            for instance in instances.all():
                if instance.audience not in users:
                    users.append(instance.audience)  
        return users

    def to_like(self): 
        users = self.get_users_shared_preference()
        films_to_rec = []
        for user in users:
            if len(films_to_rec) < 20:
                favs = [film for film in user.fav_films.all()]
                for i in favs:
                    fav_bool = i in self.fav_films.all() 
                    buck_bool = i in self.bucket_list.all()
                    if not fav_bool and not buck_bool:
                        films_to_rec.append(i)
            else:
                return films_to_rec
        return films_to_rec

    def get_users_mutual_friends(self):
        mutuals = []
        current_friends = self.get_friends()
        for friend in current_friends:
            friend_friends = friend.get_friends()
            for pos_friend in friend_friends:
                if pos_friend != self and pos_friend not in current_friends:
                    mutuals.append(pos_friend)
        #mutuals.order_by("count")
        return mutuals

    def get_users_same_country(self):
        countries = [country.name for country in self.country.all()]
        q_objects = Q()
        for country in countries:
            q_objects |= Q(country__name__contains=country)
        return CustomUser.objects.filter(q_objects).distinct().exclude(username=self.username)

    def get_users_related_countries(self):
        return CustomUser.objects.filter(Q(country__interest__in=self.country.all())).distinct().exclude(username=self.username)

    def get_users_similar_bucket_lists(self):
        bucket = [film.title for film in self.bucket_list.all()]
        if len(bucket) == 0:
            return ""
        q_objects = Q()
        for film in bucket:
            q_objects |= Q(fav_films__title__contains=film)
        return CustomUser.objects.filter(q_objects).distinct().exclude(username=self.username)

    def get_collections(self,present=True,privacy="public"):
        user_subset = User_Collection.objects.all().filter(bya=self)
        if present == True: #WOWOW THIS IS SOO COOL, so you first annotate what is the count of the films in many category and then you filter by it being "gt", greater than 0!
            user_subset = user_subset.annotate(film_count=Count('films')).filter(film_count__gt=0) #greater than 0!
        if privacy == "private":
            return user_subset
        elif privacy == "friends":
            return user_subset.filter(Q(privacy=1)|Q(privacy=2))
        else:
            return user_subset.filter(privacy=1)

class Audience(models.Model):
    '''
    to include: time they watch the trailer!!  : ) 
    with this, youll get to recommend suggest films and well offer new browsing experience for users! :) 
    filter out all those that have 0 seconds as they most likely not have a trailer! :) 
    wait how to send ajax on page terminated! .. oooo
    but what if they click on link and leave the page :( --> well then we want to ommit that
    yeye have first users be the ones that use that feature of trailers and how that aids retention!! LOLOLOLOL
    '''
    audience = models.ForeignKey(CustomUser, related_name='audience_from', on_delete=models.CASCADE)
    movie = models.ForeignKey(Film, related_name='movie_to', on_delete=models.CASCADE)
    seen = models.BooleanField(default=0)
    rating = models.FloatField(blank=True,null=True)

    class Authentico(models.IntegerChoices):
        NO = 0
        YES = 1
        IDK = 2
        NOT_PLAYED = 4

    country_pass = models.IntegerField(choices=Authentico.choices,blank=True,default=4)
    trailer_time_seconds = models.IntegerField(blank=True,default=0)

class Relationship(models.Model):
    RELATIONSHIP_NULL = 0
    RELATIONSHIP_FOLLOWING = 1
    RELATIONSHIP_FRIEND = 2
    RELATIONSHIP_BLOCKED = 4
    RELATIONSHIP_STATUSES = (
        (RELATIONSHIP_NULL, 'No Relationship'),
        (RELATIONSHIP_FOLLOWING, 'Following'),
        (RELATIONSHIP_FRIEND, 'Friends'),
        (RELATIONSHIP_BLOCKED, 'Blocked'),)

    from_person = models.ForeignKey(CustomUser, related_name='from_people', on_delete=models.CASCADE)
    to_person = models.ForeignKey(CustomUser, related_name='to_people', on_delete=models.CASCADE)
    status = models.IntegerField(choices=RELATIONSHIP_STATUSES,default=0)
    rmmd_count = models.IntegerField(default=0)
    msg_count = models.IntegerField(default=0)
    visits_to = models.IntegerField(default=0)

class Recommend(models.Model):
    from_person = models.ForeignKey(CustomUser, related_name='recommend_from', on_delete=models.CASCADE)
    to_person = models.ForeignKey(CustomUser, related_name='recommend_to', on_delete=models.CASCADE)
    film = models.ForeignKey(Film,related_name='rec_movie', on_delete=models.CASCADE)
    message = models.TextField(default="Yo, you should probably watch this!", blank=True)

class Freview(models.Model):
    #initialize as if the to_person is self and the from person is one added
    from_person = models.ForeignKey(CustomUser, related_name='review_from', on_delete=models.CASCADE)
    to_person = models.ForeignKey(CustomUser, related_name='review_to', on_delete=models.CASCADE)
    film = models.ForeignKey(Film,related_name='rev_movie', on_delete=models.CASCADE)
    message = models.TextField(default="Lemme know if this helps!", blank=True)
    
    class Points(models.IntegerChoices):
        DO_NOT_THINK_OF_WATCHING = 1
        NONONONO = 2
        GONNA_REGRET_IT = 3
        THERE_ARE_BETTER_THINGS_TO_WATCH = 4
        MEH = 5
        GO_FOR_IT = 6
        NICE_PICK = 7
        GREAT_PICK = 8
        YOU_WILL_LOVE_THIS = 9
        BEST_FILM_YOU_WILL_EVER_WATCH = 10

    points = models.IntegerField(choices=Points.choices,blank=True,null=True)

class Feedback(models.Model):

    def __str__(self):
        return f"{self.feedback[0:20]}..."


    feedback = models.TextField() #user feedback
    bya = models.ForeignKey(CustomUser, null=True, on_delete=models.SET_NULL)
    checked = models.BooleanField(default=0)

    '''
    def not_checked(self):
        return self.objects.filter(checked=0)
    '''

class Film_Feedback(models.Model):

    '''
    Feedback about the movie, if the user spotted any errors
    '''

    def __str__(self):
        return f"{self.film.title}->{self.feedback[0:16]}..."

    feedback = models.TextField()
    film = models.ForeignKey(Film,on_delete=models.CASCADE)
    bya = models.ForeignKey(CustomUser, null=True, on_delete=models.SET_NULL)
    resolved = models.BooleanField(default=0)

    
    '''
    def not_checked(self):
        print("at_least checking")
        return self.objects.filter(resolved=0)
    '''

def dummy_poster_directory_path(instance, filename): 
    # file will be uploaded to MEDIA_ROOT / user_<id>/<filename> 
    return 'dummy_posters/{0}/{1}'.format(instance.title, f"{filename}") 

class DummyFilm(models.Model):
	
    '''
    Film serves as an instance before the administrator pushes it as new or updated film
    '''

    def __str__(self):
        return f"{self.title} ({self.year})"

    bya = models.ForeignKey(CustomUser, null=True, related_name='update_pushed_by', on_delete=models.SET_NULL)
    checked = models.BooleanField(default=0)
    movie_ID = models.IntegerField(blank=True, null=True)

    new_film = models.BooleanField(default=0)

    title = models.CharField(max_length=240,blank=True,null=True)
    alt_tt_1 = models.CharField(max_length=240,blank=True,null=True,default="")
    alt_tt_2 = models.CharField(max_length=240,blank=True,null=True,default="")

    poster_pic = models.ImageField(default=f'posters/default/poster.jpg',upload_to=dummy_poster_directory_path)

    year = models.CharField(max_length=4)
    country = models.ManyToManyField(Country, blank=True)
    language = models.ManyToManyField(Language, blank=True)
    genre = models.ManyToManyField(Genre, blank=True, related_name="dummy_film_genres")

    synopsis = models.TextField(blank=True,null=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name="dummy_tags")

    trailer = models.URLField(blank=True,null=True)
    minutes = models.IntegerField(blank=True,null=True,default=0)
    productions = models.ManyToManyField(ProdCo,blank=True)
    imdb_score = models.FloatField(blank=True,null=True)
    rotten_score = models.IntegerField(blank=True,null=True)

    co2_t = models.IntegerField(blank=True,null=True,default=None)


    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        img = Image.open(self.poster_pic.path)

        if img.width > 220 or img.height > 320:
            new_img = (220, 320)
            img.thumbnail(new_img)
            img = img.convert('RGB') #convert transparency to new image!
            img.save(self.poster_pic.path)  # saving image at the same path

def collection_directory_path(instance, filename): 
    # file will be uploaded to MEDIA_ROOT / user_<id>/<filename> 
    return 'collections/{0}/{1}'.format(instance.collection_name, f"{filename}") 

class User_Collection(models.Model):

    '''
    User collections

    
    '''

    def get_absolute_url(self):
        return "/collections/%i/" % self.pk

    def __str__(self):
        return f"{self.collection_name} by {self.bya}"

    collection_name = models.CharField(max_length=20)
    bya = models.ForeignKey(CustomUser,null=True,default=None,on_delete=models.SET_NULL,related_name="collection_creator")
    time_built = models.TimeField(auto_now_add=True,null=True)
    description = models.TextField(blank=True)
    films = models.ManyToManyField(Film)
    followers = models.ManyToManyField(CustomUser,blank=True,related_name="collection_followers")
    copied_by = models.ManyToManyField(CustomUser,blank=True,related_name="copied_by")
    tags = models.ManyToManyField(Tag, blank=True, related_name="collection_tags")
    image = models.ImageField(null=True,blank=True,upload_to=collection_directory_path,default="collections/default/pink.png")
    popularity = models.IntegerField(default=0)

    @property
    def film_property_count(self):
        return self.films.count

    class Privacy(models.IntegerChoices):
        '''
        Privacy setting: who can see the collection?
        '''
        PRIVATE = 0
        PUBLIC = 1
        FRIENDS = 2
    
    privacy = models.IntegerField(choices=Privacy.choices,default=1)

    def add_film(self,film):
        self.films.add(film)
        self.save()

    def change_films(self,films):
        self.films.clear()
        for film in films:
            film_object = Film.objects.get(movie_ID=film)
            self.films.add(film_object)
            self.save()

    def rem_film(self,film):
        self.films.remove(film)
        self.save()

    def add_follow(self,user):
        self.followers.add(user)
        self.popularity += 1
        self.save()

    def rem_follow(self,user):
        self.followers.remove(user)
        self.popularity -= 1
        self.save()

    def duplicate(self,user):
        self.copied_by.add(user)
        self.popularity += 2
        self.save()
        duplicate = self
        if len(self.films.all()) > 0:
            films_to_add = [film for film in self.films.all()]
        else:
            films_to_add = None
        if len(self.tags.all()) > 0:
            tags_to_add = [tag for tag in self.tags.all()]
        else:
            tags_to_add = None
        duplicate.pk = None
        duplicate.bya = user
        duplicate.save()
        if films_to_add:
            for film in films_to_add:
                duplicate.films.add(film)
                #duplicate.save()
        if tags_to_add:
            for tag in tags_to_add:
                duplicate.tags.add(tag)
                #duplicate.save()
        duplicate.save()
'''
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        img = Image.open(self.image.path)

        if img.height > 300 or img.width > 300:
            new_img = (300, 300)
            img.thumbnail(new_img)
            img = img.convert('RGB') #convert transparency to new image!
            img.save(self.image.path)  # saving image at the same path
'''

class Action(models.Model):

    def __str__(self):
        return f"{self.categ}@{self.time}"

    time = models.DateTimeField(auto_now_add=True)
    rel_users = models.ManyToManyField(CustomUser,blank=True,related_name="about_me")
    rel_films = models.ManyToManyField(Film,blank=True)
    rel_collection = models.ManyToManyField(User_Collection,blank=True)
    
    class ActionCateg(models.IntegerChoices):
        MADE_REC = 1 
        ACC_FRIEND = 2 
        SENT_FRIEND = 3 
        WATCHED = 4 
        ADD_FAV = 5 
        ADD_BUCK = 6 
        ADD_COLL = 7 
        UPG_THEATRE = 8 
        UPG_SPEAKER = 9 
        UPG_SEAT = 10 
        UPG_PROJECTOR = 11 
        UPG_POPCORN = 12 
        
    categ = models.IntegerField(choices=ActionCateg.choices,null=True)
    seen = models.ManyToManyField(CustomUser,blank=True,related_name="seen_by_me")
    removed = models.ManyToManyField(CustomUser,blank=True,related_name="removed_by_me")

    def add_seen(self,user):
        self.seen.add(user)
        self.save()

    def add_rem(self,user):
        self.removed.add(user)
        self.save()

    def if_seen(self,user):
        '''
        If user has seen action.
        Currently not being used!
        '''
        if user in self.seen.objects.all():
            return True
        else:
            return False
    
    def if_rem(self,user):
        '''
        If user has removed action.
        Currently not being used!
        '''
        if user in self.removed.objects.all():
            return True
        else:
            return False

class ActionID(models.Model):
    actions = models.ManyToManyField(Action,blank=True, related_name="by_user_id")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="user_action")

    def add_act(self, categ,rel_users=None,rel_films=None,rel_collection=None):
        
        '''
        Adds an action to many-to-many field.
        rel_users, rel_films, rel_collections are objects

        To improve: when sending lists in rel_users and rel_films
        '''
        action = Action.objects.create(categ=categ)

        if rel_users != None:
            action.rel_users.add(rel_users)
            action.save()

        if rel_films != None:
            action.rel_films.add(rel_films)
            action.save()

        if rel_collection != None:
            action.rel_collection.add(rel_collection)
            action.save()
        
        self.actions.add(action)
        self.save()