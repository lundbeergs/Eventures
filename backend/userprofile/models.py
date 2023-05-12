import uuid
from django.db import models
from user.models import User

class StudentProfile(models.Model):

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
	first_name = models.CharField(max_length=50, unique=False)
	last_name = models.CharField(max_length=50, unique=False)
	allergies = models.TextField(max_length=100, unique=False)


	class Meta:
		'''
		to set table name in database
		'''
		db_table = "student_profile"

class OrganizationProfile(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='organization_profile')
	org_name = models.CharField(max_length=50, unique=False)
	org_bio = models.CharField(max_length=50, unique=False)
	# contact_email = models.EmailField(max_length=254, required = False, help_text ='Contact email')
	# contact_phone = PhoneField(blank=True, null=True, required = False, help_text='Contact phone number')
	
	#org_icon = models.ImageField(upload_to='org_icons/', blank=True, null=True)
	#org_pic = models.ImageField(upload_to='org_pics/', blank=True, null=True)

	# org_events behövs ej? kan ju nå sina events genom att göra detta i views: 
	# 		requested_events = Event.objects.filter(event_org=organization) 


	org_members = models.ManyToManyField(
        StudentProfile,
        through='Membership',
        through_fields=('organization', 'student'),
		related_name = 'member_organizations'
    )

	org_memberrequests = models.ManyToManyField(
        StudentProfile,
        through='MembershipRequest',
        through_fields=('organization', 'student'),
		related_name = 'membership_requested_organizations',
    )

	class Meta:
		'''
		to set table name in database
		'''
		db_table = "organization_profile"

	

class Membership(models.Model):
     organization = models.ForeignKey(OrganizationProfile, on_delete=models.CASCADE, related_name='memberships')
     student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='memberships')
     date_joined = models.DateField(auto_now_add=True)


	# Kanske ta med!!!!
	# class Meta: 
	# 	unique_together = ['organization', 'student']


class MembershipRequest(models.Model):
	organization = models.ForeignKey(OrganizationProfile, on_delete=models.CASCADE, related_name='membership_requests')
	student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='membership_requests')
	date_requested = models.DateField(auto_now_add=True)
	accepted = models.BooleanField(default=False)

	# Kanske ta med!!!!
	# class Meta: 
	# 	unique_together = ['organization', 'student']

class Event(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)	
	event_name = models.CharField(max_length=50, unique=False)
	event_desc = models.CharField(max_length=200, unique=False)
	event_price = models.DecimalField(max_digits=1000, decimal_places=2, unique=False)
	event_date = models.DateField(null=True)
	event_time = models.TimeField(auto_now=False, auto_now_add=False, null=True)
	release_date = models.DateField(blank=True, null=True)
	release_time = models.TimeField(auto_now=False, auto_now_add=False, blank=True, null=True)
	# event_pic = models.ImageField(upload_to='event_pics/', blank=True, null=True)
	event_org = models.ForeignKey(OrganizationProfile, on_delete=models.CASCADE, related_name='event') 
	tickets_left = models.CharField(max_length=4)
	# event_org_members är det inte bättre om medlemmar kollas genom eve t_org ist? 

	# @property							# FÖR FRONTEND gör såhär: <img src="{{ event.org_icon.url }}" alt="Organization Icon">
	# def org_icon(self):
	# 	return self.event_org.org_icon 


	class Meta:
		'''
		to set table name in database
		'''
		db_table = "event"

class Ticket(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tickets')
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='tickets')
    date_bought = models.DateTimeField(auto_now_add=True)

    



