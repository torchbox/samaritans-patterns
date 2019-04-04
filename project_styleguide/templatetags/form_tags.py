from django import template

from wagtail.core.utils import camelcase_to_underscore

register = template.Library()


# Get widget type of a field
@register.filter(name='widget_type')
def widget_type(bound_field):
    return camelcase_to_underscore(bound_field.field.widget.__class__.__name__)


# Get type of field
@register.filter(name='field_type')
def field_type(bound_field):
    return camelcase_to_underscore(bound_field.field.__class__.__name__)


@register.inclusion_tag('patterns/molecules/forms/form_field.html')
def render_form_field(field):
    return {
        'field': field
    }
