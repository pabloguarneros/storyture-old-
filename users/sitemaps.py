from django.contrib.sitemaps import Sitemap
from django.db.models import Count
from users.models import CustomUser

class CustomUser_Sitemap(Sitemap):

    priority = 0.4
    changefreq = 'daily'

    def items(self):
        return CustomUser.objects.all().annotate(fav_count=Count('fav_films')).order_by('-fav_count')

    '''
    def lastmod(self, obj): 
        return obj.date_modified
    '''