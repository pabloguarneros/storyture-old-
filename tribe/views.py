from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.db import transaction
from django.db.models import Q, Count
from users.models import Film_Feedback, CustomUser, Recommend, Freview, Feedback, DummyFilm, User_Collection, ActionID
from films.models import Film, Tag, Collection
from .forms import AddFilmForm
from django.contrib.auth.decorators import login_required


@login_required(login_url='welcome:landing')
def tribe_portal(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/auth0')
    else:
        user = request.user
        context={
            "user_collections": User_Collection.objects.all().filter(privacy=1).order_by("-popularity").annotate(films_in=Count("films")).filter(films_in__gt=0).exclude(bya=request.user),
            "shared_preference": user.get_users_shared_preference(),
            "mutual_friends": user.get_users_mutual_friends(), #mutual friends
            "users_same_country": user.get_users_same_country(), 
            "users_related_countries": user.get_users_related_countries(), #opposite countries
            "shared_buckets":user.get_users_similar_bucket_lists(),
            "t_th": CustomUser.objects.all().order_by('-stage__lvl')[0:5] #trending theatres
        }
        return render(request,'tribe/tribe.html',context)

def film_feedback(request):
    if request.method == 'POST':
        comment = request.POST.get("feedback")
        film_ID = request.POST.get("film_ID")
        film = Film.objects.get(movie_ID=film_ID)
        if request.user.username:
            user = request.user
            Film_Feedback.objects.create(feedback=comment,film=film,bya=user)
        else:
            Film_Feedback.objects.create(feedback=comment,film=film)
        return HttpResponse('succesful')
    else:
        return HttpResponse('unsuccesful')

def rec_film(request):
    if request.method == 'POST':
        to_friend = request.POST.get("to_friend")
        friend = CustomUser.objects.get(username=to_friend)
        film_ID = request.POST.get("film_ID")
        film = Film.objects.get(movie_ID=film_ID)
        message = "Yo, you should see this!"
        Recommend.objects.get_or_create(from_person=request.user,
                                        to_person=friend,
                                        film=film,
                                        message=message)

        action_id, created = ActionID.objects.get_or_create(user=request.user)
        action_id.add_act(1, rel_users=friend, rel_films=film)

        return HttpResponse('succesful')
    else:
        return HttpResponse('unsuccesful')

def rev_film(request):
    if request.method == 'POST':
        to_friend = request.POST.get("to_friend")
        friend = CustomUser.objects.get(username=to_friend)
        film_ID = request.POST.get("film_ID")
        film = Film.objects.get(movie_ID=film_ID)
        Freview.objects.get_or_create(from_person=friend,
                                        to_person=request.user,
                                        film=film)
        return HttpResponse('succesful')
    else:
        return HttpResponse('unsuccesful')

def push_changes(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/auth0')
    else:
        if request.user.username != "pabwarno":
            return render(request,'tribe/join.html') #LANDING TO JOIN THE ADMIN
        else:
            film_comparisons = [(Film.objects.get(movie_ID=film_dup.movie_ID),film_dup) for film_dup in DummyFilm.objects.filter(checked=0,new_film=0)] #create a list of tuples, where you get original film and before film
            context={
                "film_updates": film_comparisons,
                "net_errors":Film.objects.filter(Q(net_alert=2)|Q(net_alert=0)),
                "new_films": DummyFilm.objects.filter(checked=0,new_film=1),
                "film_feedback": Film_Feedback.objects.filter(resolved=0),
                "user_feedback": Feedback.objects.filter(checked=0)
            }
        return render(request,'tribe/push.html',context) #SEND TO ADMIN

def check(request):
    if request.method == 'POST':
        model = request.POST.get("model")
        comment_id = request.POST.get("comment_id")
        if model == "user_feed":
            to_check = Feedback.objects.get(pk=comment_id)
            to_check.checked = 1
            to_check.save()
        elif model == "film_feed":
            to_check = Film_Feedback.objects.get(pk=comment_id)
            to_check.resolved = 1
            to_check.save()
        return HttpResponse('succesful')
    else:
        return HttpResponse('unsuccesful')


@login_required(login_url='welcome:landing')
def thanks_for(request):
    return render(request,'tribe/thanks_for.html')

def update_film(request):
    if request.method == 'POST':
        accept = request.POST.get("accept")
        update_id = request.POST.get("update_id")
        if accept == "1":
            to_copy = DummyFilm.objects.get(pk=update_id)
            to_paste = Film.objects.get(movie_ID=to_copy.movie_ID)
            to_paste.copy_instance(to_copy)
            to_copy.checked = 1
            to_copy.save()
        elif accept == "0":
            to_check = DummyFilm.objects.get(pk=update_id)
            to_check.checked = 1
            to_check.save()
        return HttpResponse('succesful')
    else:
        return HttpResponse('unsuccesful')

def push_new_film(request):
    if request.method == 'POST':
        accept = request.POST.get("accept")
        update_id = request.POST.get("new_id")
        if accept == "1":
            to_copy = DummyFilm.objects.get(pk=update_id)
            to_paste = Film.objects.create(
                title=to_copy.title,
                year=to_copy.year
                )
            to_paste.copy_instance(to_copy)
            to_copy.checked = 1
            to_copy.save()
        elif accept == "0":
            to_check = DummyFilm.objects.get(pk=update_id)
            to_check.checked = 1
            to_check.save()
        return HttpResponse('succesful')
    else:
        return HttpResponse('unsuccesful')
            

def add_film(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/auth0')
    if request.method == 'POST':
        u_form = AddFilmForm(request.POST,request.FILES)
        if u_form.is_valid():
            title = u_form.cleaned_data['title']
            alt_tt_1 = u_form.cleaned_data['alt_tt_1']
            alt_tt_2 = u_form.cleaned_data['alt_tt_2']
            poster_pic = u_form.cleaned_data['poster_pic']
            year = u_form.cleaned_data['year']
            country = u_form.cleaned_data['country']
            language = u_form.cleaned_data['language']
            genre = u_form.cleaned_data['genre']

            synopsis = u_form.cleaned_data['synopsis']
            tags = u_form.cleaned_data['tags']
            trailer = u_form.cleaned_data['trailer']
            minutes = u_form.cleaned_data['minutes']

            imdb_score = u_form.cleaned_data['imdb_score']
            rotten_score = u_form.cleaned_data['rotten_score']
  
            new_dummy = DummyFilm.objects.create(
                bya=request.user,
                new_film = 1,
                title = title,
                year = year,
                alt_tt_1 = alt_tt_1,
                alt_tt_2 = alt_tt_2,
                minutes = minutes,
                synopsis = synopsis,
                trailer = trailer,
                poster_pic= poster_pic,
                imdb_score = imdb_score,
                rotten_score = rotten_score
            )

            if country and country != "None":
                for c in country:
                    new_dummy.country.add(c)
            if tags and tags != "None":
                for t in tags:
                    new_dummy.tags.add(t)
            if language and language != "None":
                for l in language:
                    new_dummy.language.add(l)
            if genre and genre != "None":
                for g in genre:
                    new_dummy.genre.add(g)

            new_dummy.save()
            request.user.xp += 40
            request.user.kn += 40
            request.user.save()
            #u_form.save()
            return redirect("thanks_for")
    else:
        u_form = AddFilmForm()

    context={
        'u_form': u_form
        }
    return render(request, 'tribe/add_film.html',context)

def link_net(request):
    if request.method == 'POST':
        link = request.POST.get("link")
        movie_ID = request.POST.get("movie_ID")
        film = Film.objects.get(movie_ID=movie_ID)
        if link == "1":
            film.net_alert = 1
            film.save()
        elif link == "0":
            film.net_alert = None
            film.save()
        elif link == "2":
            film.net_id = None
            film.net_alert = None
            film.save()
        return HttpResponse('succesful')
    else:
        return HttpResponse('unsuccesful')

def link_alert(request):
    if request.method == 'POST':
        movie_ID = request.POST.get("film_ID")
        film = Film.objects.get(movie_ID=movie_ID)
        alert = request.POST.get("alert")
        if alert == "2":
            film.net_alert = 2
            film.save()
        elif alert == "0":
            film.net_alert = 0
            film.save()
        return HttpResponse('succesful')
    else:
        return HttpResponse('unsuccesful')


@transaction.atomic #all the transaction will happen and then it's done
def create_collection(request):
    '''
    User creates collection

    To improve: have user send the ID for their ActionID sooner
    Make sure you don't abuse your .save()
    '''

    if request.method == 'POST':
        name = request.POST.get("name")
        bya = request.user
        privacy = request.POST.get("privacy")
        films = request.POST.getlist("movie_ID[]") #just put getlist for array
        tags = request.POST.getlist("tags[]")
        description = request.POST.get("description")


        new_collection = User_Collection.objects.create(
            collection_name=name,
            bya=bya,
            privacy=privacy
        )
        
        if description:
            new_collection.description = description

        for film in films:
            film_object = Film.objects.get(movie_ID=film)
            new_collection.films.add(film_object)
            new_collection.save()
        
        for tag in tags:
            tag_object = Tag.objects.get(name=tag)
            new_collection.tags.add(tag_object)
            new_collection.save()

        new_collection.save()

        #WHERE nc == new_collection
        '''
        nc = User_Collection()
        nc.name = name
        nc.bya = bya
        nc.privacy = privacy

        if description:
            nc.description = description
        
        for film in films:
            film_object = Film.objects.get(movie_ID=film)
            nc.films.add(film_object)
        
        for tag in tags:
            tag_object = Tag.objects.get(name=tag)
            nc.tags.add(tag_object)

        nc.save()
        '''

        #in the future just user.action_id.add_act ().. WOHOOO! 
        action_id, created = ActionID.objects.get_or_create(user=request.user)
        action_id.add_act(7, rel_collection=new_collection)

        return HttpResponse('succesful')
    else:
        return HttpResponse('unsuccesful')


def add_collection(request):
    if request.method == 'POST':
        user = request.user
        collection_id = request.POST.get("pk")
        action = request.POST.get("action")
        collection = User_Collection.objects.get(pk=collection_id)
        if action == "1":
            collection.add_follow(user)
        elif action == "0":
            collection.rem_follow(user)
        elif action == "2":
            collection.duplicate(user)
        return HttpResponse('succesful')
    else:
        return HttpResponse('unsuccesful')


def admin_tags_portal(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/auth0')
    else:
        if request.user.username != "pabwarno":
            return render(request,'tribe/join.html') 
        else:
            return render(request,'tribe/admin_manage_tags.html')

def admin_featured_collection_portal(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/auth0')
    else:
        if request.user.username != "pabwarno":
            return render(request,'tribe/join.html') 
        else:
            return render(request,'tribe/admin_fcollections.html')

def admin_tags_push(request):
    if request.method == 'POST':
        tag_pushed = request.POST.get("tag")
        tag = Tag.objects.get(name=tag_pushed)
        films = request.POST.getlist("added_films[]")
        films_removed = request.POST.getlist("removed_films[]")
        for film in films:
            film_object = Film.objects.get(movie_ID=film)
            film_object.tags.add(tag)
            film_object.save()
        for film in films_removed:
            film_object = Film.objects.get(movie_ID=film)
            film_object.tags.remove(tag)
            film_object.save()
        return HttpResponse("success")
    else:
        return HttpResponse("unsuccesful")

def admin_f_collections_push(request): #f stands for featured
    if request.method == 'POST':
        collection_pushed = request.POST.get("collection")
        new_name = request.POST.get("name")
        status = request.POST.get("status")
        collection = Collection.objects.get(name=collection_pushed)
        films = request.POST.getlist("added_films[]")
        collection.films.clear()
        for film in films:
            film_object = Film.objects.get(movie_ID=film)
            collection.films.add(film_object)
            collection.save()
        if new_name != collection_pushed:
            collection.name = new_name
        if status == "true":
            print(status)
            collection.active = 1
        else:
            collection.active = 0
        collection.save()
        return HttpResponse("success")
    else:
        return HttpResponse("unsuccesful")
