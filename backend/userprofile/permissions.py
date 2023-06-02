from rest_framework import permissions
from userprofile.models import *
from rest_framework.permissions import BasePermission

# This document is not fully developed, the permission classes below are just tests for back-end developers to learn more about permissions in Django 
class IsOrganization(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Check if the user is an organization
        return request.user.is_authenticated and request.user.is_organization

class EventViewPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method == 'GET':
            # Allow any authenticated user to perform GET request
            return request.user.is_authenticated
        
        if request.method == 'POST':
            # Allow only organizations to perform POST request
            return request.user.is_authenticated and request.user.is_organization

        if request.method in ['PUT', 'DELETE']:
            # Allow only organizations that own the event to perform PUT and DELETE requests
            event_id = view.kwargs.get('event_id')
            organization_id = view.kwargs.get('organization_id')
            event = Event.objects.filter(pk=event_id, event_org_id=organization_id).first()
            return request.user.is_authenticated and event and event.event_org.user == request.user

        return False