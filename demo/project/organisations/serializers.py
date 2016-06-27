from rest_framework import serializers
from project.organisations.models import Organisation, Membership
from project.accounts.serializers import UserProfileSerializer
from project.accounts.models import User


class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ('joined', 'is_owner', 'role')


class CreateOrganisationSerializer(serializers.ModelSerializer):
    membership_set = MembershipSerializer()

    class Meta:
        model = Organisation
        fields = ('name', 'slug', 'is_active', 'membership_set')

    def create(self, validated_data):
        org = Organisation.objects.create(name=validated_data['name'])
        user = None

        try:
            user = User.objects.filter(email='admin@admin.com').first()
        except:
            user = User.objects.create(email="admin@admin.com",
                                       password='samplepassword')

        data = validated_data['membership_set']
        Membership.objects.create(user=user,
                                  organisation=org,
                                  **data)
        return org


class OrganisationMembersSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Membership
        fields = ('joined', 'user', 'is_owner', 'role')

    def get_user(self, obj):
        serializer = UserProfileSerializer(obj.user)
        return serializer.data


class OrganisationDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organisation
        fields = ('name', 'slug', 'is_active')


class RetrieveOrganisationSerializer(serializers.ModelSerializer):
    membership_set = MembershipSerializer()

    class Meta:
        model = Organisation
        fields = ('name', 'slug', 'is_active', 'membership_set')
