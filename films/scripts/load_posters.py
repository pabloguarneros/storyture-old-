import os
from films.models import Film
'''
def run():
    rootdir = '/Users/pabwarno/storyture2/storyture2/media/posters'
    for folder in os.listdir(rootdir):
        if os.path.isdir(f'{rootdir}/{folder}'):  
            if len(os.listdir(f'{rootdir}/{folder}')) > 0:
                film = Film.objects.get(movie_ID=folder)
                film.poster_pic = f'posters/{folder}/poster.jpg'
                film.save()

'''