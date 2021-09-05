from django.urls import path

from films.views import add_comment_game
from .views import welcome, load_films, load_country, s_game, s_results, load_game, load_trailers, about, terms, privacy, faq, about_credits, people

urlpatterns = [
    path('', welcome, name="landing"),
    path('authentico',s_game,name="s_game"),
    path('authentico/results',s_results, name="s_results"),
    path('about', about, name="about"),
    path('about/credits', about_credits, name="about_credits"),
    path('faq/', faq, name="faq"),
    path('terms/', terms, name="terms"),
    path('privacy/', privacy, name="privacy"),
    path('people/', people, name="people"),
    path('search/load/', load_films, name="load_films"),
    path('search/game/', load_game, name="load_film_game"),
    path('search/trailers/', load_trailers, name="load_film_trailer"),
    path('search/country/',load_country,name="country_emoji")
]