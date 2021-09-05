from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Person, Film, Film_crew, Country, Genre, Tag, Collection, Language, Comment, Citation, Score_MPA, ProdCo, Search, Searchdata

class FilmAdmin(admin.ModelAdmin):
    list_display = ("movie_ID", "title", "year","minutes","dup")
    search_fields = ('movie_ID', 'title','imdb_code')
class CollectionAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
class CountryAdmin(admin.ModelAdmin):
    list_display = ("name","interest_is")
class MpaAdmin(admin.ModelAdmin):
    list_display = ("score","pk")

# Customizing away
admin.site.register(Film, FilmAdmin)
admin.site.register(Collection, CollectionAdmin)
admin.site.register(Film_crew)
admin.site.register(Country,CountryAdmin)
admin.site.register(Person)
admin.site.register(Genre)
admin.site.register(Tag)
admin.site.register(Language)
admin.site.register(Score_MPA,MpaAdmin)
admin.site.register(ProdCo)
admin.site.register(Comment)
admin.site.register(Citation)
admin.site.register(Search)
admin.site.register(Searchdata)