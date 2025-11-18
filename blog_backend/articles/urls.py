# articles/urls.py

from django.urls import path
from .views import BlogPostViewSet
from .views_upload import ImageUploadView, VideoUploadView

urlpatterns = [
    path("posts/", BlogPostViewSet.as_view({"get": "list", "post": "create"})),
    path("posts/<slug:slug>/", BlogPostViewSet.as_view({"get": "retrieve"})),

    # Upload endpoints
    path("upload/image/", ImageUploadView.as_view(), name="upload-image"),
    path("upload/video/", VideoUploadView.as_view(), name="upload-video"),
]
