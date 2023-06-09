from django.db import models
import uuid
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
class UserManager(BaseUserManager):
	
	def create_user(self, email, password=None):
		
		if not email:
			raise ValueError('User must have an email address')

		user = self.model(
			email=self.normalize_email(email),
		)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, password):
		
		if password is None:
			raise TypeError('Superuser must have a password.')

		user = self.create_user(email, password)
		user.is_superuser = True
		user.is_staff = True
		user.save()
		return user

	def create_studentuser(self,email,password):
		if password is None:
			raise TypeError('Student must have a password')
		user = self.create_user(email,password)
		user.is_student = True
		user.save()
		return user


	def create_organizationuser(self,email,password):
		if password is None:
			raise TypeError('Organization must have a password')
		user = self.create_user(email,password)
		user.is_organization = True
		user.save()
		return user
		
# Creation of custom user model
class User(AbstractBaseUser, PermissionsMixin):

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	email = models.EmailField(
		verbose_name='email address',
		max_length=255,
		unique=True
	)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)
	is_student = models.BooleanField(default=False)
	is_organization = models.BooleanField(default=False)
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = []

	objects = UserManager()

	def __str__(self):
		return self.email

class Meta:
	db_table = "login"
