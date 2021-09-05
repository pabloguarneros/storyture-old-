from django import forms
from .models import Comment, Film
from films.models import Country, Tag, Language, Genre, ProdCo, Score_MPA

class CommentForm(forms.ModelForm):
    content = forms.CharField(min_length="19", label="",widget=forms.Textarea(attrs={'placeholder': 'Any thoughts about the film? Earn 40 XP for a well-written review!'}))

    class Meta:
        model=Comment
        fields = ['content']

class FilmUpdateForm(forms.ModelForm):
    country = forms.ModelMultipleChoiceField(
            queryset=Country.objects.all(),
            label="Countries",
            required=False
        )
    tags = forms.ModelMultipleChoiceField(
            queryset=Tag.objects.all(),
            label="Tags",
            required=False
        )
    language = forms.ModelMultipleChoiceField(
            queryset=Language.objects.all(),
            label="Languages",
            required=False
        )
    genre = forms.ModelMultipleChoiceField(
            queryset=Genre.objects.all(),
            label="Genres",
            required=False
        )
    productions = forms.ModelMultipleChoiceField(
            queryset=ProdCo.objects.all(),
            label="Production Companies",
            required=False
        )
    alt_tt_1 = forms.CharField(
            label="Alternative Title #1",
            required=False
        )
    alt_tt_2 = forms.CharField(
            label="Alternative Title #2",
            required=False
        )
    trailer = forms.CharField(
        help_text="Make sure your url has Youtube's 'embed!' e.g. 'https://www.youtube.com/embed/...'",
        required=False
    )
    poster_pic = forms.ImageField(label="Poster Picture")
    co2_t = forms.IntegerField(
        label="C02 emissions (in tonnes)",
        required=False)

    class Meta:
        model=Film
        fields=['title','poster_pic','synopsis','alt_tt_1','alt_tt_2','year','country','tags','language','minutes','genre','trailer','productions','co2_t']
