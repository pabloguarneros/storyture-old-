from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, Http404
from django.db.models import Q

from users.models import User_Collection
from films.models import Film

from .forms import CollectionUpdateForm
from .models import Deleted_Collection
from rest_framework import status, generics
from . import serializers

# Create your views here.
def collection(request,collection_pk):
    try:
        collection = User_Collection.objects.get(pk=collection_pk)
    except User_Collection.DoesNotExist:
        raise Http404("Collection does not exist")
    context = {
        "collection":collection
    }
    return render(request,"collection/collection.html",context)

def remove_film(request,collection_pk):
    if request.method == 'POST':
        movie_ID = request.POST.get('movie_ID')
        collection = User_Collection.objects.get(pk=collection_pk)
        film = Film.objects.get(movie_ID=movie_ID)
        collection.rem_film(film)
        return HttpResponse("success")
    else:
        return HttpResponse("unsuccesful")

def delete_collection(request,collection_pk):
    if request.method == 'POST':
        collection = User_Collection.objects.get(pk=collection_pk)
        if request.user == collection.bya:
            trash_instance = Deleted_Collection()
            trash_instance.save()
            trash_instance.migrate_collection(collection)
            collection.delete()
            return HttpResponse("success")
        return HttpResponse("unsuccesful. you are not the admin of this collection")
    else:
        return HttpResponse("unsuccesful")

def collection_update(request,collection_pk):
    collection = User_Collection.objects.get(pk=collection_pk)
    if request.method == 'POST':
        u_form = CollectionUpdateForm(request.POST,instance=collection)
        if u_form.is_valid():
            u_form.save()
            return redirect('my_profile')
    else:
        u_form = CollectionUpdateForm(instance=collection)

    context = {
            'collection':collection,
            'u_form': u_form,
            }

    return render(request, 'collection/collection_update.html',context)

def add_films(request,collection_pk):
    collection = User_Collection.objects.get(pk=collection_pk)
    context = {
            'collection':collection,
            }

    return render(request, 'collection/collection_add.html',context)

def added_films(request,collection_pk):
    if request.method == 'POST':
        collection = User_Collection.objects.get(pk=collection_pk)
        films = request.POST.getlist("movie_ID[]")
        collection.change_films(films)
        
        return HttpResponse("success")
    else:
        return HttpResponse("unsuccesful")


class collectionMain(generics.ListAPIView):

    serializer_class = serializers.CollectionSerializer

    def get_queryset(self):
        query = self.request.query_params.get('query', None)
        start = self.request.query_params.get('start', "0")
        end = self.request.query_params.get('end', "20")
        queryset = User_Collection.objects.all().filter(Q(collection_name__icontains=query)|Q(tags__name__icontains=query)).order_by('-popularity')

        return queryset.distinct()[int(start):int(end)]