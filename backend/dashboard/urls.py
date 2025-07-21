from django.urls import path
from .views import DashboardStatsView, ExportScoresCSV

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('export-scores/', ExportScoresCSV.as_view(), name='export-scores-csv'),
] 