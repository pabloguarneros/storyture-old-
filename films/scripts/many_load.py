import json
'''
from films.models import Genre, Score_MPA,Country, Language, ProdCo 

def run():
    tags = open('films/fixtures/X.json')
    reader = json.load(tags)

    for row in reader:
        fields = row["fields"]
        Score_MPA.objects.get_or_create(score=fields["mpa_rate"])
        for c in fields["country"]:
            Country.objects.get_or_create(name=c)
        for l in fields["language"]:
            Language.objects.get_or_create(name=l)
        for g in fields["genre"]:
            Genre.objects.get_or_create(name=g)
        for p in fields["productions"]:
            ProdCo.objects.get_or_create(name=p)
        
'''