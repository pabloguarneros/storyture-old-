from django.db import models
from django.db.models import Q
from django.core.files.base import ContentFile
from PIL import Image

# Create your models here.

class Citation(models.Model):
    title = models.CharField(max_length=120)
    url = models.CharField(max_length=400)
    description = models.TextField(blank=True)

class Genre(models.Model): 

    def __str__(self):
	    return f"{self.name}"

    name = models.CharField(primary_key=True, max_length=30)

class Tag(models.Model): 

    def __str__(self):
	    return f"{self.name}"

    name = models.CharField(primary_key=True, max_length=30)
    emoji_1 = models.IntegerField(blank=True,null=True)
    emoji_2 = models.IntegerField(blank=True,null=True)
    emoji_3 = models.IntegerField(blank=True,null=True)
    emoji_4 = models.IntegerField(blank=True,null=True)

class ProdCo(models.Model): 

    def __str__(self):
	    return f"{self.name}"

    name = models.CharField(primary_key=True, max_length=120)

class Score_MPA(models.Model): 

    def __str__(self):
	    return f'{self.score}'

    score = models.CharField(primary_key=True, max_length=30)
    title = models.CharField(max_length=30)
    explanation = models.CharField(max_length=250)

class Country(models.Model): 

    def __str__(self):
	    return f"{self.name}"

    name = models.CharField(primary_key=True, max_length=38)
    emoji_1 = models.IntegerField(blank=True,null=True)
    emoji_2 = models.IntegerField(blank=True,null=True)
    #enemy = models.ManyToManyField('self',blank=True, symmetrical=False,related_name="enemies_of")
    #friend = models.ManyToManyField('self',blank=True,symmetrical=False,related_name="friends_of")
    interest = models.ManyToManyField('self',blank=True)

    interest_is = models.BooleanField(default=0)

    class Meta:

            verbose_name_plural = "Countries"

class Language(models.Model):

    def __str__(self):
	    return f"{self.name}"

    name = models.CharField(max_length=40,primary_key=True)

class Person(models.Model):

    def __str__(self):
	    return f"{self.name}"

    name = models.CharField(max_length=40)
    birth_year = models.CharField(max_length=4,blank=True)
    death_year = models.CharField(max_length=4,blank=True)
    alive = models.BooleanField()
    roles = models.TextField(blank=True)
    
    active_storyture = models.BooleanField()

def poster_directory_path(instance, filename): 
    # file will be uploaded to MEDIA_ROOT / user_<id>/<filename> 
    return 'posters/{0}/{1}'.format(instance.movie_ID, f"{filename}") 

class Film(models.Model):
	
    def __str__(self):
        return f"{self.title} ({self.year})"

    def get_absolute_url(self):
        return "/film/%i/" % self.movie_ID

    class Meta:
        ordering = ['-year']
    
    movie_ID = models.AutoField(primary_key=True)
    title = models.CharField(max_length=240,blank=True,null=True)
    alt_tt_1 = models.CharField(max_length=240,blank=True,null=True,default="")
    alt_tt_2 = models.CharField(max_length=240,blank=True,null=True,default="")

    up_votes = models.IntegerField(blank=True,null=True,default=0) #how many people say it's genuine
    down_votes = models.IntegerField(blank=True,null=True,default=0) #bullshit score
    recs = models.IntegerField(blank=True,null=True,default=0) #how many times the film is recommended

    up_bech = models.IntegerField(blank=True,null=True,default=0) #how many people say it's genuine
    down_bech = models.IntegerField(blank=True,null=True,default=0) #bullshit score

    up_country = models.IntegerField(blank=True,null=True,default=0) #how many people say it's genuine
    down_country = models.IntegerField(blank=True,null=True,default=0) #how many people say it's genuine

    year = models.CharField(max_length=4)
    country = models.ManyToManyField(Country, blank=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name="tags")

    language = models.ManyToManyField(Language, blank=True)
    mpa_rate = models.ForeignKey(Score_MPA, blank=True,null=True,related_name="mpa_rate_score", default=None,on_delete=models.SET_NULL)
    minutes = models.IntegerField(blank=True,null=True,default=0)
    genre = models.ManyToManyField(Genre, blank=True, related_name="film_genres")
    synopsis = models.TextField(blank=True,null=True)

    trailer = models.URLField(blank=True,null=True)

    imdb_score = models.FloatField(blank=True,null=True)
    rotten_score = models.IntegerField(blank=True,null=True)
    productions = models.ManyToManyField(ProdCo,blank=True)
    imdb_code = models.CharField(max_length=12,blank=True)

    co2_t = models.IntegerField(blank=True,null=True,default=None)

    dup = models.BooleanField(default=0) #if movie was duplicated when cleaning! activated with scripts

    poster_pic = models.ImageField(default=f'posters/default/poster.jpg',upload_to=poster_directory_path)
    poster = models.URLField(max_length=500,default="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/TRAPPIST-1e_Const_CMYK_Print.png/166px-TRAPPIST-1e_Const_CMYK_Print.png",null=True)

    class Netflix(models.IntegerChoices):
        NOT_FILM = 2
        NO_ACCESS = 0
        ALL_GOOD = 1
    
    net_alert = models.IntegerField(choices=Netflix.choices,blank=True,null=True,default=None)
    net_id = models.IntegerField(blank=True,null=True,default=None)

    def save(self, *args, **kawrgs):
        super().save(*args, **kawrgs)

        img = Image.open(self.poster_pic.path)

        if img.width > 220 or img.height > 320:
            new_img = (220, 320)
            img.thumbnail(new_img)
            img = img.convert('RGB') #convert transparency to new image!
            img.save(self.poster_pic.path)  # saving image at the same path


    def get_similar_beta(self):
        country = self.country.all()
        similars = Film.objects.filter(
            Q(country__name__in=country)
        )
        return similars[0:10]

    def get_bech(self):
        if self.up_bech > self.down_bech:
            return 1
        else:
            return 0

    def get_similar(self):

        tags = self.tags.all()
        country = self.country.all()
        genre = self.genre.all()
        if self.year:
            year = int(self.year)
            years = [str(i) for i in range(year-3,year+3)]
        else:
            years = [str(i) for i in range(1990,2010)]
        if self.imdb_score:
            imdb = self.imdb_score - .6
        else:
            imdb = 5

        return Film.objects.filter(
            Q(tags__name__in=tags)
            | Q(country__name__in=country)
            & Q(year__in=years)   #HOW TO GET MAX VALUE HERE!!!
            & Q(genre__name__in=genre)
            & Q(imdb_score__gte=imdb)
            & Q()
            ).distinct().exclude(Q(movie_ID__exact=self.movie_ID))[0:50]

    def get_value(self):
        value = 0
        
        for i in self.title:
            value += ord(i)

        return value

    def score(self):
        if self.up_votes == 0 and self.down_votes == 0:
            return "na"
        else:
            if self.down_votes == 0:
                return "10"
            ratio = self.up_votes / self.down_votes
            if ratio > 100:
                return "10"
            elif ratio < 0.01:
                return "0"
            elif ratio >= 1:
                return str(round(ratio/20 + 5,1))
            elif ratio < 1:
                return str(round(ratio*5,1))

    def env_score(self):
        if not self.co2_t:
            return "na"
        else:
            film_t = self.co2_t
            avg_t = 500 #according to #UCLA 2006
            distance = film_t - avg_t
            if abs(distance) < 200:
                return "avg"
            elif distance > 0: #distance positive
                return "bad"
            elif distance < 0:
                return "good"
    
    def copy_instance(self,to_copy):
        self.title = to_copy.title
        self.alt_tt_1 = to_copy.alt_tt_1
        self.alt_tt_2 = to_copy.alt_tt_2
        self.year = to_copy.year
        self.synopsis = to_copy.synopsis
        self.trailer = to_copy.trailer
        self.co2_t = to_copy.co2_t

        picture_copy = ContentFile(to_copy.poster_pic.read())
        new_picture_name = to_copy.poster_pic.name.split("/")[-1] #splits by / into list, gets last element, the file name!
        self.poster_pic.save(new_picture_name, picture_copy)

        #self.poster_pic = to_copy.poster_pic 

        self.country.clear()
        if to_copy.country:
            for c in [country for country in to_copy.country.all()]:
                self.country.add(c)

        self.productions.clear()
        '''
        if to_copy.productions:
            for p in [production for production in to_copy.productions.all()]:
                self.productions.add(p)
        '''
        self.tags.clear()
        if to_copy.tags:
            for t in [tag for tag in to_copy.tags.all()]:
                self.tags.add(t)

        if to_copy.language:
            self.language.clear()
            for l in [language for language in to_copy.language.all()]:
                self.language.add(l)

        if to_copy.genre:
            self.genre.clear()
            for g in [genre for genre in to_copy.genre.all()]:
                self.genre.add(g)
        
        if to_copy.rotten_score:
            self.rotten_score = to_copy.rotten_score 
        if to_copy.imdb_score:
            self.imdb_score = to_copy.imdb_score 
        if to_copy.minutes:
            self.minutes = to_copy.minutes 
        
        self.save()


class Comment(models.Model):
    
    def __str__(self):
        return f"On {self.film} by {self.bya}"
    
    film = models.ForeignKey(Film, null=True, related_name='film_about', on_delete=models.SET_NULL)
    content = models.TextField()
    bya = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    # time = models.DateField(default="2020/")
    hover_time = models.ManyToManyField(Citation,blank=True)
    replies = models.ManyToManyField('self',blank=True)

class Search(models.Model):

    def __str__(self):
        return f"{self.search}"

    search = models.CharField(max_length=200)
    films = models.ManyToManyField(Film, through='Searchdata',symmetrical=True,
                                    related_name='search_hits')

class Searchdata(models.Model):

    def __str__(self):
        return f"{self.search}-{self.film}"

    film = models.ForeignKey(Film, related_name='movie_clicked', on_delete=models.CASCADE)
    search = models.ForeignKey(Search, related_name='search_term', on_delete=models.CASCADE)
    count = models.IntegerField(default=0)


class Film_crew(models.Model):

    def __str__(self):
	    return f"{self.film}"

    film = models.OneToOneField(Film,on_delete=models.CASCADE,default="1",related_name="film_crew") 
    director = models.ManyToManyField(Person, blank=True, related_name="director_persons")
    writer = models.ManyToManyField(Person, blank=True, related_name="writer_persons")
    production_design = models.ManyToManyField(Person, blank=True, related_name="production_person")
    casting_director = models.ManyToManyField(Person, blank=True, related_name="casting_person")
    actors = models.ManyToManyField(Person, blank=True, related_name="actor_persons")
	
class Collection(models.Model):

    def __str__(self):
        return f"{self.name}"

    name = models.CharField(max_length=72,unique=True)
    active = models.BooleanField(default=0)
    films = models.ManyToManyField(Film, blank=True, related_name="film_collections")
