from django.contrib import admin

from .models import CustomUser, Relationship, Recommend, Audience, Feedback, Freview, Film_Feedback, DummyFilm, User_Collection, Action, ActionID

class RelationshipAdmin(admin.ModelAdmin):
    list_display = ("from_person", "to_person", "status")

class RecommendAdmin(admin.ModelAdmin):
    list_display = ("film", "from_person", "to_person","message")

class FreviewAdmin(admin.ModelAdmin):
    list_display = ("film", "from_person", "to_person","points")

class AudienceAdmin(admin.ModelAdmin):
    list_display = ("audience", "movie","seen","country_pass")

class DummyAdmin(admin.ModelAdmin):
    list_display = ("movie_ID", "title", "year","minutes") #also add the user that pushed the comments
    search_fields = ('movie_ID', 'title')

class User_CollectionAdmin(admin.ModelAdmin):
    list_display = ('pk','collection_name','privacy')
    search_fields = ('collection_name',)

class ActionAdmin(admin.ModelAdmin):
    list_display = ('categ','time')

class ActionIDAdmin(admin.ModelAdmin):
    list_display = ('user',)
    search_fields = ('user',)


admin.site.register(Audience,AudienceAdmin)

admin.site.register(DummyFilm,DummyAdmin)

admin.site.register(Relationship,RelationshipAdmin)

admin.site.register(CustomUser)

admin.site.register(Recommend,RecommendAdmin)

admin.site.register(Freview,FreviewAdmin)

admin.site.register(Feedback)

admin.site.register(Film_Feedback)

admin.site.register(User_Collection,User_CollectionAdmin)

admin.site.register(Action,ActionAdmin)
admin.site.register(ActionID,ActionIDAdmin)