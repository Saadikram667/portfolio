from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path

from portfolio.api import api


def api_root(_request):
    payload = {"status": "ok", "api": "/api/portfolio/"}
    if settings.DEBUG:
        payload["docs"] = "/api/docs"
    return JsonResponse(payload)


urlpatterns = [
    path("", api_root),
    path(settings.ADMIN_URL_PATH, admin.site.urls),
    path("api/", api.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)