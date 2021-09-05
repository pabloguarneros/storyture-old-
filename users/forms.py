from django import forms
from PIL import Image
from .models import CustomUser
from films.models import Country
from django.core.files.uploadedfile import SimpleUploadedFile


class UserUpdateForm(forms.ModelForm):
    country = forms.ModelMultipleChoiceField(
            queryset=Country.objects.all(),
            label="Country"
        )
    prof_pic = forms.ImageField(label="Profile Picture")

    class Meta:
        model=CustomUser
        fields=['username','email','theatre_name','country','prof_pic']

#you can use initial for initial values too