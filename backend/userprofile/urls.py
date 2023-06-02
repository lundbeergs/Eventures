from django.urls import path,include
from rest_framework import routers
from userprofile.views import *

urlpatterns = [
	path('profile/',UserProfileView.as_view()),
    path('drinkpref/', DrinkPrefView.as_view()), # Currently not used in front-end

    # For students to POST and GET membership requests
	path('membership/request/<uuid:organization_id>/<uuid:student_id>/', MembershipRequestView.as_view()), 
    path('membership/request/<uuid:student_id>/', MembershipRequestView.as_view()), #Lista på alla membership requests som en user har

    # For organizations to GET, PUT and DELETE membership requests
    path('membership/requests/<uuid:organization_id>/', OrganizationMembershipRequestsView.as_view()),
	path('membership/requests/<uuid:organization_id>/<uuid:student_id>/', OrganizationMembershipRequestsView.as_view()),

    # For organizations to GET and DELETE memberships
    path('membership/organization/<uuid:organization_id>/', OrganizationMembershipView.as_view(), name='organization_membership_list'),
        # for: 
        #   - GET
    path('membership/organization/<uuid:organization_id>/<uuid:student_id>/', OrganizationMembershipView.as_view(), name='membership_delete'),
        # for: 
        #   - DELETE

    # For students to GET a list of all memberships
	path('memberships/', StudentMembershipView.as_view(), name='student-memberships'),

    # For students to GET membership status for a specific organization
    path('memberships/<uuid:organization_id>/', CheckMembershipView.as_view(), name='organization-memberships'),

    # For students to DELETE membership to a specific organization
	path('membership/student/<uuid:organization_id>/<uuid:student_id>/', MembershipDeleteView.as_view(), name='membership_delete'),

    # For organizations to GET a list of ID, first name and last name of all student users in the application
    path('students/', StudentListView.as_view()),

    # For students to GET a list of ID and org_name of all the organization users in the application
    path('organizations/', OrganizationListView.as_view()),

    # For students to GET organization profile
    path('organizations/<uuid:organization_id>/', OrganizationStudentView.as_view()),

    # For students to GET a list of all the events hosted by all organizations a student user is member of
    path('student/home/', StudentHomePageView.as_view(), name='student-home'),

    # For a student to GET a list of all the events in the application
    path('events/', StudentEventView.as_view()),
    
    # For an organization to GET a list of all the events hosted by that organization
    path('organizations/<uuid:organization_id>/events/', OrganizationEventView.as_view(), name='organization_event_list'),                     
        # for: 
        #   - GET list of all events for a specific organization
        #   - POST for an organization to create a new event

    # For an organization or student to GET information about a specific event
    path('organizations/<uuid:organization_id>/events/<uuid:event_id>/', OrganizationEventView.as_view(), name='organization_event_detail'),
        # for:
        #   - GET for organization or student to get specific information about one event
        #   - PUT for organization to change event details
        #   - DELETE for organization to delete a specific event they are hosting

    # This view returns the list of all tickets bought for a particular event by the members of the organization. 
    path('events/<uuid:event_id>/tickets/', EventTicketsListView.as_view(), name='event-tickets-list'),
        # for:
        # - GET 

    # This view returns the list of all tickets bought by the student user.
    path('student-tickets/', StudentTicketsListView.as_view(), name='student-tickets-list'),
        # for:
        # - GET

    # This view returns the details of a particular ticket bought for an event by a member of the organization
    path('events/<uuid:event_id>/tickets/<uuid:ticket_id>/', EventTicketsDetailView.as_view(), name='event-ticket-detail'),
        # for:
        # - GET

    # For a student to buy a ticket for a specific event
    path('events/<uuid:event_id>/buy/', BuyTicketView.as_view(), name ='buy_tickets')
        # for:
        # - POST 
]