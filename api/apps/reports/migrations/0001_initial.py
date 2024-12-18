# Generated by Django 5.1.3 on 2024-11-25 22:34

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="MonthlyReport",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("month", models.DateField()),
                ("total_hours_worked", models.FloatField()),
                ("late_minutes", models.IntegerField(default=0)),
                ("overtime_hours", models.FloatField(default=0.0)),
                ("remaining_leave_days", models.FloatField()),
                (
                    "employee",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="monthly_reports",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
