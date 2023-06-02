from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS, BasePermission
from rest_framework.views import APIView
from user.serializers import *
from userprofile.models import *
from user.models import User
from rest_framework.permissions import AllowAny
from rest_framework import generics
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from rest_framework import permissions
from userprofile.permissions import *
class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS
    
class StudentEventView(APIView):

    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# OBS ALLA ARGUMENT SOM organization_id, event_id osv MÅSTE FINNAS I URL!!! 
class OrganizationEventView(APIView):
    permission_classes = (IsAuthenticated, EventViewPermission)
    authentication_classes = [JWTAuthentication] 

    # För att se en orgs events  
    def get(self, request, organization_id):    
        events = Event.objects.filter(event_org=organization_id)
        serialized_events = EventSerializer(events, many=True)
        return Response(serialized_events.data)
       
    # För att ändra events
    def put(self, request, organization_id, event_id):
        try:
            event = Event.objects.get(pk=event_id, event_org_id=organization_id)
        except Event.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # För att lägga till nya
    def post(self, request, organization_id):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(event_org_id=organization_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # för att ta bort event
    def delete(self, request, organization_id, event_id):
        try:
            event = Event.objects.get(pk=event_id, event_org_id=organization_id)
        except Event.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class BuyTicketView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication] 
    def post(self, request, event_id):
        try:
        # retrieve the event
            event = Event.objects.get(pk=event_id)
            # check if there are available tickets
            if event.tickets_left <= 0:
                return Response({'error': 'No more tickets available for this event.'}, status=status.HTTP_400_BAD_REQUEST)
        # retrieve the student profile of the user
            student_profile = request.user.student_profile
        # create a new ticket
            ticket = Ticket.objects.create(event=event, student=student_profile)
        # decrement the number of available tickets for the event
            event.tickets_left -= 1
            event.save()
        # return the created ticket
            serializer = TicketSerializer(ticket)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# This view returns the list of all tickets bought for a particular event by the members of the organization. 
class EventTicketsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = TicketSerializer

    def get_queryset(self):
        event_id = self.kwargs['event_id']
        return Ticket.objects.filter(event_id=event_id)

# This view returns the list of all tickets bought by the student user.
class StudentTicketsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = TicketSerializer

    def get_queryset(self):
        return Ticket.objects.filter(student_id=self.request.user.student_profile.id)


# This view returns the details of a particular ticket bought for an event by a member of the organization
class EventTicketsDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication] 
    serializer_class = TicketSerializer

    def get_object(self):
        ticket_id = self.kwargs['ticket_id']
        return Ticket.objects.get(id=ticket_id)

class StudentHomePageView(APIView):
     permission_classes = [IsAuthenticated]
     authentication_classes = [JWTAuthentication] 

     def get(self, request):
         # Get the current user
         user = request.user
        
         # Get the student profile of the current user
         student_profile = StudentProfile.objects.get(user=user)
        
         # Get all organizations that the student is a member of
         organizations = student_profile.member_organizations.all()
        
         # Get all events associated with each organization that the student is a member of
         events = []
         for organization in organizations:
             organization_events = organization.event.all()
             events += list(organization_events)
        
         # Serialize the events and return the response
         serializer = EventSerializer(events, many=True)
         return Response(serializer.data)


# Responsible for retreiving the list of membership requests for an organization ('GET')
# and updating the status of a membership request ('PUT')
class MembershipRequestView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def post(self, request, organization_id, student_id):
        serializer = MembershipRequestSerializer(data=request.data)
        if serializer.is_valid() and request.user.is_student:
            serializer.save(student=request.user.student_profile)               
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, student_id):
        student = StudentProfile.objects.get(id=student_id)
        requests = MembershipRequest.objects.filter(student=student)
        serializer = MembershipRequestSerializer(requests, many=True)
        return Response(serializer.data)


class OrganizationMembershipRequestsView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get(self, request, organization_id):     
        organization = OrganizationProfile.objects.get(id=organization_id)
        requests = MembershipRequest.objects.filter(organization=organization)
        serializer = MembershipRequestSerializer(requests, many=True)
        return Response(serializer.data)

    def put(self, request, organization_id, student_id):
        organization = OrganizationProfile.objects.get(id=organization_id)
        student = StudentProfile.objects.get(id=student_id)

        membership_request = MembershipRequest.objects.filter(
            organization=organization, student=student).first()
        if not membership_request:
            return Response({'detail': 'Membership request does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        membership_request.accepted = True
        membership_request.save()

        Membership.objects.create(
            organization=organization,
            student=student,
        )
        membership_request.delete()

        return Response({'detail': 'Membership changed to accepted.'})

    def delete(self, request, organization_id, student_id):
        organization = OrganizationProfile.objects.get(id=organization_id)
        student = StudentProfile.objects.get(id=student_id)

        membership_request = MembershipRequest.objects.filter(
            organization=organization, student=student).first()
        if not membership_request:
            return Response({'detail': 'Membership request does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        membership_request.delete()

        return Response({'detail': 'Membership request deleted.'})
    
class OrganizationMembershipView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get(self, request, organization_id):     
        organization = OrganizationProfile.objects.get(id=organization_id)
        memberships = Membership.objects.filter(organization=organization)
        serializer = MembershipSerializer(memberships, many=True)
        return Response(serializer.data)

    def delete(self, request, organization_id, student_id):
        organization = OrganizationProfile.objects.get(id=organization_id)
        student = StudentProfile.objects.get(id=student_id)

        membership = Membership.objects.filter(
            organization=organization, student=student).first()
        if not membership:
            return Response({'detail': 'Membership does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        membership.delete()

        return Response({'detail': 'Membership deleted.'})

# For student to see what memberships they have.
class StudentMembershipView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        memberships = Membership.objects.filter(
            student=request.user.student_profile)
        serializer = MembershipSerializer(memberships, many=True)
        return Response(serializer.data)
    
# For the student to check weather the student is a member of this organization or not.
class CheckMembershipView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get(self, request, organization_id):
        organization = OrganizationProfile.objects.get(id=organization_id)
        if not organization.org_members.filter(id=request.user.student_profile.id).exists():
            return Response({'detail': 'You are not a member of this organization.'}, status=status.HTTP_400_BAD_REQUEST)

        memberships = Membership.objects.filter(organization=organization)
        serializer = MembershipSerializer(memberships, many=True)
        return Response(serializer.data)


# Allows a student user to delete their membership.
class MembershipDeleteView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def delete(self, request, organization_id, student_id):
        organization = OrganizationProfile.objects.get(id=organization_id)
        student = StudentProfile.objects.get(id=student_id)

        membership = Membership.objects.filter(
            organization=organization, student=student).first()
        if not membership:
            return Response({'detail': 'Membership does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the requesting user is an authorized member of the organization
        if not organization.org_members.filter(id=request.user.student_profile.id).exists():
            return Response({'detail': 'You are not authorized to delete this membership.'}, status=status.HTTP_403_FORBIDDEN)

        membership.delete()

        return Response({'detail': 'Membership deleted.'})


class OrganizationListView(APIView):
    permission_classes = [IsAuthenticated|ReadOnly]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        organizations = OrganizationProfile.objects.all()
        serializer = OrganizationListSerializer(organizations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class StudentListView(APIView):
    permission_classes = [IsAuthenticated|ReadOnly]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        students = StudentProfile.objects.all()
        serializer = StudentListSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# For a student to see all the information about an organization profile
class OrganizationStudentView(APIView):
    permission_classes = [IsAuthenticated|ReadOnly]
    authentication_classes = [JWTAuthentication]

    def get(self, request, organization_id):
        organization = OrganizationProfile.objects.get(id=organization_id)
        serializer = OrganizationDetailSerializer(organization)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Currently not used in the front-end
class DrinkPrefView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            student_profile = StudentProfile.objects.get(user=request.user)
            drink_pref = student_profile.drinkpref
            response_data = {'drink_pref': drink_pref}
            return Response(response_data)
        except StudentProfile.DoesNotExist:
            response_data = {'error': 'Student profile not found.'}
            return Response(response_data, status=404)

# UserProfileView is inspired by: 
'''
***************************************************************************************/
*    Title: JWT-MultiUser-Authentication-API
*    Author: 19mddil
*    Date: 2020
*    Availability: https://github.com/19mddil/JWT-MultiUser-Authentication-API.git
*
***************************************************************************************/
[Source code]. https://github.com/19mddil/JWT-MultiUser-Authentication-API.git
'''
class UserProfileView(RetrieveAPIView):

    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            if request.user.is_student == True:
                user_profile = StudentProfile.objects.get(user=request.user)
                status_code = status.HTTP_200_OK
                response = {
                    'success': 'true',
                    'status code': status_code,
                    'message': 'Student profile fetched successfully',
                    'data': [{
                        'id': user_profile.id,
                        'first_name': user_profile.first_name,
                        'last_name': user_profile.last_name,
                        'allergies': user_profile.allergies,
                        'drinkpref': user_profile.drinkpref,
                    }]
                }
            if request.user.is_organization == True:
                user_profile = OrganizationProfile.objects.get(
                    user=request.user)
                status_code = status.HTTP_200_OK
                response = {
                    'success': 'true',
                    'status code': status_code,
                    'message': 'Organization profile fetched successfully',
                    'data': [{
                        'id': user_profile.id,
                        'org_name': user_profile.org_name,
                        'org_bio': user_profile.org_bio,
                    }]
                }
            if request.user.is_superuser == True:
                userprofile = User.objects.get(user=request.user)
                status_code = status.HTTP_200_OK
                response = {
                    'success': 'true',
                    'status code': status_code,
                    'message': 'Admin profile fetched successfully',
                    'data': [{
                        'email': user_profile.email,
                    }]
                }

        except Exception as e:
            status_code = status.HTTP_400_BAD_REQUEST
            response = {
                'success': 'false',
                'status code': status.HTTP_400_BAD_REQUEST,
                'message': 'User does not exists',
                'error': str(e)
            }
        return Response(response, status=status_code)
    def put(self, request):
        try:
            if request.user.is_student == True:
                user_profile = StudentProfile.objects.get(user=request.user)
                serializer = StudentSerializer(user_profile, data=request.data)
            elif request.user.is_organization == True:
                user_profile = OrganizationProfile.objects.get(user=request.user)
                serializer = OrganizationSerializer(user_profile, data=request.data)
            else:
                raise Exception('User is not a student or organization')
            
            if serializer.is_valid():
                serializer.save()
                status_code = status.HTTP_200_OK
                response = {
                    'success': 'true',
                    'status code': status_code,
                    'message': 'User profile updated successfully'
                }
            else:
                status_code = status.HTTP_400_BAD_REQUEST
                response = {
                    'success': 'false',
                    'status code': status.HTTP_400_BAD_REQUEST,
                    'message': 'Validation error',
                    'error': serializer.errors
                }
        except Exception as e:
            status_code = status.HTTP_400_BAD_REQUEST
            response = {
                'success': 'false',
                'status code': status.HTTP_400_BAD_REQUEST,
                'message': 'User does not exist or invalid request',
                'error': str(e)
            }
        return Response(response, status=status_code)