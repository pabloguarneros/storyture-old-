from django.shortcuts import render
from django.http import HttpResponse
from users.models import CustomUser
from films.models import Film, Search, Searchdata
from django.contrib.auth.decorators import login_required

def film_search(request):
    if request.method == 'POST':
        user = request.user
        film = request.POST.get('film')
        query = request.POST.get('query') #new value
        query_obj, created = Search.objects.get_or_create(search=query)
        film_obj = Film.objects.get(movie_ID=film)
        search_data, created = Searchdata.objects.get_or_create(search=query_obj,film=film_obj)
        search_data.count += 1
        search_data.save()
   
        if user.username:
            user.searches.add(search_data)
            user.save()
        return HttpResponse("success")
    else:
        return HttpResponse("unsuccesful")

@login_required(login_url='welcome:landing')
def search(request):
    return render(request,"search/new_search.html")