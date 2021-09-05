from django.contrib import admin

# Register your models here.
from .models import Meta

class MetaAdmin(admin.ModelAdmin):
    list_display = ("title_id", "title_print")
# Register your models here.
admin.site.register(Meta, MetaAdmin)