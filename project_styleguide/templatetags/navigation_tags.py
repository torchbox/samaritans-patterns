from django.template.engine import Engine

from pattern_library.monkey_utils import override_tag

default_engine = Engine.get_default()

try:
    register = default_engine.template_libraries['navigation_tags']
except KeyError:
    pass
else:
    override_tag(register, name='primarynav')
    override_tag(register, name='secondarynav')
    override_tag(register, name='footernav')
    override_tag(register, name='sidebar')
    override_tag(register, name='footerlinks')
