# urbanclap/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from Customer import routing as customer_routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'urbanclap.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            customer_routing.websocket_urlpatterns
        )
    ),
})