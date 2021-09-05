from rest_framework import serializers
#from django.utils.timesince import timesince
from django.contrib.humanize.templatetags.humanize import naturaltime
from .models import ActionID, Action, User_Collection, CustomUser, Relationship
from films.models import Film

class ActionIDSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField()

    class Meta:
        model = ActionID
        fields = ['user']

class FilmSerializer(serializers.ModelSerializer):

    class Meta:
        model = Film
        fields = ['movie_ID','year','title']

class TimeField(serializers.RelatedField):
    def to_representation(self,value):
       return naturaltime(value)

class SeenField(serializers.RelatedField):
    def to_representation(self,value):
        request = self.context.get('request', None)
        if request.user in value.all():
            return 1
        else:
            return 0

class ReluserField(serializers.RelatedField):
    
    def to_representation(self,value):
        request = self.context.get('request', None)
        if request.user in value.all():
            return "you"
        else:
            if len(value.all())>0:
                return value.all()[0].username
            #serialized = serializers.StringRelatedField(many=True)
            return ""



class ActionSerializer(serializers.ModelSerializer):

    rel_films = FilmSerializer(many=True)
    rel_users = ReluserField(read_only="True")
    by_user_id = ActionIDSerializer(many=True,read_only=True)
    time = TimeField(read_only="True")
    seen = SeenField(read_only="True")

    class Meta:
        model = Action
        fields = ['pk','time', 'categ', 'seen','rel_collection','rel_films','rel_users','by_user_id']


class PrivateuserField(serializers.RelatedField):

    '''
    Anonymizes the user if the privacy setting of their collection is set to friends or private
    
    To improve:
        - do we need it given on views we are no longer included that privacy concern?
    '''
    
    def to_representation(self,value):
        privacy = self.context.get('privacy', None)
        if privacy == 0 or privacy == 2:
            return "anonymous"
        else:
            return value.username
            #serialized = serializers.StringRelatedField(many=True)


class CollectionSerializer(serializers.ModelSerializer):

    rel_collection = serializers.StringRelatedField(many=True)
    rel_films = FilmSerializer(many=True)
    bya = PrivateuserField(read_only="True")
    by_user_id = ActionIDSerializer(many=True,read_only=True)
    time = TimeField(read_only="True")
    seen = SeenField(read_only="True")

    class Meta:
        model = Action
        fields = ['pk','collection_name','bya','description','followers']


class RelationshipsField(serializers.RelatedField):

    def to_representation(self,value):
        request = self.context.get('request', None)
        if request.user == value:
            return self.context.get('status',None)
        else:
            return ""
class ToPersonSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ('username',)

class RelationshipSerializer(serializers.ModelSerializer):

    #user = serializers.StringRelatedField()
    to_person = ToPersonSerializer()

    class Meta:
        model = Relationship
        fields = ('to_person','status',)

class CustomUserSerializer(serializers.ModelSerializer):

    #relationships = serializers.StringRelatedField(many=True)

    relationships = RelationshipSerializer(many=True,source="from_people")

    class Meta:
        model = CustomUser
        fields = ('prof_pic','username','xp','relationships',)

class CollectionByFilmSerializer(serializers.ModelSerializer):

    class Meta:
        model = Film
        fields = ('title','year','movie_ID','poster_pic')
