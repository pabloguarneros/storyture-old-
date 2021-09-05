import random
from django.shortcuts import render, redirect
from django.http import HttpResponse,HttpResponseRedirect, Http404
from rest_framework import generics
from users.models import Audience, DummyFilm, ActionID, User_Collection
from django.db.models import Q, F, Count
from .forms import CommentForm, FilmUpdateForm
from .models import Film, Collection, Comment, Genre, Tag, Country
from . import serializers
from django.contrib.auth.decorators import login_required

from datetime import timedelta
from ratelimit.decorators import ratelimit
from blacklist.ratelimit import blacklist_ratelimited

@ratelimit(key='user_or_ip', rate='50/m', block=False)
@blacklist_ratelimited(timedelta(minutes=30)) 
@login_required(login_url='welcome:landing')
def profile(request, film_name):
    try:
        film = Film.objects.get(movie_ID=film_name)
    except Film.DoesNotExist:
        raise Http404("Film does not exist")
    comments = Comment.objects.all().filter(film=film)
    description = f"{film.title}"
    if film.year:
        description = description + f" ({film.year})"
    if film.net_alert == 1:
        description = description + "is on Netflix"
        if film.up_bech < film.down_bech:
            description = description + "and passes the Bechdel Test"
        elif film.up_bech > film.down_bech:
            description = description + "and fails the Bechdel Test"
    else:
        if film.up_bech < film.down_bech:
            description = description + "passes the Bechdel Test"
        elif film.up_bech > film.down_bech:
            description = description + "fails the Bechdel Test"
    description = description + ". Will you recommend it to your friends on Storyture?"
    tags = str("") #so it registers as a string and not a tuple
    if film.country:
        for x in film.country.all()[0:3]:
            tags = tags + f"movies from {x.name}, "
    if film.tags:
        for y in film.tags.all()[0:5]:
            tags = tags + (f"{y.name} movies, ")
    if film.genre:
        for z in film.genre.all()[0:3]:
            tags = tags + (f"{z.name} movies, ")
    if request.user.is_authenticated:
        friends = request.user.get_friends_sorted()
        friends_rv = []
        for friend in friends.all():
            if friend.has_seen(film) == 0:
                if friend.has_rec(film,request.user):
                    friends_rv.append((friend,0,1))
                else:
                    friends_rv.append((friend,0,0))
            else:
                if friend.has_rev(film,request.user):
                    friends_rv.append((friend,1,1))
                else:
                    friends_rv.append((friend,1,0))
                #film_score = Audience.objects.get(audience=friend,
                #movie=film)
                #friends_rv.append((friend,film_score.rating))
    else:
        friends_rv = "0"

    film_value = film.get_value()

    return render(request,"films/film_prof.html", {
        "film": film,
        "description":description,
        "tags":tags,
        "comments":comments,
        "more_like": film.get_similar(),
        "vibes": User_Collection.objects.filter(Q(films__movie_ID__exact=film_name)),
        "friends_rv":friends_rv,
        "ranks":[("Genre", film_value%211),("Country",film_value%397),("Global", film_value%23039)],
        "comment_form": CommentForm()
    })

def action(request):

    if request.method == 'POST':
        user = request.user
        target = request.POST.get('film_id')
        action = request.POST.get('action') #new value
        target = Film.objects.get(movie_ID=target)
        if action == "add_bucket":
            user.add_bucket(target)
            audience, created = Audience.objects.get_or_create(audience=user,movie=target)
            audience.seen = 0
            audience.save()
        elif action == "add_favorite":
            user.add_fav(target)
            audience, created = Audience.objects.get_or_create(audience=user,movie=target)
            audience.seen = 1
            audience.save()
        elif action == "add_like":
            audience, created = Audience.objects.get_or_create(audience=user,movie=target)
            if created:
                target.up_votes += 1 #up votes on the movie
                target.save()
                #action for saw film
                action_ID, created = ActionID.objects.get_or_create(user=request.user)
                action_ID.add_act(4,rel_films=target)
            else: #user had already voted, so we adjust accordingly (this might exclude what we played in the game!)
                if audience.rating == 0:
                    target.down_votes -= 1
                    target.up_votes += 1
                    target.save()
                elif audience.rating != 1:
                    target.up_votes += 1
                    target.save()

            audience.seen = 1
            audience.rating = 1
            audience.save()

        elif action == "add_dis":
            audience, created = Audience.objects.get_or_create(audience=user,movie=target)
            if created:
                target.down_votes += 1
                target.save()
                #action for saw film, placed in created, for first time call
                action_ID, created = ActionID.objects.get_or_create(user=request.user)
                action_ID.add_act(4,rel_films=target)
            else:
                if audience.rating == 1:
                    target.up_votes -= 1
                    target.down_votes += 1
                    target.save()
                elif audience.rating != 0:
                    target.down_votes += 1
                    target.save()
            audience.seen = 1
            audience.rating = 0
            audience.save()

        return HttpResponse("success")
    else:
        return HttpResponse("unsuccesful")
        
def add_comment(request,film_ID):
    if not request.user.username:
        return HttpResponseRedirect('/login/auth0')
    if request.method == "POST":
        # Accessing username and password from form data
        form = CommentForm(request.POST)

        if form.is_valid():
            content = form.cleaned_data.get('content')
            username = request.user.username
            request.user.xp += 40
            request.user.kn += 80
            request.user.save()
            film = Film.objects.get(movie_ID=film_ID)
            Comment.objects.create(film=film,content=content,bya=username)

        return HttpResponseRedirect(f"/film/{film_ID}")

def add_comment_game(request,film_ID):
    if not request.user.username:
        return HttpResponseRedirect('/login/auth0')
    if request.method == "POST":
        content = request.POST.get('comment')
        username = request.user.username
        request.user.xp += 40
        request.user.kn += 80
        request.user.save()
        film = Film.objects.get(movie_ID=film_ID)
        Comment.objects.create(film=film,content=content,bya=username)
        return HttpResponse(f'{film_ID}')
    else:
        return HttpResponse("unsuccesful")

def edit_film(request,film_name):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/auth0')
    film = Film.objects.get(movie_ID=film_name)
    if request.method == 'POST':
        u_form = FilmUpdateForm(request.POST,request.FILES,instance=film)

        if u_form.is_valid():
            title = u_form.cleaned_data['title']
            alt_tt_1 = u_form.cleaned_data['alt_tt_1']
            alt_tt_2 = u_form.cleaned_data['alt_tt_2']
            year = u_form.cleaned_data['year']
            country = u_form.cleaned_data['country']
            tags = u_form.cleaned_data['tags']
            language = u_form.cleaned_data['language']
            minutes = u_form.cleaned_data['minutes']
            genre = u_form.cleaned_data['genre']
            synopsis = u_form.cleaned_data['synopsis']
            trailer = u_form.cleaned_data['trailer']
            productions = u_form.cleaned_data['productions']
            poster_pic = u_form.cleaned_data['poster_pic']
            co2_t = u_form.cleaned_data['co2_t']
            new_dummy = DummyFilm.objects.create(
                bya=request.user,
                movie_ID=film_name,
                title = title,
                year = year,
                alt_tt_1 = alt_tt_1,
                alt_tt_2 = alt_tt_2,
                minutes = minutes,
                synopsis = synopsis,
                trailer = trailer,
                co2_t = co2_t,
            )

            new_dummy.save()

            new_dummy.poster_pic = poster_pic

            if country:
                for c in country:
                    new_dummy.country.add(c)
            if tags:
                for t in tags:
                    new_dummy.tags.add(t)
            if language:
                for l in language:
                    new_dummy.language.add(l)
            if genre:
                for g in genre:
                    new_dummy.genre.add(g)
            if productions:
                for p in productions:
                    new_dummy.productions.add(p)
            new_dummy.save()
            #u_form.save()
            return redirect('film_profile',film_name=film_name)
    else:
        u_form = FilmUpdateForm(instance=film)

    context={
        'u_form': u_form,
        'film':film
    }
    return render(request, 'films/edit_film.html',context)

class filmList(generics.RetrieveUpdateDestroyAPIView):

    #lookup_field = 'movie_ID'
    #queryset = Film.objects.all()
    serializer_class = serializers.FilmSerializer

    def get_queryset(self):
        return Film.objects.all()

    def get_object(self):
        #movie_ID = self.kwargs.get("movie_ID")
        movie_ID = self.kwargs['film_ID']
        return Film.objects.get(movie_ID=movie_ID)

class tagList(generics.ListAPIView):


    serializer_class = serializers.TagSerializer

    def get_queryset(self):
        return Tag.objects.all()


class f_collectionList(generics.ListAPIView):

    serializer_class = serializers.F_CollectionSerializer

    def get_queryset(self):
        return Collection.objects.all()

class tagRestrictedList(generics.ListAPIView):

    serializer_class = serializers.TagSerializer

    def get_queryset(self):
        return Tag.objects.all().annotate(films_count=Count('tags')).filter(films_count__gte=2).exclude(name="''").order_by("-films_count")

class genreList(generics.ListAPIView):

    serializer_class = serializers.TagSerializer

    def get_queryset(self):
        return Genre.objects.all().exclude(name="''")

class countryList(generics.ListAPIView):

    serializer_class = serializers.TagSerializer

    def get_queryset(self):
        return Country.objects.all().annotate(films_count=Count('film__country')).filter(films_count__gte=200).exclude(name="''").order_by("-films_count")

class filmxtagList(generics.ListAPIView):

    serializer_class = serializers.FilmTagSerializer

    def get_queryset(self):

        queryset = Film.objects.all()
        tags = self.request.query_params.get('tag', None)
        
        title = self.request.query_params.get('tt', None)
        
        if tags is not None:
            tags = (tags.split(',')) #HERE WATCH OUT FOR TAGS THAT CONTAIN COMMAS AS THESE WILL NEVER WORK
            q_objects = Q()
            for tag in tags:
                q_objects |= Q(tags=tag)
            queryset = queryset.filter(q_objects).distinct()

        if title is not None:
            queryset = queryset.filter(title__icontains=title).order_by('-year')

        return queryset[0:20]

class filmMain(generics.ListAPIView):

    serializer_class = serializers.FilmMainSerializer

    def get_queryset(self):

        query = self.request.query_params.get('query', None)
        start = self.request.query_params.get('start', "0")
        end = self.request.query_params.get('end', "20")

        queryset = Film.objects.all().filter(Q(title__icontains=query)|Q(alt_tt_1__icontains=query)|Q(alt_tt_2__icontains=query)).order_by('-year')

        return queryset[int(start):int(end)]

class filmExtended(generics.ListAPIView):

    serializer_class = serializers.FilmExtendedSerializer

    def get_queryset(self):
        tt = self.request.query_params.get('tt', None)
        tag = self.request.query_params.get('tag', None)
        q_filters = Q()
        if tt is not None:
            q_filters |= Q(title__icontains=tt)
            q_filters |= Q(alt_tt_1__icontains=tt)
            q_filters |= Q(alt_tt_2__icontains=tt)
        if tag is not None:
            q_filters &= Q(tags=tag)
        queryset = Film.objects.all().filter(q_filters).order_by('-year')

        return queryset[:20]

class filmsFeaturedCollection(generics.ListAPIView):

    serializer_class = serializers.FilmExtendedSerializer

    def get_queryset(self):
        name = self.request.query_params.get('name', None)
        queryset = Collection.objects.get(name=name).films.all()

        return queryset


class browseFilms(generics.ListAPIView):

    '''
    to improve: get defaults the most often aprameters are made
    '''
    
    serializer_class = serializers.BrowseFilmSerializer

    def get_queryset(self):
        '''
        helpful contains parameters:
        - module.workflow_set.filter(trigger_roles__in=[self.role], allowed=True)
        include start and finish to keep updating!!
        '''
        q_objects = Q()

        start = int(self.request.query_params.get('start'))
        end = int(self.request.query_params.get('end'))
        #additional_films = []
        want = self.request.query_params.get('want', None) #there should be four #include in genres and collections too!! #set in notes, i want to 
        netflix = self.request.query_params.get('netflix', None) #set netflix :) with NOTES
        bechdel = self.request.query_params.get('bechdel', None) #set netflix :) with NOTES
        
        time_min = self.request.query_params.get('time_min', None) #set the time :) with NOTES
        time_max = self.request.query_params.get('time_max', None) #set the time :) with NOTES
        year_min = self.request.query_params.get('year_min', None) #set the time :) with NOTES
        year_max = self.request.query_params.get('year_max', None) #set the time :) with NOTES
        imdb_min = self.request.query_params.get('imdb_min', None) #set the time :) with NOTES
        imdb_max = self.request.query_params.get('imdb_max', None) #set the time :) with NOTES
        
        tag_only = self.request.query_params.get('tag_only', None) 
        tag_exclude = self.request.query_params.get('tag_exclude', None)
        country_only = self.request.query_params.get('country_only', None) 
        country_exclude = self.request.query_params.get('country_exclude', None)
        genre_only = self.request.query_params.get('genre_only', None) 
        genre_exclude = self.request.query_params.get('genre_exclude', None)

        time_order = self.request.query_params.get('time_order', None)
        year_order = self.request.query_params.get('year_order', None)
        imdb_order = self.request.query_params.get('imdb_order', None)

        if want is not None:
            if want != "none" and want != "idk":
                if want == "cry":
                    q_objects &= Q(genre__in=["Drama"])
                elif want == "laugh":
                    q_objects &= Q(genre__in=["Comedy"])
                elif want == "think":
                    q_objects &= Q(genre__in=["Mystery","Documentary","Biography"])
                elif want == "fling":
                    # or try q_objects |= Q(user_collection_set__tags__name__in=["yeet_soundtrack","movie_night"])
                    q_objects &= Q(user_collection__tags__name__in=["yeet_soundtrack","movie_night"])

        if netflix is not None:
            if netflix == "true":
                q_objects &= Q(net_alert=1)

        if time_min is not None and time_min != "":
            '''
            also use minutes__range=[time_min,time_max]
            '''
            time_min = int(time_min)
            if time_min < 0:
                time_min = 0
            q_objects &= Q(minutes__gte=time_min)

        if time_max is not None and time_max != "":
            time_max = int(time_max)
            if time_max < 0:
                time_max = 0
            q_objects &= Q(minutes__lte=time_max)

        if year_min is not None and year_min != "":
            q_objects &= Q(year__gte=year_min)

        if year_max is not None and year_max != "":
            q_objects &= Q(year__lte=year_max)

        if imdb_min is not None and imdb_min != "":
            q_objects &= Q(imdb_score__gte=int(imdb_min))

        if imdb_max is not None and imdb_max != "":
            q_objects &= Q(imdb_score__lte=int(imdb_max))
    
        if tag_only is not None and tag_only != "":
            tag_only = (tag_only.split(',')) #HERE WATCH OUT FOR TAGS THAT CONTAIN COMMAS AS THESE WILL NEVER WORK
            q_objects &= Q(tags__in=tag_only)

        if country_only is not None and country_only != "":
            country_only = (country_only.split(',')) 
            q_objects &= Q(country__in=country_only)

        q_not = Q()

        if bechdel is not None:
            if bechdel == "true":
                q_not &= Q(up_bech__lte=F('down_bech'))

        if tag_exclude is not None and tag_exclude != "":
            tag_exclude = (tag_exclude.split(',')) #HERE WATCH OUT FOR TAGS THAT CONTAIN COMMAS AS THESE WILL NEVER WORK
            q_not |= Q(tags__in=tag_exclude)
            
        if country_exclude is not None and country_exclude != "":
            country_exclude = (country_exclude.split(','))
            q_not |= Q(country__in=country_exclude)

        if genre_exclude is not None and genre_exclude != "":
            genre_exclude = (genre_exclude.split(','))
            q_not |= Q(genre__in=genre_exclude)

        post_need = Q()
        
        if genre_only is not None and genre_only != "":
            genre_only = (genre_only.split(','))
            post_need &= Q(genre__in=genre_only)

        '''
        Change the following to only perform the filtering once!
        '''

        queryset = Film.objects.all().filter(q_objects).distinct().filter(post_need).distinct().exclude(q_not)

        if year_order is not None:
            if year_order == "up":
                queryset = queryset.order_by('-year')
            elif year_order == "down":
                queryset = queryset.order_by('year')
        if time_order is not None:
            if time_order == "up":
                queryset = queryset.order_by('-minutes')
            elif time_order == "down":
                queryset = queryset.order_by('minutes')
        if imdb_order is not None:
            if imdb_order == "up":
                queryset = queryset.order_by('-imdb_score')
            elif year_order == "down":
                queryset = queryset.order_by('imdb_score')

        output = []
        output_id = []

        '''
        Here, we remove duplicates, however, this is n^2 which is really hurtful when we want to search more and more adn more!
        Optimized to only include the number of id!
        '''
        for film in queryset:
            if film.movie_ID not in output_id:
                output.append(film)
                output_id.append(film.movie_ID)
            if len(output) > end:
                break

        return output[start:end]