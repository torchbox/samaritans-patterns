from django import template
from django.conf import settings

register = template.Library()


@register.inclusion_tag('patterns/atoms/loqate/loqate-script.html')
def loqate_script():
    return {
        'loqate_account_id': settings.LOQATE_ACCOUNT_ID,
    }
