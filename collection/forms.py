from django import forms
from users.models import User_Collection
from films.models import Tag, Film
from django.core.files.uploadedfile import SimpleUploadedFile

class CollectionUpdateForm(forms.ModelForm):
    '''
    films = forms.ModelMultipleChoiceField(
            queryset=Film.objects.all(),
            label="Films in Collection"
        )
    '''
    tags = forms.ModelMultipleChoiceField(
            queryset=Tag.objects.all(),
            label="Tags"
        )
    class Meta:
        model=User_Collection
        fields=['collection_name','privacy','description','tags']

#you can use initial for initial values too