from django.contrib import admin
from .models import Submission, Competition, Participant

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'participant', 'competition', 'status', 'submitted_at')
    search_fields = ('title', 'participant__user__username')
    list_filter = ('competition', 'status')

@admin.register(Competition)
class CompetitionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'start_date', 'end_date')
    search_fields = ('name',)
    list_filter = ('start_date', 'end_date')

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'institution', 'phone')
    search_fields = ('user__username', 'institution')
