from users.models import CustomUser, bi_string 
# Change appname and file name accordingly
def run():
    for user in CustomUser.objects.all():
        user.ab_groups = bi_string()
        user.save()