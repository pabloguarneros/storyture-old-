from django.urls import path
from .views import user_profile, rem_bucket, rem_fav, update, WatchNext, GetSuggestedFriends

urlpatterns = [
    path('<str:username>', user_profile, name="user_profile"),
    path('<str:username>/rem_bucket', rem_bucket, name="rem_bucket"),
    path('<str:username>/rem_fav', rem_fav, name="rem_fav"),
    path('<str:username>/update', update, name="update"),
    path('<str:username>/watch_next', WatchNext.as_view(), name="watch_next"),
    path('<str:username>/suggested_friends', GetSuggestedFriends.as_view(), name="suggested_friends"),
]