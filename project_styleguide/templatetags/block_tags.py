from django import template
from django.conf import settings
from django.utils.html import mark_safe

import requests

register = template.Library()


# Handle content of FormAssembly Form block based on presence of GET parameter
@register.simple_tag(takes_context=True)
def formassemblyform(context, request, form_id):
    # Use FormAssembly Enterprise instance if specified
    formassembly_instance = getattr(
        settings,
        'FORMASSEMBLY_INSTANCE',
        'https://app.formassembly.com'
    )

    tfa_next = request.GET.get('tfa_next')
    if tfa_next is not None:
        fa_form = requests.get('%s/rest%s' % (formassembly_instance, tfa_next))
    else:
        fa_form = requests.get('%s/rest/forms/view/%s' % (formassembly_instance, form_id))

    content = ''
    if fa_form.status_code == 200:
        content = fa_form.text
    else:
        content = "Error fetching form: %s" % fa_form.status_code

    return mark_safe(content)
