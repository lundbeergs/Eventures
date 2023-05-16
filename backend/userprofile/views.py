from django.shortcuts import render

# Create your views here.
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


# Eventsidadiskussion 
#   - när trycker på "events" dyker ALLA events upp, även från organisationer man ej är member av
#           - när klickar på event kommer till eventsidan
#           - om ej member ska buy tickets va gråat och ska stå att måste va member
#   - när trycker på "organizations" dyker ALLA organisationer upp
#           - när klickar på organisation kommer in på orgsida
#           - på orgsida ska finnas knapp BECOME MEMBBER och eventuellt alla organisaionens events under dess profil
#  


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS
    
class StudentEventView(APIView):
    
    # För studenthomepage se alla event
    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

   
        
    # Ska vi göra så att events för en viss org visas för student när klickar på den org? 
    # Kan man isf från frontend bara göra en request till get i OrganizationEventView
    

# OBS ALLA ARGUMENT SOM organization_id, event_id osv MÅSTE FINNAS I URL!!! k
class OrganizationEventView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication] 

    # För att se en orgs events  
    #       - OBS: org_id tas nu från URL!!! Hur kommer det funka om det är en student som gör getrequesten? asså en student som trycker på orgprofilen? organisationens url kommer väl från när man logga in som organisation, studenten har väl ej tilgång till den?????
    #       - samt borde vi inte ha mer "if student/ if org" både här och för ex membershiprequests? asså för säkerhetsaspekten typ :P
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


#This view returns the list of all tickets bought for a particular event by the members of the organization. 
class EventTicketsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = TicketSerializer

    def get_queryset(self):
        event_id = self.kwargs['event_id']
        return Ticket.objects.filter(event_id=event_id)

# This view returns the list of all tickets bought by the logged-in student user.
class StudentTicketsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = TicketSerializer

    def get_queryset(self):
        return Ticket.objects.filter(student_id=self.request.user.student_profile.id)


#This view returns the details of a particular ticket bought for an event by a member of the organization
class EventTicketsDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication] 
    serializer_class = TicketSerializer

    def get_object(self):
        ticket_id = self.kwargs['ticket_id']
        return Ticket.objects.get(id=ticket_id)


# class StudentHomePageView(viewsets.ModelViewSet):
#     serializer_class = EventSerializer
#     permission_classes = (IsAuthenticated)

#     def get_queryset(self):
#         user = self.request.user
#         if user.is_student:
#             student = StudentProfile.objects.get(user.id)
#             organizations = student.member_organizations.all()
#             events = Event.objects.filter(event_org__in=organizations)
#             return events
#         else:
#             organization = user.organization_profile
#             events = organization.event.all()
#             return events


# class StudentHomePageView(generics.ListAPIView):
#     serializer_class = EventSerializer

#     def get_queryset(self):
#         student_profile = self.request.user.student_profile
#         memberships = Membership.objects.filter(student=student_profile)
#         organization_ids = memberships.values_list('organization__id', flat=True)
#         queryset = Event.objects.filter(event_org__id__in=organization_ids, event_release__lte=timezone.now())
#         queryset = queryset.order_by('event_release')
#         return queryset

#DEN HÄR FINKAR!!!!! --------
class StudentHomePageView(APIView):
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

#DENNA OVAN FUNKAR!!!!!!!! ----------

    # def get(self, request, student_id):
    #     student = StudentProfile.objects.get(id=student_id)

    #     events = Event.objects.all()
    #     serializer = EventSerializer(events, many=True)
    #     return Response(serializer.data)

    # @action(detail=True, methods=['get'], url_path='events')
    # def get_events(self, request, student_id):
    #     # Get the student from the request user
    #     student = StudentProfile.objects.get(id=student_id)

    #     # Get all the organizations that the student is a member of
    #     organizations = student.member_organizations.all()
    #     memberships = Membership.objects.filter(
    #         student=request.user.student_profile)

        # # Get all the events related to the organizations that the student is a member of
        # events = Event.objects.filter(event_org__in=organizations)

        # # Serialize the events
        # serializer = EventSerializer(events, many=True)

        # return Response(serializer.data)

class MembershipRequestView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def post(self, request, organization_id, student_id):
        serializer = MembershipRequestSerializer(data=request.data)
        if serializer.is_valid() and request.user.is_student:
            serializer.save(student=request.user.student_profile)               
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Responsible for retreiving the list of membership requests for an organization ('GET')
# and updating the status of a membership request ('PUT)


class OrganizationMembershipRequestsView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get(self, request, organization_id):     
        organization = OrganizationProfile.objects.get(id=organization_id)
        requests = MembershipRequest.objects.filter(organization=organization)
        serializer = MembershipRequestSerializer(requests, many=True)
        return Response(serializer.data)

    def put(self, request, organization_id, student_id):
        # student_id = request.data.get('student_id')
        organization = OrganizationProfile.objects.get(id=organization_id)
        student = StudentProfile.objects.get(id=student_id)

        membership_request = MembershipRequest.objects.filter(
            organization=organization, student=student).first()
        if not membership_request:
            return Response({'detail': 'Membership request does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        #if membership_request.accepted:
        #    return Response({'detail': 'Student is already a member.'}, status=status.HTTP_400_BAD_REQUEST)

        membership_request.accepted = True
        membership_request.save()

        Membership.objects.create(
            organization=organization,
            student=student,
        )
        membership_request.delete()

        return Response({'detail': 'Membership changed to accepted.'})


class StudentMembershipView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        memberships = Membership.objects.filter(
            student=request.user.student_profile)
        serializer = MembershipSerializer(memberships, many=True)
        return Response(serializer.data)


class OrganizationMembershipView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get(self, request, organization_id):
        organization = OrganizationProfile.objects.get(id=organization_id)
        if not organization.org_members.filter(id=request.user.student_profile.id).exists():
            return Response({'detail': 'You are not a member of this organization.'}, status=status.HTTP_400_BAD_REQUEST)

        memberships = Membership.objects.filter(organization=organization)
        serializer = MembershipSerializer(memberships, many=True)
        return Response(serializer.data)

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
    
#För en student att kunna få in fullständig information om Organization profile
class OrganizationStudentView(APIView):
    permission_classes = [IsAuthenticated|ReadOnly]
    authentication_classes = [JWTAuthentication]

    def get(self, request, organization_id):
        organization = OrganizationProfile.objects.get(id=organization_id)
        serializer = OrganizationDetailSerializer(organization)
        return Response(serializer.data, status=status.HTTP_200_OK)


# class OrganizationProfileList(generics.ListAPIView):
#     serializer_class = OrganizationSerializer
#     permission_classes = [IsAuthenticated|ReadOnly]
#     organizations_name = OrganizationProfile.objects.filter().values_list('org_name')

#     def get_queryset(self):
#         organizations_name = OrganizationProfile.objects.filter().values_list('org_name')
#         return organizations_name


# qs = OrganizationProfile.objects.all()
#         org_name = self.request.query_params.get('title')
#         if org_name is not None:
#             qs =  qs.filter(org_name__icontains=org_name)
# 		return qs

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

# class OrganizationViewSet(viewsets.ModelViewSet):
    
# 	queryset = OrganizationProfile.objects.all()
#     serializer_class = OrganizationSerializer
# 	permission_classes = (AllowAny,)
# 	def get_queryset(self):
#     	qs = OrganizationProfile.objects.all()
#         org_name = self.request.query_params.get('title')
#         if org_name is not None:
#             qs =  qs.filter(org_name__icontains=org_name)
# 		return qs


# GAMLA KODER


# class OrganizationMembershipRequestsView(APIView):
#     permission_classes = (IsAuthenticated,)
#     authentication_classes = (JSONWebTokenAuthentication,)

#     def get(self, request, organization_id):
#         organization = OrganizationProfile.objects.get(id=organization_id)
#         requests = MembershipRequest.objects.filter(organization=organization)
#         serializer = MembershipRequestSerializer(requests, many=True)
#         return Response(serializer.data)

#     def put(self, request, organization_id):
#         organization = OrganizationProfile.objects.get(id=organization_id)
#         request_id = request.data.get('request_id')
#         accepted = request.data.get('accepted')
#         membership_request = MembershipRequest.objects.get(id=request_id, organization=organization)
#         if accepted:
#             membership_request.accepted = True
#             membership_request.save()
#             organization.members.add(membership_request.student)
#         else:
#             membership_request.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
