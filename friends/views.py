from django.shortcuts import render, redirect
from users.models import CustomUser, Audience, User_Collection
from films.models import Film
from django import forms
from django.contrib import messages
from django.db.models import Q
from django.http import HttpResponse, Http404
from users.forms import UserUpdateForm
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .serializers import WatchNextSerializer, UserSerializer
from django.contrib.auth.decorators import login_required


@login_required(login_url='welcome:landing')
def user_profile(request, username):
    try:
        user = CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        raise Http404("User does not exist")
    friends = user.get_friends()
    movie_recommendations = user.get_movie_recommendations()
    if not request.user.username: #if not logged in
        f_check = ""
        f_check_txt = "How u doin'"
        f_requests = ""
        to_like = ""
        collections = user.get_collections()
    elif request.user == user: #user not seeing their same profile
        f_requests = user.get_requests()
        to_like = user.to_like()
        f_check = ""
        f_check_txt = "How u doin'"
        collections = user.get_collections(privacy="private")
        
    else: 
        f_requests = ""
        to_like = ""
        if request.user in friends:
            f_check = "fc_friends"
            f_check_txt = "Remove Friend"
            collections = user.get_collections(privacy="friends")
        elif request.user in user.get_requests(): #stocker made a request
            f_check = "fc_cancel"
            f_check_txt = "Cancel Friend Request"
            collections = user.get_collections()
        elif user in request.user.get_requests(): #user made stocker a request, so they must respond
            f_check = "fc_respond"
            f_check_txt = "Accept Friend Request"
            collections = user.get_collections()
        else:
            f_check = "fc_add"
            f_check_txt = "Add Friend"
            collections = user.get_collections()

    context = {"to_like":to_like,
            "friends":friends,
                "f_check":f_check,
                "f_check_txt":f_check_txt,
                "recommends":movie_recommendations,
                "f_requests":f_requests,
                "user": user,
                "collections":collections,
                }
    return render(request, "users/owners.html",context)

@login_required(login_url='welcome:landing')
def update(request, username):
    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST,request.FILES,instance=request.user)
        if u_form.is_valid():
            u_form.save()
            return redirect('my_profile')
    else:
        u_form = UserUpdateForm(instance=request.user)

    context={'u_form': u_form}
    return render(request, 'users/update_prof.html',context)

def rem_bucket(request,username):
    if request.method == 'POST':
        user = request.user
        film_ID = request.POST.get('film_ID')
        film = Film.objects.get(movie_ID=film_ID)
        user.bucket_list.remove(film)
        if not user.former_bucket.filter(movie_ID=film_ID).exists():
            user.former_bucket.add(film)
        user.save()
        return HttpResponse("succesful")
    else:
        return HttpResponse("unsuccesful")

def rem_fav(request,username):
    if request.method == 'POST':
        user = request.user
        film_ID = request.POST.get('film_ID')
        film = Film.objects.get(movie_ID=film_ID)
        user.fav_films.remove(film)
        user.save()
        return HttpResponse("succesful")
    else:
        return HttpResponse("unsuccesful")


class WatchNext(generics.ListAPIView):

    serializer_class = WatchNextSerializer

    def get_queryset(self):
        user = self.request.user
        return Audience.objects.filter(Q(audience=user)&
                        Q(seen=1))

class GetSuggestedFriends(generics.ListAPIView):

    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        friend_suggestions = (user.get_users_mutual_friends()
                ) + (user.get_users_shared_preference()
                ) + (list(user.get_users_same_country())
                ) + (list(user.get_users_related_countries())
                ) + (list(user.get_users_similar_bucket_lists()))
        friend_suggestions = list(set(friend_suggestions) - set(user.get_users_requests_sent().union(user.get_friends())))
        return friend_suggestions