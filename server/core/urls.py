from django.urls import path
from . import views
from .views import DeleteUserView

urlpatterns = [
    path('login', views.login),
    path('register', views.register),
    path('profile', views.profile),
    path('logout', views.logout),
    path('users', views.list_users),
    path('users/<int:pk>/', DeleteUserView.as_view(), name='delete_user')
]
