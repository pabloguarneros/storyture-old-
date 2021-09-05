from rest_framework import serializers
from users.models import User_Collection

class CollectionSerializer(serializers.ModelSerializer):

    film_property_count = serializers.Field(source='film_property_count')

    tags = serializers.StringRelatedField(many=True)
    bya = serializers.StringRelatedField()

    class Meta:
        model = User_Collection
        fields = ['id','collection_name','tags','bya','film_property_count']

    @property
    def film_property_count(self):
        return self.films.count


