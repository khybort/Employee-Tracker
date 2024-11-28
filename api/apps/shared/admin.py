from django.contrib import admin

from apps.shared.models import Holiday


@admin.register(Holiday)
class HolidayAdmin(admin.ModelAdmin):
    list_display = ("name", "date")
    search_fields = ("name",)
