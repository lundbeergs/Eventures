from django.urls import path,include
from rest_framework import routers
from userprofile.views import *

# organizations_router = routers.DefaultRouter()
# organizations_router.register(r'organizations', OrganizationViewSet)


# OBS FIXA SÅ STUDENTID OCH ORGID ALLTID FINNS I URL FROM LOGIN!!!!!!!!!!!!

urlpatterns = [
	path('profile/',UserProfileView.as_view()),
    path('drinkpref/', DrinkPrefView.as_view()),

    # Sjsjsjs
	path('membership/request/<uuid:organization_id>/<uuid:student_id>/', MembershipRequestView.as_view()), # ANVÄND DENNA <3
    path('membership/request/<uuid:student_id>/', MembershipRequestView.as_view()), #Lista på alla membership requests som en user har

    # För organisationen att se sina membership requests, och ändra dessa.
    path('membership/requests/<uuid:organization_id>/', OrganizationMembershipRequestsView.as_view()),
	path('membership/requests/<uuid:organization_id>/<uuid:student_id>/', OrganizationMembershipRequestsView.as_view()),

    #För organisationen att få en lista på sina medlemmar, samt möjlighet att radera. 
    path('membership/organization/<uuid:organization_id>/', OrganizationMembershipView.as_view(), name='organization_membership_list'),
        # för: 
        #   - GET
    path('membership/organization/<uuid:organization_id>/<uuid:student_id>/', OrganizationMembershipView.as_view(), name='membership_delete'),
        # för: 
        #   - DELETE

	# path('membership/request/organization/<uuid:organization_id>/<uuid:student_id>/', MembershipDeleteView.as_view(), name='membership_delete'),
    path('memberships/', StudentMembershipView.as_view(), name='student-memberships'),
    path('memberships/<uuid:organization_id>/', CheckMembershipView.as_view(), name='organization-memberships'),
	path('membership/student/<uuid:organization_id>/<uuid:student_id>/', MembershipDeleteView.as_view(), name='membership_delete'),

    path('students/', StudentListView.as_view()),
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

    # This view returns the list of all tickets bought for a particular event by the members of the organization. 
    path('events/<uuid:event_id>/tickets/', EventTicketsListView.as_view(), name='event-tickets-list'),
        # för:
        # - GET 

    # This view returns the list of all tickets bought by the logged-in student user.
    path('student-tickets/', StudentTicketsListView.as_view(), name='student-tickets-list'),
        # för:
        # - GET

    #This view returns the details of a particular ticket bought for an event by a member of the organization
    path('events/<uuid:event_id>/tickets/<uuid:ticket_id>/', EventTicketsDetailView.as_view(), name='event-ticket-detail'),
        # för:
        # - GET


    path('events/<uuid:event_id>/buy/', BuyTicketView.as_view(), name ='buy_tickets')
        # för:
        # - POST en student köper en biljett från en specifikt event.


   
]	# path('organizations/', OrganizationViewSet.as_view({'get': 'list'})