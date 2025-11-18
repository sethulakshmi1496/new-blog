from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is not None:
            return Response({"success": True, "message": "Login successful"}, status=200)
        else:
            return Response({"success": False, "message": "Invalid username or password"}, status=401)
