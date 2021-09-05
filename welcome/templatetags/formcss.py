from django import template
register = template.Library()

#this allowed us to style each element in the form in css!!

@register.filter(name='addclass')
def addclass(field, css):
    return field.as_widget(attrs={"class":css})
    