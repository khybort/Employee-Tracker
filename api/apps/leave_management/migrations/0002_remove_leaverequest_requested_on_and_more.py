# Generated by Django 5.1.3 on 2024-11-27 11:11

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("leave_management", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="leaverequest",
            name="requested_on",
        ),
        migrations.AddField(
            model_name="leaverequest",
            name="created_at",
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
        migrations.AlterField(
            model_name="leaverequest",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending", "Pending"),
                    ("approved", "Approved"),
                    ("rejected", "Rejected"),
                ],
                default="pending",
                max_length=10,
            ),
        ),
    ]
