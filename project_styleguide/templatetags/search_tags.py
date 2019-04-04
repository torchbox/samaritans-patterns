from urllib.parse import urlencode

from django import template

register = template.Library()


@register.filter
def slice_pagination(page_range, current_page):
    """Slices paginator.page_range to limit which page links are displayed

    The logic for which page numbers are shown is based on Google Search's
    pagination.

    Examples:

    When current_page is within the first four pages
        1 [2] 3 4 5 6 7 8

    When current_page is within the last three pages
        14 15 16 17 18 [19] 20 21

    When current_page is somewhere in the middle
        12 13 14 15 [16] 17 18 19
    """
    # Show first 8 pages
    if current_page in page_range[:4]:
        return page_range[:8]

    # Show last 8 pages
    if current_page in page_range[-3:]:
        return page_range[-8:]

    # Show 4 pages before and 3 pages after the current page
    return page_range[current_page - 5:current_page + 3]


@register.simple_tag(takes_context=True)
def pagination_link(context, page_number, page_param_name='page'):
    """Returns a URL to the specified page, keeping the GET parameters intact"""
    params = context['request'].GET.copy()
    # Filter out empty query parameters
    params = {key: value for key, value in params.items() if value != ''}
    params[page_param_name] = page_number
    return f'?{urlencode(params)}'
