from django.contrib import admin
from userprofile.models import *

# Register your models here.

admin.site.register(StudentProfile)
    
	


class MembershipInline(admin.TabularInline):
    model = Membership

class MembershipRequestInline(admin.TabularInline):
    model = MembershipRequest

class OrganizationProfileAdmin(admin.ModelAdmin):
    inlines = [MembershipInline]
    inlines = [MembershipRequestInline]

admin.site.register(OrganizationProfile, OrganizationProfileAdmin)
admin.site.register(Membership)
admin.site.register(MembershipRequest)
admin.site.register(Event)