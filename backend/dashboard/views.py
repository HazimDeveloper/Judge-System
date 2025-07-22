from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from users.models import User
from submissions.models import Participant, Submission
from scoring.models import Score
from rest_framework import status
from django.db import models
from django.http import HttpResponse
import csv
from django.db.models.functions import TruncWeek
from datetime import datetime, timedelta

# Create your views here.

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Only admin and committee can access
        if user.role not in [User.Role.ADMIN, User.Role.COMMITTEE]:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)

        total_participants = Participant.objects.count()
        total_submissions = Submission.objects.count()
        total_scores = Score.objects.count()
        avg_score = Score.objects.all().aggregate(avg=models.Avg('score'))['avg']
        judge_activity = Score.objects.values('judge__user__username').annotate(count=models.Count('id')).order_by('-count')

        # Weekly submissions for the last 8 weeks
        today = datetime.today()
        eight_weeks_ago = today - timedelta(weeks=8)
        weekly_submissions = (
            Submission.objects
            .filter(submitted_at__gte=eight_weeks_ago)
            .annotate(week=TruncWeek('submitted_at'))
            .values('week')
            .annotate(count=models.Count('id'))
            .order_by('week')
        )
        weekly_data = [
            {"week": ws["week"].strftime("%Y-%m-%d"), "count": ws["count"]}
            for ws in weekly_submissions
        ]

        return Response({
            'total_participants': total_participants,
            'total_submissions': total_submissions,
            'total_scores': total_scores,
            'average_score': avg_score,
            'judge_activity': list(judge_activity),
            'weekly_submissions': weekly_data,
        })

class ExportScoresCSV(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="scores_report.csv"'
        writer = csv.writer(response)
        writer.writerow(['Submission', 'Judge', 'Rubric', 'Score', 'Comment', 'Scored At'])
        from scoring.models import Score
        for score in Score.objects.select_related('submission', 'judge__user', 'rubric').all():
            writer.writerow([
                score.submission.title,
                score.judge.user.username,
                score.rubric.name,
                score.score,
                score.comment,
                score.scored_at.strftime('%Y-%m-%d %H:%M'),
            ])
        return response
