from django import template

register = template.Library()


@register.filter
def strip_nbsp(value):
    """
    Replace non-breaking spaces with regular ones because the font we use
    doesn't render them well.
    """
    return value.replace("\xa0", " ")
