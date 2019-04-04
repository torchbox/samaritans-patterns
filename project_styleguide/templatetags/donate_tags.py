from urllib.parse import urlencode

from django import template
from django.urls import reverse

register = template.Library()


@register.simple_tag
def donate_url(amount, campaign_id, frequency):
    return '{}?{}'.format(
        reverse('donate:personal_details'),
        urlencode({
            'amount': amount,
            'campaign_id': campaign_id,
            'frequency': frequency,
        })
    )
