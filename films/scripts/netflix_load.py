import json
from django.db.models import Q
from films.models import Film

#BE CAREFUL TO LOAD THIS AGAIN AS IT MIGHT MESS UP WITH ANY HELP YOU HAVE RECEIVED FROM PEOPLE!!! AHH

def run():
    tags = open('films/fixtures/netflix_id.json')
    reader = json.load(tags)
    not_found = []

    for row in reader:
        films = Film.objects.filter(Q(title=row["film_name"])|
                                Q(alt_tt_1=row["film_name"])|
                                Q(alt_tt_2=row["film_name"])
                                )
        if films.exists():
            if len(films) > 1:
                for film in films:
                    film.net_id = row["net_id"]
                    film.net_alert = 2
                    film.save()
            else:
                for film in films:
                    film.net_id = row["net_id"]
                    film.net_alert = 1
                    film.save()
        else:
            not_found.append((row["film_name"],row["net_id"]))
           #here include a call where it could be or not could be netflix
           #film.net_id = row["net_id"]
           #film.net_alert = 1
    print(not_found)
           #right now don't save, just do a quick test?
           #exluce net_ID and IMDB code from rest framework    