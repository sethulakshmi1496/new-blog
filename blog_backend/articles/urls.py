from django.urls import path
from .views import BlogPostViewSet
from .views_upload import ImageUploadView, VideoUploadView
from .views_auth import LoginView

urlpatterns = [
    path("posts/", BlogPostViewSet.as_view({"get": "list", "post": "create"})),
    path("posts/<slug:slug>/", BlogPostViewSet.as_view({"get": "retrieve"})),

    path("upload/image/", ImageUploadView.as_view(), name="upload-image"),
    path("upload/video/", VideoUploadView.as_view(), name="upload-video"),

    # ⭐ LOGIN ENDPOINT
    path("login/", LoginView.as_view(), name="login"),
]
