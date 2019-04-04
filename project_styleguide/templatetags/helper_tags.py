import json

from django import template
from django.conf import settings
from django.core.serializers.json import DjangoJSONEncoder
from django.templatetags.static import static
from django.utils.html import format_html
from django.utils.safestring import SafeText, mark_safe

from wagtail.core.models import Site

from samaritans.utils.models import SystemMessagesSettings

register = template.Library()


@register.simple_tag
def key_value(dict, key):
    return dict.get(key)


@register.filter
def split_last_word(str_to_split):
    # Convert a string into a list with the last word of the string
    # in the last item, and everything else in the first.
    parts = str_to_split.rsplit(' ', 1)
    # If the incoming string was safe, then mark its parts as safe
    if isinstance(str_to_split, SafeText):
        parts = map(mark_safe, parts)
    return parts


@register.simple_tag(takes_context=True)
def privacy_statement_url(context):
    request = context['request']
    site = getattr(request, 'site', Site.objects.get(is_default_site=True))
    settings = SystemMessagesSettings.for_site(site)
    privacy_page = settings.cookie_banner_more_info_link
    return privacy_page.get_url(request) if privacy_page else ''


@register.simple_tag
def absolute_static_url(path):
    # Return a static URL, ensuring that it is absolute by prepending BASE_URL if required
    url = static(path)
    if url.startswith('/'):
        url = '{}{}'.format(settings.BASE_URL, url)
    return url


# json_script is taken from Django 2.1
# https://docs.djangoproject.com/en/2.1/ref/templates/builtins/#json-script
# This can be dropped when we upgrade Django.


_json_script_escapes = {
    ord('>'): '\\u003E',
    ord('<'): '\\u003C',
    ord('&'): '\\u0026',
}


@register.filter(is_safe=True)
def json_script(value, element_id):
    """
    Escape all the HTML/XML special characters with their unicode escapes, so
    value is safe to be output anywhere except for inside a tag attribute. Wrap
    the escaped JSON in a script tag.
    """
    json_str = json.dumps(value, cls=DjangoJSONEncoder).translate(_json_script_escapes)
    return format_html(
        '<script id="{}" type="application/json">{}</script>',
        element_id, mark_safe(json_str)
    )
