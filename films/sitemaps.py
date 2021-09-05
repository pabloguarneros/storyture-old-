from django.contrib.sitemaps import Sitemap

from .models import Film

class Film_Sitemap(Sitemap):

    priority = 0.7
    changefreq = 'monthly'

    def items(self):
        return Film.objects.all().exclude(poster_pic="posters/default/poster.jpg")

    '''
    def lastmod(self, obj): 
        return obj.date_modified
    '''