from django.contrib import admin
from .models import Market

# Register your models here.
class MarketAdmin(admin.ModelAdmin):
    list_display = ("item_id","name","lvl","categ","cost")
    
admin.site.register(Market,MarketAdmin)