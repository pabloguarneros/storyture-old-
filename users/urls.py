from django.urls import path
from django.contrib.auth import views as auth_views

from . import views
from films.models import Film



urlpatterns = [
    path('', views.my_profile, name="logs"),
    path('add_click',views.add_click,name="add_click"),
    path('change', views.change_friend, name="change_friend"),
    path('me', views.my_profile, name="my_profile"),
    path("feedback", views.feedback, name="feedback"),
    path('notif_seen',views.seen_delete_notif,name="seen_delete_notif"),

]