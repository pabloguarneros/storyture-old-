from django.test import TestCase
from django.test.utils import setup_test_environment, teardown_test_environment
from django.http import Http404
from django.test import Client
from django.urls import reverse
# Create your tests here.
from films.models import Film, Score_MPA
