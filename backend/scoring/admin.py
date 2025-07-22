from django.contrib import admin
from .models import Score, Rubric, Judge

@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ('id', 'submission', 'judge', 'rubric', 'score', 'scored_at')
    search_fields = ('submission__title', 'judge__user__username')
    list_filter = ('rubric', 'judge')

@admin.register(Rubric)
class RubricAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'competition', 'max_score')
    search_fields = ('name',)
    list_filter = ('competition',)

@admin.register(Judge)
class JudgeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'expertise')
    search_fields = ('user__username', 'expertise')
