from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.db.models import Q
from django import forms
from django.contrib import messages
from films.models import Film, Collection, Country, Comment
from users.models import Audience, CustomUser, User_Collection
from .models import Meta
from django.views.generic import TemplateView, ListView
from functools import reduce
from datetime import datetime
from django.contrib.auth.decorators import login_required

def day_access():
    '''
    to improve: still need to include code "101"
    '''
    dt = datetime.today()
    day_of_week = dt.strftime('%A')
    if day_of_week == "Monday":
        no_access = "000"
    elif day_of_week == "Tuesday":
        no_access = "001"
    elif day_of_week == "Wednesday":
        no_access = "011"
    elif day_of_week == "Thursday":
        no_access = "111"
    elif day_of_week == "Friday":
        no_access = "100"
    elif day_of_week == "Saturday":
        no_access = "110"
    else:
        no_access = "010"
    return no_access, day_of_week

class SearchTask(forms.Form):
    movie_name = forms.CharField(label="",widget=forms.TextInput(attrs={'placeholder': 'search movies, countries, or topics'}))


def welcome(request):
    
    if not request.user.is_authenticated:
        return render(request,"welcome/landing_page.html")
   
    context = {
        "comments": Comment.objects.all().order_by("-created_at")[0:20],
        "on_netflix": Film.objects.filter(net_alert=1).order_by("-year")[0:30],
        "collections": Collection.objects.filter(active=1),
        "latest": Collection.objects.get(
            Q(id=4))
        #"collections": User_Collection.objects.all().distinct().order_by("-followers")[0:5],

    }
    return render(request,"welcome/portal.html",context)

@login_required(login_url='welcome:landing')
def s_game(request):
    """
    Loads authentico game, looks at the country of the users to exclude country game if there is no more countries left for the user to review!
    """
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/auth0')

    films = []
    allow_world = False
    allow_game = False
    if len(request.user.country.all()) > 0:
        allow_game = True
        countries = request.user.country.all() #get user's all films
        object_list = per_cc(countries) #given country, obtain the filsm from that country
        seen_list = Audience.objects.filter(
            Q(audience=request.user),~Q(country_pass=4)) #exclude films the user has seen
        n_seen_list = ([mov.movie for mov in seen_list])
        for film in object_list:
            if film not in n_seen_list:
                films.append(film)
            if len(films) >= 10:  
                break
        if len(films) >= 10:
            allow_world = True

    context = {
        "allow_world": allow_world,
        "allow_game": allow_game,
    }
    return render(request,"welcome/s_game.html",context)

def s_results(request):
    if request.method == 'POST':
        user = request.user
        films_id = request.POST.get('film_id').split(",")
        films_sco = request.POST.get('film_sco').split(",")
        xp_new = request.POST.get('xp_upd')
        game_type = request.POST.get('game_type')
        user.xp += int(xp_new)
        user.kn += int(xp_new)*2
        user.save()

        for i in range(10):
            film = Film.objects.get(movie_ID=films_id[i])
            if films_sco[i] in ["0","1","2"]: #here you tell me you've also seen the film!! :) 
                seen=1
                country_pass = int(films_sco[i])
                if game_type == "bech":
                    if films_sco[i] == "0":
                        film.down_bech += 1
                        film.save()
                    elif films_sco[i] == "1":
                        film.up_bech += 1
                        film.save()
                elif game_type == "world":
                    if films_sco[i] == "0":
                        film.down_country += 1
                        film.save()
                    elif films_sco[i] == "1":
                        film.up_country += 1
                        film.save()
                else:
                    if films_sco[i] == "0":
                        film.down_votes += 1
                        film.save()
                    elif films_sco[i] == "1":
                        film.up_votes += 1
                        film.save()
            else:
                seen= 0
                country_pass = 2
    
            audience, created = Audience.objects.get_or_create(audience=user,movie=film)
            audience.seen=seen
            audience.country_pass=country_pass
            audience.save()

        return HttpResponse("success")
    else:
        return HttpResponse("unsuccesful")

def load_country(request):
    country = request.GET.get("country")
    object_list = Country.objects.filter(
            Q(name__exact=country)
        )
    country = object_list[0]
    return JsonResponse({
            "country": f'{country.name} &#{country.emoji_1}&#{country.emoji_2}'
        })
    
def per_cc(countries):
    object_list = []
    object_list = Film.objects.filter(reduce(lambda x, y: x | y, [Q(country__name__icontains=country) for country in countries]))
    object_list = object_list.exclude(year__in=["2025","2024","2023","2022","2021"])
    object_list = object_list.order_by('-year')
    return object_list


def load_game(request):
    '''
    Function loads the game

    To improve by today:
        - prevent empty array
        - figure out a way to tell apart which cuntry were played with country_pass and which ones were played normally!
    '''
    films = [] #initialize empty
    countries = request.user.country.all() #get user's all films
    object_list = per_cc(countries) #given country, obtain the filsm from that country
    seen_list = Audience.objects.filter(
        Q(audience=request.user),~Q(country_pass=4)) #exclude films the user has seen
    n_seen_list = ([mov.movie for mov in seen_list])
    for film in object_list:
        if film not in n_seen_list:
            films.append(film)
        if len(films) >= 10:  
            break
    if len(films) < 10:
        #films = [] MAKE SURE ONE IS NEVER EMPTY!!!!!!
        new_countries = []
        for country in countries:
            for new_country in country.interest.all():
                new_countries.append(new_country)
        object_list = per_cc(new_countries)
        for film in object_list:
            if film not in n_seen_list:
                films.append(film)
            if len(films) >= 10:
                break
        
        if len(films) < 10:
            object_list = per_cc(["USA"]) #loads the films!! given the country
            for film in object_list:
                if film not in n_seen_list:
                    films.append(film) 
                if len(films) >= 10: ##when the number hits 10! 
                    break
            if len(films) < 10:
                object_list = per_cc(["UK"]) #loads the films!! given the country
                for film in object_list:
                    if film not in n_seen_list:
                        films.append(film) 
                    if len(films) >= 10: ##when the number hits 10! 
                        break
                if len(films) < 10:
                    return JsonResponse({
                        "posts": "nop"
                    })
    data = []
    for film in films:
        for country in countries:
            if country in film.country.all():
                break
            country = countries[0] #if the break never happens, claim it to be their country
        data.append({"movie_ID": film.movie_ID, "poster": film.poster_pic.url, "title": film.title, "year": film.year, "country": country.name})
    return JsonResponse({
        "posts": data
    })


def load_films(request):
    query = request.GET.get("query")
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start+24))
    country = request.GET.get("country")

    if country != "" and query == "":
        object_list = Film.objects.filter(
            Q(country__name__icontains=country)
        ).order_by('-year').distinct()
    elif country == "" and query != "":
        object_list = Film.objects.filter(
            Q(title__icontains=query)
        ).order_by('-year').distinct()
    else:
        object_list = Film.objects.filter(
            Q(title__icontains=query) |
            Q(country__name__icontains=country)
        ).order_by('-year').distinct()


    if len(object_list) == 0:
        return JsonResponse({
            "posts": "never_results"
        })
    elif len(object_list) > end or start == 0:
        data = []
        for film in object_list[start:end-1]:
            data.append({"movie_ID": film.movie_ID, "poster": film.poster_pic.url, "title": film.title, "year": film.year})
            #data.append({"movie_ID": film.movie_ID, "poster": film.poster, "title": film.title, "year": film.year})
        return JsonResponse({
            "posts": data
        })
    
    return JsonResponse({
            "posts": "no_results"
        })

def load_trailers(request):
    data = []
    trailers = Collection.objects.get(name="trailers")
    for film in trailers.films.all().order_by('?'):
        data.append({"movie_ID": film.movie_ID, "poster": film.poster_pic.url, "title": film.title, "trailer": film.trailer, "country": [country.name for country in film.country.all()], "synopsis": film.synopsis})
    return JsonResponse({
        "posts": data
    })

def about(request):
    context = {
        "meta": Meta.objects.get(pk="about"), #trending theatres
    }
    return render(request,"welcome/meta.html",context)

def faq(request):
    context = {
        "meta": Meta.objects.get(pk="faq"), #trending theatres
    }
    return render(request,"welcome/meta.html",context)

def terms(request):
    context = {
        "meta": Meta.objects.get(pk="terms"), #trending theatres
    }
    return render(request,"welcome/meta.html",context)

def privacy(request):
    context = {
        "meta": Meta.objects.get(pk="privacy"), #trending theatres
    }
    return render(request,"welcome/meta.html",context)

def about_credits(request):
    context = {
        "meta": Meta.objects.get(pk="sources"), #trending theatres
    }
    return render(request,"welcome/meta.html",context)

def people(request):
    context = {
        "meta": Meta.objects.get(pk="people"), #trending theatres
    }
    return render(request,"welcome/meta.html",context)

def error_404(request,exception):
    context = {
        "error_head": "404 error",
        "error": "Not even E-T can find that page.",
        "film": Film.objects.get(movie_ID=4486)
    }
    return render(request,"welcome/404.html",context)

def error_500(request):
    context = {
        "error_head": "500 error",
        "error": "Like the Titanic, the problem is internal.",
        "film": Film.objects.get(movie_ID=17636)
    }
    return render(request,"welcome/404.html",context)

def error_403(request,exception):
    context = {
        "error_head": "403 error",
        "error": "You shall not pass! Sorry, but access to this page is forbidden.",
        "film": Film.objects.get(movie_ID=11614)
    }
    return render(request,"welcome/404.html",context)

def error_400(request,exception):
    context = {
        "error_head": "400 error",
        "error": "Fishy things are happening from your device. Go for a run, then refresh.",
        "film": Film.objects.get(movie_ID=26954)
    }
    return render(request,"welcome/404.html",context)