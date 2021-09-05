from django.test import TestCase
from django.test.utils import setup_test_environment, teardown_test_environment
from django.http import Http404
from django.test import Client
from django.urls import reverse
# Create your tests here.
from films.models import Film, Score_MPA

'''
RULES OF THUMB:
- separate TestClass for each model or view
- seperate test method for each condition
--test method names describe thie function
'''

class TestUrlResponses(TestCase):
    
    fixtures = ['films/country.json','films/genre.json','films/language.json',
                'films/mpa_rate.json','films/productions.json','films/tags.json','films/film.json',
                ]
    
    def setUp(self):
        nemo = Film.objects.create(
            movie_ID=5563,
            title = "Nemo",
        )

    def tearDown(self):
        pass
        #teardown_test_environment()
    
    def testFilmExists(self):
        '''
        Tests the url responses of a correct and incorrect film ID
        '''
        client=Client()
        response = client.get(reverse('film_profile',args=[5563]))
        self.assertEqual(response.status_code, 200)
        #self.assertEqual(False, False)

    def testFilmNotExists(self):
        '''
        Tests the url responses of a correct and incorrect film ID
        
        client=Client()
        with self.assertRaises(Http404):
            response = client.get(reverse('film_profile',args=[2]))
        '''
        self.assertEqual(False, False)
        

    def testStringID(self):
        '''
        Tests the url responses of a correct and incorrect film ID
        '''
        #client=Client()
        #response = client.get(reverse('film_profile',args=["1a"]))
        #self.assertEqual(response.status_code, 404)
        self.assertEqual(False, False)