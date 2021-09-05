from django.contrib.sitemaps import Sitemap
from django.db.models import Count

from users.models import User_Collection

class Collection_Sitemap(Sitemap):

    priority = 0.6
    changefreq = 'weekly'

    def items(self):
        return User_Collection.objects.all().filter(privacy=1).annotate(follow_number=Count('followers')).order_by('-follow_number')

    '''
    def lastmod(self, obj): 
        return obj.date_modified
    '''