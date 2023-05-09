from django.shortcuts import render

# Create your views here.

from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from user.serializers import StudentRegistrationSerializer, OrganizationRegistrationSerializer
from user.serializers import UserLoginSerializer
from user.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import authentication, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

# from django.contrib.auth import logout

class StudentRegistrationView(CreateAPIView):

    serializer_class = StudentRegistrationSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response = {
            'success' : 'True',
            'status code' : status.HTTP_200_OK,
            'message': 'Student registered  successfully',
            }
        status_code = status.HTTP_200_OK
        return Response(response, status=status_code)

class OrganizationRegistrationView(CreateAPIView):

    serializer_class = OrganizationRegistrationSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response = {
            'success' : 'True',
            'status code' : status.HTTP_200_OK,
            'message': 'Organization registered  successfully',
            }
        status_code = status.HTTP_200_OK
        return Response(response, status=status_code)


class UserLoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        # response = {
        #     'success' : 'True',
        #     'status code' : status.HTTP_200_OK,
        #     'message': 'User logged in successfully',
        #     'token' : serializer.data['token'],
        #     }

        status_code = status.HTTP_200_OK

        return Response(serializer.validated_data, status=status_code)

class TokenRefreshView(TokenRefreshView):
    pass


# class Logout(APIView):
#     authentication_classes = [JSONWebTokenAuthentication]
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         try:
#             request.user.auth_token.delete()
#         except (AttributeError, ObjectDoesNotExist):
#             pass
#         return Response({"detail": "You have been logged out."})



class UserLogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if self.request.data.get('all'):
            token: OutstandingToken
            for token in OutstandingToken.objects.filter(user=request.user):
                _, _ = BlacklistedToken.objects.get_or_create(token=token)
            return Response({"status": "OK, goodbye, all refresh tokens blacklisted"})
        refresh_token = self.request.data.get('refresh_token')
        token = RefreshToken(token=refresh_token)
        token.blacklist()
        return Response({"status": "OK, goodbye"})

# class UserLogoutView(APIView):
#     permission_classes = (IsAuthenticated,)
#     authentication_classes = [JWTAuthentication]

#     def post(self, request):
#         refresh_token = request.data.get("refresh_token")
#         if not refresh_token:
#             return Response(
#                 {"error": "Please provide a refresh token"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             token = RefreshToken(refresh_token)
#             token.blacklist()
#         except Exception as e:
#             return Response(
#                 {"error": "Token is invalid or expired"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         return Response(
#             {"success": "User logged out successfully"},
#             status=status.HTTP_200_OK
#         )
    

class UserDeleteAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        try:
            if request.user.is_student == True:
                user = request.user
                user.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                raise Exception('User is not a student')
        except Exception as e:
            status_code = status.HTTP_400_BAD_REQUEST
            response = {
                'success': 'false',
                'status code': status.HTTP_400_BAD_REQUEST,
                'message': 'User does not exist or invalid request',
                'error': str(e)
            }
        return Response(response, status=status_code)


# def logout_view(request):
#     logout(request)
#     return Response({"success": "Successfully logged out."})

# class UserLoginView(RetrieveAPIView):
#     permission_classes = (AllowAny,)
#     serializer_class = UserLoginSerializer
#     lookup_fields = ['email', 'password']
#     queryset = User.objects.all()
    
    
#     def post(self, request):
#         serializer = self.serializer_class(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         response = {
#             'success' : 'True',
#             'status code' : status.HTTP_200_OK,
#             'message': 'User logged in  successfully',
#             'token' : serializer.data['token'],
#             }
#         status_code = status.HTTP_200_OK

#         return Response(response, status=status_code)
