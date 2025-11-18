from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from .models import BlogPost
from .serializers import BlogPostSerializer

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    lookup_field = "slug"
    parser_classes = (MultiPartParser, FormParser)
