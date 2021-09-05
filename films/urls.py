from django.urls import path

from . import views

#BUT WHAT IS HAPPENING HEREEEEEE
urlpatterns = [
    path("<str:film_name>", views.profile, name="film_profile"),
    path("<str:film_name>/edit", views.edit_film, name="edit_film"),
    #path("push", views.action, name="film_push"),
    path("comment/<str:film_ID>",views.add_comment, name="comment_push"),
    path("commento/<str:film_ID>",views.add_comment_game, name="comment_game_push")

]
