from films.models import Film

for film in Film.objects.all():
    films = Film.objects.filter(title=film.title)
    if len(films) > 1:
        yy_films = films.filter(year=film.year)
        if len(yy_films) > 1:
            film.dup = 1
            film.save()