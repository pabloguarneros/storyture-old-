from rest_framework import serializers
from films.models import Country, Film
from users.models import Audience, CustomUser

class WatchNextSerializer(serializers.ModelSerializer):

    class Meta:
        model = Audience
        fields = ['rating','movie']

class CountrySerializer(serializers.ModelSerializer):

    class Meta:
        model = Country
        fields = ['name','emoji_1','emoji_2']

class UserSerializer(serializers.ModelSerializer):

    country = CountrySerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = ['username','prof_pic','xp','country']