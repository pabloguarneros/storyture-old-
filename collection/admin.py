from django.contrib import admin
from .models import Deleted_Collection

class Deleted_CollectionAdmin(admin.ModelAdmin):
    list_display = ("collection_name", "popularity","time_built","time_deleted","former_owner")

admin.site.register(Deleted_Collection,Deleted_CollectionAdmin)