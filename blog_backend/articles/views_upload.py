# articles/views_upload.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage

class ImageUploadView(APIView):
    def post(self, request):
        try:
            file = request.FILES.get("file")
            if not file:
                return Response({"error": "No file provided"}, status=400)

            path = default_storage.save(f"uploads/images/{file.name}", file)
            url = request.build_absolute_uri("/media/" + path)

            return Response({"url": url}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)


class VideoUploadView(APIView):
    def post(self, request):
        try:
            file = request.FILES.get("file")
            if not file:
                return Response({"error": "No file provided"}, status=400)

            # allow multiple formats
            allowed = (".mp4", ".webm", ".mov", ".m4v")
            if not file.name.lower().endswith(allowed):
                return Response({"error": "Only MP4, WebM, MOV, M4V allowed"}, status=400)

            path = default_storage.save(f"uploads/videos/{file.name}", file)
            url = request.build_absolute_uri("/media/" + path)

            return Response({"url": url}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)
