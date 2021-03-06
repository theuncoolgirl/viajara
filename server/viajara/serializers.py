from rest_framework import serializers
from .models import User, Place, List, ListEntry, Photo
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)
        return token


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        # as long as the fields are the same:
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)

        instance.save()

        return instance


class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = ('created_by', 'latitude', 'longitude', 'place_id')


class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('id', 'user_id', 'name', 'description',
                  'created_at', 'updated_at')


class ListEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ListEntry
        fields = ('place_id', 'list_id', 'notes')


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ('id', 'place_id', 'list_entry_id',
                  'created_by', 'img_url', 'description', 'date', 'created_at',
                  'updated_at')
