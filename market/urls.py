from django.urls import path

from .views import store_front, buy

urlpatterns = [
    path('', store_front, name="duty_free"),
    path('buy',buy, name="upgrade")
]
