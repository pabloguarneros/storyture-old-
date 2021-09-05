from django import forms
from films.models import Comment, Film, Country, Tag, Language, Genre, ProdCo, Score_MPA


class AddFilmForm(forms.ModelForm):
    title = forms.CharField(
        required=True
    )
    alt_tt_1 = forms.CharField(
            label="Alternative Title #1",
            required=False
    )
    alt_tt_2 = forms.CharField(
            label="Alternative Title #2",
            required=False
    )
    country = forms.ModelMultipleChoiceField(
            queryset=Country.objects.all(),
            label="Countries",
            required=True
        )
    tags = forms.ModelMultipleChoiceField(
            queryset=Tag.objects.all(),
            label="Tags",
            required=False
        )
    language = forms.ModelMultipleChoiceField(
            queryset=Language.objects.all(),
            label="Languages",
            required=True
        )
    genre = forms.ModelMultipleChoiceField(
            queryset=Genre.objects.all(),
            label="Genres",
            required=True
        )
    synopsis = forms.CharField(
            widget=forms.Textarea,
            required=True
        )
    trailer = forms.CharField(
        help_text="Make sure your url has Youtube's 'embed!' e.g. 'https://www.youtube.com/embed/...'",
        required=False
    )
    poster_pic = forms.ImageField(
        label="Poster Picture",
        required=True)
    co2_t = forms.IntegerField(
        label="C02 emissions (in tonnes)",
        required=False)
    rotten_score = forms.IntegerField(
        label="Rotten Tomatoes (XX%)",
        required=False)

    class Meta:
        model=Film
        fields=['title','alt_tt_1','alt_tt_2','poster_pic','year','country','language','genre','synopsis','tags','trailer','minutes','imdb_score','imdb_code','co2_t','net_id','net_alert','rotten_score']
