from django.contrib.sitemaps import Sitemap
from django.urls import reverse


class StaticViewSitemap(Sitemap):

    priority = 1.0
    changefreq = 'daily'


    def items(self):
        return ['welcome:landing','welcome:about','welcome:people']

    def location(self, item):
        return reverse(item)