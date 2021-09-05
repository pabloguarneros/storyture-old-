from django.urls import path
from .views import collection, collection_update, remove_film, delete_collection,add_films,added_films

urlpatterns = [
    path("<str:collection_pk>", collection, name='collection_main'),
    path("<str:collection_pk>/update", collection_update, name='collection_update'),
    path("<str:collection_pk>/rem_film", remove_film, name='rem_film'),
    path("<str:collection_pk>/delete", delete_collection, name='rem_collection'),
    path("<str:collection_pk>/add_films", add_films, name='collection_add_films'),
    path("<str:collection_pk>/added_films", added_films, name='collection_added_films'),

]