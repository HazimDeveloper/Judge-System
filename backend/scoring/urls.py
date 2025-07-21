from django.urls import path
from .views import RubricListCreateView, RubricDetailView, JudgeListView, ScoreListCreateView, ScoreDetailView

urlpatterns = [
    path('rubrics/', RubricListCreateView.as_view(), name='rubric-list-create'),
    path('rubrics/<int:pk>/', RubricDetailView.as_view(), name='rubric-detail'),
    path('judges/', JudgeListView.as_view(), name='judge-list'),
    path('scores/', ScoreListCreateView.as_view(), name='score-list-create'),
    path('scores/<int:pk>/', ScoreDetailView.as_view(), name='score-detail'),
] 