"""
Custom permissions for portfolio API.
"""

from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """
    Only allow authenticated staff/superuser access.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.is_superuser)
        )
