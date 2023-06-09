import uuid
from django.db import models
from user.models import User

class StudentProfile(models.Model):
	DRINK_CHOICES = (
        ('Beer & White wine', 'Beer & White wine'),
        ('Beer & Red wine', 'Beer & Red wine'),
        ('Cider & White wine', 'Cider & White wine'),
        ('Cider & Red wine', 'Cider & Red wine'),
        ('Non-alcoholic', 'Non-alcoholic')
    )

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
	first_name = models.CharField(max_length=50, unique=False)
	last_name = models.CharField(max_length=50, unique=False)
	allergies = models.TextField(max_length=100, unique=False)
	drinkpref = models.CharField(max_length=50, default='Alkoholfritt', choices=DRINK_CHOICES)


	class Meta:
		db_table = "student_profile"

class OrganizationProfile(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='organization_profile')
	org_name = models.CharField(max_length=50, unique=False)
	org_bio = models.CharField(max_length=1000, unique=False)
	# contact_email = models.EmailField(max_length=254, required = False, help_text ='Contact email')
	# contact_phone = PhoneField(blank=True, null=True, required = False, help_text='Contact phone number')
	# org_icon = models.ImageField(upload_to='org_icons/', blank=True, null=True)
	# org_pic = models.ImageField(upload_to='org_pics/', blank=True, null=True)


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
		db_table = "organization_profile"

	

class Membership(models.Model):
     organization = models.ForeignKey(OrganizationProfile, on_delete=models.CASCADE, related_name='memberships')
     student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='memberships')
     date_joined = models.DateField(auto_now_add=True)
     class Meta:
	     unique_together = ('organization', 'student')


class MembershipRequest(models.Model):
	organization = models.ForeignKey(OrganizationProfile, on_delete=models.CASCADE, related_name='membership_requests')
	student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='membership_requests')
	date_requested = models.DateField(auto_now_add=True)
	accepted = models.BooleanField(default=False)

	class Meta:
		unique_together = ('organization', 'student')

class Event(models.Model):

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)	
	event_name = models.CharField(max_length=50, unique=False)
	event_desc = models.CharField(max_length=1000, unique=False)
	event_price = models.DecimalField(max_digits=1000, decimal_places=2, unique=False)
	event_date = models.DateField(null=True)
	event_time = models.TimeField(auto_now=False, auto_now_add=False, null=True)
	release_date = models.DateField(blank=True, null=True)
	release_time = models.TimeField(auto_now=False, auto_now_add=False, blank=True, null=True)
	event_pic = models.PositiveIntegerField(default=10000)	# event_pic = models.ImageField(upload_to='event_pics/', blank=True, null=True)
	event_org = models.ForeignKey(OrganizationProfile, on_delete=models.CASCADE, related_name='event') 
	event_location = models.CharField(max_length=100, blank=True, unique=False)
	tickets_left = models.PositiveIntegerField(default=10000)

	class Meta:
		db_table = "event"

class Ticket(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tickets')
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='tickets')
    date_bought = models.DateTimeField(auto_now_add=True)