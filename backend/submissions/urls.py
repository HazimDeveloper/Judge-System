from django.urls import path
from .views import ParticipantListCreateView, SubmissionListCreateView, SubmissionDetailView

urlpatterns = [
    path('participants/', ParticipantListCreateView.as_view(), name='participant-list-create'),
    path('submissions/', SubmissionListCreateView.as_view(), name='submission-list-create'),
    path('submissions/<int:pk>/', SubmissionDetailView.as_view(), name='submission-detail'),
] 