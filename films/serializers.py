from rest_framework import serializers
from .models import Film, Tag, Country, Genre, Collection


#for more https://www.youtube.com/watch?v=tG6O8YF91HE


class FilmSerializer(serializers.ModelSerializer):

    class Meta:
        model = Film
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ['name']

class F_CollectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Collection
        fields = ['name','active'] 

class GenreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Genre
        fields = ['name']

class CountrySerializer(serializers.ModelSerializer):

    class Meta:
        model = Country
        fields = ['name']

class FilmTagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Film
        fields = ['movie_ID','poster_pic']

class FilmMainSerializer(serializers.ModelSerializer):

    class Meta:
        model = Film
        fields = ['title','movie_ID','poster_pic']

class FilmExtendedSerializer(serializers.ModelSerializer):

    class Meta:
        model = Film
        fields = ['title','year','movie_ID','poster_pic']

class BrowseFilmSerializer(serializers.ModelSerializer):

    class Meta:
        model = Film
        fields = ['title','movie_ID','poster_pic','synopsis','genre','country']