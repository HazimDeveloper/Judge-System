from django.core.management.base import BaseCommand
from users.models import User
from submissions.models import Participant, Submission, Competition
from scoring.models import Judge, Rubric, Score
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Generate realistic Malaysian demo data for all user roles, competitions, submissions, rubrics, and scores.'

    def handle(self, *args, **options):
        # Create Competitions
        comp1, _ = Competition.objects.get_or_create(
            name='Pertandingan Inovasi IPTA 2025',
            defaults={
                'description': 'Pertandingan inovasi peringkat universiti awam Malaysia.',
                'start_date': '2025-08-01',
                'end_date': '2025-08-03',
            }
        )
        comp2, _ = Competition.objects.get_or_create(
            name='MyHackathon Malaysia',
            defaults={
                'description': 'Hackathon inovasi digital untuk rakyat Malaysia.',
                'start_date': '2025-09-10',
                'end_date': '2025-09-12',
            }
        )
        competitions = [comp1, comp2]

        # Create Admin
        admin, _ = User.objects.get_or_create(username='admin', defaults={
            'email': 'admin@mohe.gov.my',
            'role': User.Role.ADMIN,
            'is_staff': True,
            'is_superuser': True
        })
        admin.set_password('admin123')
        admin.save()

        # Create Committee
        committee, _ = User.objects.get_or_create(username='komiti', defaults={
            'email': 'komiti@mohe.gov.my',
            'role': User.Role.COMMITTEE
        })
        committee.set_password('komiti123')
        committee.save()

        # Create Judges
        judge_names = [
            ('Dr. Ahmad Zaki', 'ahmad.zaki@utm.my'),
            ('Prof. Noraini', 'noraini@um.edu.my'),
            ('Ir. Lim Wei', 'lim.wei@usm.my'),
        ]
        judges = []
        for i, (name, email) in enumerate(judge_names, 1):
            username = f'juri{i}'
            judge, _ = User.objects.get_or_create(username=username, defaults={
                'email': email,
                'role': User.Role.JUDGE,
                'first_name': name.split()[0],
                'last_name': ' '.join(name.split()[1:])
            })
            judge.set_password(f'juri{i}123')
            judge.save()
            judge_profile, _ = Judge.objects.get_or_create(user=judge, defaults={'expertise': f'Bidang {i}'})
            judge_profile.competitions.set(competitions)
            judges.append(judge_profile)

        # Create Participants
        participant_data = [
            ('Ali Bin Abu', 'ali.abu@ukm.edu.my', 'Universiti Kebangsaan Malaysia'),
            ('Siti Nur Aisyah', 'aisyah@upm.edu.my', 'Universiti Putra Malaysia'),
            ('Tan Mei Ling', 'meiling@um.edu.my', 'Universiti Malaya'),
            ('Muhammad Hafiz', 'hafiz@utm.my', 'Universiti Teknologi Malaysia'),
            ('Raj Kumar', 'raj.kumar@usm.my', 'Universiti Sains Malaysia'),
        ]
        participants = []
        for i, (name, email, institution) in enumerate(participant_data, 1):
            username = f'peserta{i}'
            user, _ = User.objects.get_or_create(username=username, defaults={
                'email': email,
                'role': User.Role.PARTICIPANT,
                'first_name': name.split()[0],
                'last_name': ' '.join(name.split()[1:])
            })
            user.set_password(f'peserta{i}123')
            user.save()
            participant, _ = Participant.objects.get_or_create(user=user, defaults={
                'institution': institution,
                'phone': f'01{random.randint(10000000,99999999)}'
            })
            participant.competitions.set(competitions)
            participants.append(participant)

        # Create Rubrics for each competition
        rubric_titles = ['Kreativiti', 'Impak Sosial', 'Teknologi', 'Kebolehpasaran']
        rubrics = []
        for comp in competitions:
            for title in rubric_titles:
                rubric, _ = Rubric.objects.get_or_create(
                    competition=comp,
                    name=title,
                    defaults={
                        'description': f'Penilaian {title.lower()} untuk {comp.name}',
                        'max_score': 100
                    }
                )
                rubrics.append(rubric)

        # Create Submissions for each participant in each competition
        submissions = []
        for participant in participants:
            for comp in competitions:
                submission, _ = Submission.objects.get_or_create(
                    participant=participant,
                    competition=comp,
                    title=f'Projek Inovasi {participant.user.first_name}',
                    defaults={
                        'description': f'Projek inovasi oleh {participant.user.first_name} untuk {comp.name}.',
                        'status': 'pending',
                        'submitted_at': timezone.now()
                    }
                )
                submissions.append(submission)

        # Create Scores for each submission by each judge and rubric
        for submission in submissions:
            comp = submission.competition
            comp_rubrics = [r for r in rubrics if r.competition == comp]
            for judge in judges:
                for rubric in comp_rubrics:
                    score_val = random.randint(60, 100)
                    comment = f'Penilaian {rubric.name} untuk projek {submission.title}.'
                    Score.objects.get_or_create(
                        competition=comp,
                        submission=submission,
                        judge=judge,
                        rubric=rubric,
                        defaults={
                            'score': score_val,
                            'comment': comment,
                            'scored_at': timezone.now()
                        }
                    )

        self.stdout.write(self.style.SUCCESS('Demo data generated (Malaysia):'))
        self.stdout.write(self.style.SUCCESS('Admin: admin/admin123'))
        self.stdout.write(self.style.SUCCESS('Committee: komiti/komiti123'))
        for i, (name, _, _) in enumerate(participant_data, 1):
            self.stdout.write(self.style.SUCCESS(f'Participant: peserta{i}/peserta{i}123 ({name})'))
        for i, (name, _) in enumerate(judge_names, 1):
            self.stdout.write(self.style.SUCCESS(f'Judge: juri{i}/juri{i}123 ({name})'))
        for comp in competitions:
            self.stdout.write(self.style.SUCCESS(f'Competition: {comp.name}')) 