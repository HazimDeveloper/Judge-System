from django.urls import path
from .views import ParticipantListCreateView, SubmissionListCreateView, SubmissionDetailView, CompetitionListCreateView, CompetitionDetailView
 
urlpatterns = [
    path('participants/', ParticipantListCreateView.as_view(), name='participant-list-create'),
    path('', SubmissionListCreateView.as_view(), name='submission-list-create'),
    path('<int:pk>/', SubmissionDetailView.as_view(), name='submission-detail'),
    path('competitions/', CompetitionListCreateView.as_view(), name='competition-list-create'),
    path('competitions/<int:pk>/', CompetitionDetailView.as_view(), name='competition-detail'),
] 