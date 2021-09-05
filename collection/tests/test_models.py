from django.test import TestCase
from django.test.utils import setup_test_environment, teardown_test_environment
from django.http import Http404
from django.test import Client
from django.urls import reverse
# Create your tests here.
from films.models import Film
from users.models import Tag, CustomUser, User_Collection
from collection.models import Deleted_Collection
from datetime import datetime 
from freezegun import freeze_time


'''
RULES OF THUMB:
- separate TestClass for each model or view
- seperate test method for each condition
--test method names describe thie function
'''

class TestDeleted_CollectionModel(TestCase):

    '''
    to improve: how to check if the names got copied without having to call both models by each name == seing that by calling each model by the same name, they will automatically have the same name?
    '''
    
    def setUp(self):
        tag = Tag.objects.create(
            name = "lgbt"
        )
        film = Film.objects.create(
            title="Why You Call Me",
            year=2020
        )
        user_collection = User_Collection.objects.create(
            collection_name="Why So Serious?",
            description="A collection about life"
        )
        user_collection.films.add(film)
        user_collection.tags.add(tag)
        user_collection.save()
        user_collection_2 = User_Collection.objects.create(
            collection_name="YOYOYO",
            description="A collection about life"
        )
        user_collection_2.films.add(film)
        user_collection_2.tags.add(tag)
        user_collection_2.save()

        deleted_collection = Deleted_Collection()
        deleted_collection.save()
        user_collection = User_Collection.objects.get(collection_name="Why So Serious?")
        deleted_collection.migrate_collection(user_collection)

    def tearDown(self):
        pass
        #teardown_test_environment()

    def testStringReturn(self):
        '''
        Tests whether the test object produces a valid string as the name
        '''
        test_object = Deleted_Collection.objects.get(collection_name="Why So Serious?")
        self.assertEqual(str(test_object), "Why So Serious?")
        #self.assertEqual(False, False)

    def testMigrateCollectionFormerOwner(self):
        '''
        tests whether a collection without a defined owner will also have an undefined former owner
        '''
        deleted_collection = Deleted_Collection()
        deleted_collection.save()
        user_collection = User_Collection.objects.get(collection_name="Why So Serious?")
        deleted_collection.migrate_collection(user_collection)
        self.assertEqual(deleted_collection.former_owner,None)

    def testMigrateCollectionTimeBuilt(self):
        '''
        tests whether a collection without a defined owner will also have an undefined former owner
        '''
        user_collection = User_Collection.objects.get(collection_name="Why So Serious?")
        deleted_collection = Deleted_Collection.objects.get(collection_name="Why So Serious?")
        self.assertEqual(user_collection.time_built,deleted_collection.time_built)

    '''
    @freeze_time("2017-06-23 07:28:00")
    def testMigrateCollectionTimeDeleted(self):

        deleted_collection = Deleted_Collection()
        deleted_collection.save()
        user_collection = User_Collection.objects.get(collection_name="YOYOYO")
        deleted_collection.migrate_collection(user_collection)
        deleted_collection = Deleted_Collection.objects.get(collection_name="YOYOYO")
        self.assertEqual(deleted_collection.time_deleted, "2017-06-23 07:28:00")
    '''

    def testMigrateCollectionDescription(self):
        '''
        tests whether a collection without a defined owner will also have an undefined former owner
        '''
        user_collection = User_Collection.objects.get(collection_name="Why So Serious?")
        deleted_collection = Deleted_Collection.objects.get(collection_name="Why So Serious?")
        self.assertEqual(user_collection.description,deleted_collection.description)

    def testMigrateCollectionPopularity(self):
        '''
        tests whether a collection without a defined owner will also have an undefined former owner
        to improve : test different levels of popularity, can popularity be equal to zero?
        '''
        user_collection = User_Collection.objects.get(collection_name="Why So Serious?")
        deleted_collection = Deleted_Collection.objects.get(collection_name="Why So Serious?")
        self.assertEqual(user_collection.popularity,deleted_collection.popularity)

    def testMigrateCollectionFollowCount(self):
        '''
        tests whether a collection without a defined owner will also have an undefined former owner
        '''
        user_collection = User_Collection.objects.get(collection_name="Why So Serious?")
        deleted_collection = Deleted_Collection.objects.get(collection_name="Why So Serious?")
        self.assertEqual(user_collection.followers.all().count(),deleted_collection.follow_count)

    def testMigrateCollectionCopyCount(self):
        '''
        tests whether a collection without a defined owner will also have an undefined former owner
        '''
        user_collection = User_Collection.objects.get(collection_name="Why So Serious?")
        deleted_collection = Deleted_Collection.objects.get(collection_name="Why So Serious?")
        self.assertEqual(user_collection.copied_by.all().count(),deleted_collection.copy_count)