from django.urls import path
from . import views

urlpatterns = [
    path('',views.tribe_portal,name="tribe"),
    path('filmfeed', views.film_feedback, name="film_feed"),
    path('recs', views.rec_film, name="rec_film"),
    path('rev', views.rev_film, name="rev_film"),
    path('admin',views.push_changes,name="push_changes"),
    path('check',views.check,name="check_tribe_admin"),
    path('update_film',views.update_film,name="push_update_film"),
    path('push_new_film',views.push_new_film,name="push_new_film"),
    path('add_film',views.add_film,name="add_film"),
    path('thanks',views.thanks_for,name="thanks_for"),
    path('link_alert',views.link_alert,name="link_alert"), #directed from user
    path('link_net',views.link_net,name="netflix_change"), #directed from the tribe/admin
    path('create_collection',views.create_collection,name="create_collection"),
    path('add_collection',views.add_collection,name="add_collection"),
    path('admin/tags_portal',views.admin_tags_portal,name="admin_manage_tags"),
    path('admin/collection_portal',views.admin_featured_collection_portal,name="admin_manage_f_collections"),
    path('admin/tags_push',views.admin_tags_push,name="admin_push_tags"),
    path('admin/f_collections_push',views.admin_f_collections_push,name="admin_push_f_collections")


]