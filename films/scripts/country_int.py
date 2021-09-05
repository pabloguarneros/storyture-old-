from films.models import Country
import pandas as pd                        
from pytrends.request import TrendReq

#NEXT TIME::

'''
#NEXT TIME::

REFERENCE EACH SEARCH TERM AS A COUNTRY TO ELIMINATE LANGUAGE

def new_search(region_name):
    pytrend = TrendReq() #create instance 
    pytrend.build_payload([region_name])
    w_low = pytrend.interest_by_region(resolution='COUNTRY',inc_low_vol=True) #build, including low volume search countries
    o_loq = pytrend.interest_by_region(resolution='COUNTRY',inc_low_vol=False)
    w = w_low.sort_values(region_name, ascending=False).head(5) #so the number highest comes up
    o = o_loq.sort_values(region_name, ascending=False).head(5)
    regions = []
    for index, row in w.iterrows(): #iterate through the rows down
        new_reg = row.name
        if new_reg == "United States":
            new_reg = "USA"
        elif new_reg == "United Kingdom":
            new_reg = "UK"
        if new_reg not in regions and new_reg != region_name:
            regions.append(new_reg)
    for index, row in o.iterrows():
        new_reg = row.name
        if new_reg == "United States":
            new_reg = "USA"
        elif new_reg == "United Kingdom":
            new_reg = "UK"
        if new_reg not in regions and new_reg != region_name:
            regions.append(new_reg)
    return(regions) 

all_countries = [country.name for country in Country.objects.all()][1:]
print(all_countries)

for country in all_countries:
    interests = new_search(country)
    print(f"Now doing:{country} with {interests}")
    c_object = Country.objects.get(name=country)
    for c_interest in interests:
        no_list = ["Afghanistan","Niue","Niger","Nigeria","Papua New Guinea"]
        if c_interest == "Bosnia & Herzegovina": #change to fit with my naming of each country
            c_interest = "Bosnia and Herzegovina"
        elif c_interest == "North Macedonia":
            c_interest = "Republic of North Macedonia"
        elif c_interest == "Côte d’Ivoire":
            c_interest = "Côte d'Ivoire"
        elif c_interest == "Falkland Islands (Islas Malvinas)":
            c_interest = "Falkland Islands"

        if c_interest not in no_list:
            if Country.objects.filter(name=c_interest).exists(): #if the country exists in my file, get is good as only unique values accepted!
                new_add = Country.objects.get(name=c_interest)
                c_object.interest.add(new_add)
                c_object.save()
            else:
                print(c_interest,"ney")
        else:
            print("C interest in no list")
    c_object.interest_is = 1
    c_object.save()


'''