from collections import OrderedDict

from django import template
from django.conf import settings
from django.urls import translate_url
from django.utils import translation

from samaritans.utils.constants import LANGUAGE_WELSH

register = template.Library()

ENGLAND = 'england'
WALES = 'wales'
CYMRU = 'cymru'


def get_english_slug(locale_slug):
    if locale_slug in [WALES, CYMRU]:
        return WALES
    return locale_slug.strip('-cy')


def get_cymraeg_slug(locale_slug):
    if locale_slug in [WALES, CYMRU]:
        return CYMRU
    return '{}-cy'.format(locale_slug)


@register.simple_tag(takes_context=True)
def get_path_for_locale(context, locale=None):
    request = context['request']
    # Don't mess with query arguments if we are on the home page
    path = request.path if request.path == '/' else request.get_full_path()
    return translate_url(path, locale)


@register.inclusion_tag('patterns/atoms/locale/locale-switcher.html', takes_context=True)
def locale_switcher(context):
    request = context['request']
    current_locale = request.COOKIES.get(settings.LANGUAGE_COOKIE_NAME, settings.DEFAULT_LOCALE)

    # If the current locale includes a Welsh component, then we change all the locale choices to match
    if current_locale in settings.WELSH_LOCALES:
        available_choices = settings.LANGUAGES_CY
    else:
        available_choices = settings.LANGUAGES_EN

    available_languages = [(k, translation.gettext(v)) for k, v in available_choices]

    choices = OrderedDict()
    for language in available_languages:
        info = translation.get_language_info(language[0])
        info['is_active'] = current_locale == language[0]
        choices[language[0]] = info

    return {
        'choices': choices,
        'request': request,
    }


@register.inclusion_tag('patterns/atoms/locale/language-switcher.html', takes_context=True)
def language_switcher(context):
    page = context.get('page')
    if page is None or not hasattr(page, 'has_translations') or not (page.has_translations or page.canonical_page_id):
        return {'choices': None}

    request = context['request']
    current_locale = request.COOKIES.get(settings.LANGUAGE_COOKIE_NAME, settings.DEFAULT_LOCALE)
    cymraeg_active = current_locale in settings.WELSH_LOCALES

    choices = (
        ('English', {
            'is_active': not cymraeg_active,
            'slug': get_english_slug(current_locale) if cymraeg_active else None
        }),
        ('Cymraeg', {
            'is_active': cymraeg_active,
            'slug': get_cymraeg_slug(current_locale) if not cymraeg_active else None
        }),
    )

    return {
        'choices': choices,
        'request': request,
    }


@register.inclusion_tag('patterns/atoms/locale/canonical-alternate-links.html', takes_context=True)
def canonical_and_alternate_links(context):
    page = context.get('page')
    # We care about the URL prefix, not the user's cookie preference
    current_locale = translation.get_language()
    page_has_translation = page and hasattr(page, 'language') and (page.canonical_page_id or page.has_translations)

    # hreflang tags are only set if we are on the canonical URL for either English or Cymreag
    if current_locale in (ENGLAND, CYMRU) and page_has_translation:
        english_url = get_path_for_locale(context, None)
        cymraeg_url = get_path_for_locale(context, CYMRU)
        languages = [
            {'code': 'en-gb', 'url': english_url},
            {'code': 'cy-gb', 'url': cymraeg_url},
            {'code': 'x-default', 'url': english_url},
        ]

    else:
        languages = []

    canonical_url = get_path_for_locale(
        context,
        CYMRU if (current_locale in settings.WELSH_LOCALES and page_has_translation) else None
    )

    return {
        'request': context['request'],
        'languages': languages,
        'canonical_url': canonical_url,
    }


@register.simple_tag(takes_context=True)
def html_language_code(context):
    page = context.get('page')
    is_cymraeg = page and getattr(page, 'language', None) == LANGUAGE_WELSH
    return 'cy-GB' if is_cymraeg else 'en-GB'
