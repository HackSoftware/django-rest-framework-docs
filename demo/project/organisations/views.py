from rest_framework import generics, status
from rest_framework.response import Response
from project.organisations.models import Organisation, Membership
from project.organisations.serializers import (
    CreateOrganisationSerializer, OrganisationMembersSerializer, RetrieveOrganisationSerializer
)


class RetrieveOrganisationView(generics.RetrieveAPIView):

    serializer_class = RetrieveOrganisationSerializer

    def post(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class CreateOrganisationView(generics.CreateAPIView):

    serializer_class = CreateOrganisationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class OrganisationMembersView(generics.ListAPIView):

    serializer_class = OrganisationMembersSerializer

    def get_queryset(self):
        organisation = Organisation.objects.order_by('?').first()
        return Membership.objects.filter(organisation=organisation)


class LeaveOrganisationView(generics.DestroyAPIView):

    def get_object(self):
        return Membership.objects.order_by('?').first()

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
