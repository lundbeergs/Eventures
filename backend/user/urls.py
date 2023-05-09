from django.urls import path,include
from user.views import StudentRegistrationView, OrganizationRegistrationView, UserLoginView, UserDeleteAPIView, TokenRefreshView, UserLogoutView


urlpatterns = [
	path('signup/student/',StudentRegistrationView.as_view(),name='signup_student'),
	path('signup/organization/',OrganizationRegistrationView.as_view(),name='signup_organization'),
	path('signin/',UserLoginView.as_view(), name='token_obtain_pair'),
    path('logout/', UserLogoutView.as_view()), #Använd "POST"
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('delete/student/', UserDeleteAPIView.as_view(), name='student-delete'), #endast access token ska skickas in för att lyckas radera sin egna profil
]