from django.urls import path,include
from rest_framework import routers
from userprofile.views import *

# organizations_router = routers.DefaultRouter()
# organizations_router.register(r'organizations', OrganizationViewSet)


# OBS FIXA SÅ STUDENTID OCH ORGID ALLTID FINNS I URL FROM LOGIN!!!!!!!!!!!!

urlpatterns = [
	path('profile/',UserProfileView.as_view()),
    path('membership/request/', MembershipRequestView.as_view()), # FUNKAR INTE OBS

    # Sjsjsjs
	path('membership/request/<uuid:organization_id>/<uuid:student_id>/', MembershipRequestView.as_view()), # ANVÄND DENNA <3

    # Hahahah
    path('membership/requests/<uuid:organization_id>/', OrganizationMembershipRequestsView.as_view()),
	path('membership/requests/<uuid:organization_id>/<uuid:student_id>/', OrganizationMembershipRequestsView.as_view()),
    path('memberships/', StudentMembershipView.as_view(), name='student-memberships'),
    path('memberships/<uuid:organization_id>/', OrganizationMembershipView.as_view(), name='organization-memberships'),
	path('membership/organization/<uuid:organization_id>/<uuid:student_id>/', MembershipDeleteView.as_view(), name='membership_delete'),

    path('organizations/', OrganizationListView.as_view()),
    path('organizations/<uuid:organization_id>/', OrganizationStudentView.as_view()),
    path('student/home/', StudentHomePageView.as_view(), name='student-home'),

    # För alla events (homepage)
    path('events/', StudentEventView.as_view()),      # behövs studetn_id va me här? kanske kan användas ex när försöker bli member?
    
    # För events på organizationprofile
    path('organizations/<uuid:organization_id>/events/', OrganizationEventView.as_view(), name='organization_event_list'),                     
        # för: 
        #   - GET lista avspecifik orgs events
        #   - POST nytt event för specifik org

    path('organizations/<uuid:organization_id>/events/<uuid:event_id>/', OrganizationEventView.as_view(), name='organization_event_detail'),
        # för:
        #   - GET specifikt attribut av event för en org
        #   - PUT vid ändring av events attribut
        #   - DELETE av event


   
]	# path('organizations/', OrganizationViewSet.as_view({'get': 'list'})