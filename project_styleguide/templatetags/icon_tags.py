from django import template

register = template.Library()


@register.tag
def render_icon(parser, token):
    """
    Template tag to render an icon stored as SVG in a HTML file.

    Accepts the name of the template (without .html) and the value for an
    HTML class attribute to apply to the SVG.
    """
    try:
        tag_name, icon, classes = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError(
            "%r tag requires exactly two arguments" % token.contents.split()[0]
        )
    return RenderIconNode(icon, classes[1:-1])


class RenderIconNode(template.Node):
    """
    Template node to perform rendering of an icon stored as SVG in a HTML file.
    """

    def __init__(self, icon, classes):
        self.icon = template.Variable(icon)
        self.classes = classes

    def render(self, context):
        try:
            icon = self.icon.resolve(context)
            template_path = f'patterns/atoms/svg/colour-icons/{icon}.html'
            t = context.template.engine.get_template(template_path)
            return t.render(
                template.Context(
                    {'classes': self.classes},
                    autoescape=context.autoescape)
            )
        except template.VariableDoesNotExist:
            return ''
