from django.shortcuts import redirect, render
from django.http import HttpResponse, HttpResponseRedirect
from urllib.parse import urlencode
from django.conf import settings
from rest_framework import generics
from .models import CustomUser, Relationship, Recommend, Feedback, ActionID, Action, User_Collection
from . import serializers
from films.models import Film
from django.db.models import Q
from django.contrib.auth import logout as log_out

def add_recommend(self,person,film):
    '''
    Add recommendation and flag for actions
    Send objects person = friend recommending it to and film being recommended
    
    To improve: check if add_recommend is actually being referenced on film_profile
    '''
    relationship, created = Recommend.objects.get_or_create(
        from_person=self,
        to_person=person)
    relationship.films.add(film)
    relationship.save()

    action_id, created = ActionID.objects.get_or_create(user=self)
    action_id.add_act(1, rel_users=person, rel_films=film)

    return relationship

def change_friend(request):
    if request.method == 'POST':
        user = request.user
        target = request.POST.get('target')
        n_val = request.POST.get('n_val') #new value
        target = CustomUser.objects.get(username=target)
        if n_val == "fc_friends":
            user.rem_friend(target)
        elif n_val == "fc_cancel":
            user.cancel_request(target)
        elif n_val == "fc_respond":
            user.acc_request(target)
        elif n_val == "fc_add":
            user.send_request(target)
        return HttpResponse("success")
    else:
        return HttpResponse("unsuccesful")

# Create your views here.
def my_profile(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/auth0')
    return redirect(f'/user/{request.user.username}')

def logout_view(request):
    log_out(request)
    context = {"film": Film.objects.get(movie_ID=16355)}
    return render(request,'users/success_out.html',context)

def feedback(request):
    if request.method == 'POST':
        user = request.user
        comment = request.POST.get("feedback")
        Feedback.objects.create(feedback=comment,bya=user)
        return HttpResponse('succesful')
    else:
        return HttpResponse('unsuccesful')

def add_click(request):
    if request.method == 'POST':
        f_user = request.POST.get("f_user")
        friend = CustomUser.objects.get(username=f_user)
        user = request.user
        relationship = Relationship.objects.get(from_person=user,to_person=friend)
        relationship.visits_to += 1
        relationship.save()
        return HttpResponse('succesful')
    else:
        return HttpResponse('unsuccesful')

def seen_delete_notif(request):
    if request.method == 'POST':
        seen_or_delete = request.POST.get("do")
        action_id = request.POST.get("action_id")
        action = Action.objects.get(pk=action_id)
        if seen_or_delete == "seen":
            action.add_seen(request.user)
        elif seen_or_delete == "delete":
            action.add_rem(request.user)
        return HttpResponse('succesful')
    else:
        return HttpResponse('unsuccesful')

class actionList(generics.ListAPIView):

    '''
    this is where we will load the notifications
    note, that the algorithm will change depending on:
        (1) the clicks between users

    to improve: exclude the accept/sent requests that do not involve the user!
    '''
    serializer_class = serializers.ActionSerializer

    def get_queryset(self):
        user = self.request.user
        q_objects = Q()

        friends = [friend for friend in user.get_friends_sorted()]#sorted friends by number of lists!!   
        for friend in friends: # should now be ordered by how close they are to the friend!
            q_objects |= Q(user=friend)
        action_group = ActionID.objects.all().filter(q_objects)
        ff_query = action_group[0].actions.all() #first action in news feed

        for collection in action_group[1:]: #appens next actions for each user to the query
            ff_query |= collection.actions.all()

        ff_query = ff_query.exclude(categ=3).order_by('-time')
        
        queryset = ff_query
        
        requests = [request for request in user.get_requests()]#sorted friends by number of lists!!   

        if requests:
            rec_objects= Q()
            for request in requests: # should now be ordered by how close they are to the friend!
                rec_objects |= Q(user=request)
            rec_group = ActionID.objects.all().filter(rec_objects)
            
            if rec_group:
                rec_query = rec_group[0].actions.all().filter(Q(categ=3)&Q(rel_users=user)) #&Q(rel_users__icontains=user)
                for collection in rec_group[1:]:
                    rec_query |= collection.actions.all().filter(Q(categ=3)&Q(rel_users=user))
            
            rec_query = rec_query.order_by('-time')

            queryset |= rec_query

        return queryset.exclude(removed=user)

class userList(generics.ListAPIView):

    '''
    Get a list of users with the top users being the ones that are mutual friends of the user
    '''

    serializer_class = serializers.CustomUserSerializer

    def get_queryset(self):
        name = self.request.query_params.get('name', None)
            #CustomUser.objects.all().filter(Q(username__icontains=name))
        mutual_ff = [friend.username for friend in self.request.user.get_users_mutual_friends()]
        mutual_object = CustomUser.objects.all().filter(Q(username__icontains=name)).filter(username__in=mutual_ff)
        search_query = CustomUser.objects.all().filter(Q(username__icontains=name)).exclude(username=self.request.user.username)
        return mutual_object.union(search_query)[:50]
        #.filter(Q(username__icontains=name)).exclude(username=self.request.user.username) #expensive, is there a way to filter out the entire user at O(1)?


class collection_x_filmList(generics.ListAPIView):

    '''
    Get a list of films in a user's collection 
    '''

    serializer_class = serializers.CollectionByFilmSerializer

    def get_queryset(self):
        pk = self.request.query_params.get('colletion_pk', None)
        return User_Collection.objects.get(pk=pk).films.all()
    
class userMain(generics.ListAPIView):

    '''
    Get a list of users with the top users being the ones that are mutual friends of the user
    '''

    serializer_class = serializers.CustomUserSerializer

    def get_queryset(self):
        name = self.request.query_params.get('query', None)
        start = self.request.query_params.get('start', "0")
        end = self.request.query_params.get('end', "20")

        if self.request.user.username:
            mutual_ff = [friend.username for friend in self.request.user.get_users_mutual_friends()]
            mutual_object = CustomUser.objects.all().filter(Q(username__icontains=name)).filter(username__in=mutual_ff)
            search_query = CustomUser.objects.all().filter(Q(username__icontains=name)).exclude(username=self.request.user.username)
            return mutual_object.union(search_query)[int(start):int(end)]
        else:
            return CustomUser.objects.all().filter(username__icontains=name)[int(start):int(end)]