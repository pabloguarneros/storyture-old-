from django.shortcuts import render
from .models import Market
from users.models import ActionID
from django.http import HttpResponse
# Create your views here.
def store_front(request):
    return render(request,'market/store_front.html')

def buy(request):
    if request.method == 'POST':
        user = request.user
        item_name = request.POST.get('object')
        #same as user.item_name, given that the item_name that you want might be
        # == "stage", "projector", "speaker", "seat", "popcorn"

        action_id, created = ActionID.objects.get_or_create(user=request.user)
        if item_name == "stage":
            action_id.add_act(8)
        elif item_name == "speaker":
            action_id.add_act(9)
        elif item_name == "seat":
            action_id.add_act(10)
        elif item_name == "projector":
            action_id.add_act(11)
        elif item_name == "popcorn":
            action_id.add_act(12)

        current_item = getattr(user, item_name) #gets the foreign field value of this item
        cost = current_item.level_up.cost
        user.kn -= cost
        setattr(user, item_name, current_item.level_up)
        user.save()
        return HttpResponse("success")
    else:
        return HttpResponse("unsuccesful")