from rest_framework import viewsets, filters, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import BlogPost
from .serializers import BlogPostSerializer


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().order_by("-created_at")
    serializer_class = BlogPostSerializer
    lookup_field = "slug"

    # Allow file uploads
    parser_classes = (MultiPartParser, FormParser)

    # SEARCH + ORDERING
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    # Search on these fields
    search_fields = ["title", "subtitle", "content_html"]

    # Allow sorting
    ordering_fields = ["created_at", "title"]
    ordering = ["-created_at"]  # default newest first

    # OPTIONAL — If you want posts editable only by admin:
    # permission_classes = [permissions.IsAdminUser]
    # If you want anyone to read but only admin can write:
    # def get_permissions(self):
    #     if self.request.method in ["POST", "PUT", "PATCH", "DELETE"]:
    #         return [permissions.IsAdminUser()]
    #     return [permissions.AllowAny()]
