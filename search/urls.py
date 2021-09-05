from django.urls import path

from films.views import action, filmList,tagList,f_collectionList,filmxtagList, filmMain, filmExtended, browseFilms, countryList, genreList, tagRestrictedList, filmsFeaturedCollection
from .views import film_search, search
from users.views import actionList, userList, collection_x_filmList, userMain
from collection.views import collectionMain

urlpatterns = [
    path("",search,name="search"),
    path("f_push", action, name="film_push"),
    path("f_tally",film_search, name="term_push"),
    path("api/film/<str:film_ID>",filmList.as_view(),name="film_api"),
    path("api/tag",tagList.as_view(),name="tag_api"),
    path("api/f_collection",f_collectionList.as_view(),name="f_collection_api"),
    path("api/tag_restricted",tagRestrictedList.as_view(),name="tag_restricted_api"),
    path("api/country",countryList.as_view(),name="country_api"),
    path("api/genre",genreList.as_view(),name="genre_api"),
    path("api/film_by_tag",filmxtagList.as_view(),name="filmxtags"),
    path("api/film_extended",filmExtended.as_view(),name="film_extended"),
    path("api/film_f_collection",filmsFeaturedCollection.as_view(),name="film_f_collection"),
    path("api/user_feed",actionList.as_view(),name="newsfeed"),
    path("api/find_users",userList.as_view(),name="find_users"),
    path("api/collection_x_film",collection_x_filmList.as_view(),name="films_in_collection"),
    path("api/film_main",filmMain.as_view(),name="film_api"),
    path("api/collection_main",collectionMain.as_view(),name="film_api"),
    path("api/friend_main",userMain.as_view(),name="film_api"),
    path("api/browse_films",browseFilms.as_view(),name="browse_films_api")
]
