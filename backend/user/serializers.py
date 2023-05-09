from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from userprofile.models import *
from user.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken


JWT_PAYLOAD_HANDLER = api_settings.JWT_PAYLOAD_HANDLER
JWT_ENCODE_HANDLER = api_settings.JWT_ENCODE_HANDLER


class MembershipRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipRequest
        fields = '__all__'

class MembershipSerializer(serializers.ModelSerializer):

    class Meta: 
        model = Membership
        fields = '__all__'


class StudentSerializer(serializers.ModelSerializer):
    # membership_requests = MembershipRequestSerializer(many=True, read_only=True, required=False)
    # memberships = MembershipSerializer(many = True, read_only =True, required=False)
    class Meta:
        model = StudentProfile
        fields = ('id','first_name', 'last_name', 'allergies')

class OrganizationSerializer(serializers.ModelSerializer):
    org_members = MembershipSerializer(many = True, read_only =True, required=False)
    org_memberrequests = MembershipRequestSerializer(many=True, read_only=True, required=False)
    class Meta:
        model = OrganizationProfile
        fields = ('id', 'org_name', 'org_bio', 'org_members', 'org_memberrequests')


class OrganizationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationProfile
        fields = ['id', 'org_name']

class OrganizationDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrganizationProfile
        fields = ('id', 'org_name', 'org_bio')


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__' 

class OrganizationRegistrationSerializer(serializers.ModelSerializer):

    profile = OrganizationSerializer(required=False)

    class Meta:
        model = User
        fields = ('email', 'password', 'profile')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create_organizationuser(**validated_data)
        OrganizationProfile.objects.create(
            user=user,
            org_name=profile_data['org_name'],
            org_bio=profile_data['org_bio']
        )
        return user

class StudentRegistrationSerializer(serializers.ModelSerializer):

    profile = StudentSerializer(required=False)

    class Meta:
        model = User
        fields = ('email', 'password', 'profile')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create_studentuser(**validated_data)
        StudentProfile.objects.create(
            user=user,
            first_name=profile_data['first_name'],
            last_name=profile_data['last_name'],
            allergies=profile_data['allergies']
        )
        return user

class UserLoginSerializer(TokenObtainPairSerializer):

    email = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    access_token = serializers.CharField(max_length=255, read_only=True)
    refresh_token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        email = data.get("email", None)
        password = data.get("password", None)
        user = authenticate(request=self.context.get('request'), email=email, password=password)
        if not user:
            raise serializers.ValidationError('Invalid email or password')
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')
        refresh_token = RefreshToken.for_user(user)
        return {
            'email': user.email,
            'access': str(refresh_token.access_token),
            'refresh': str(refresh_token),
        }
