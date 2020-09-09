from django.db import models

class Tweet(models.Model):
    content = models.TextField(blank=True, null=True)
    # Image it's a media storage fiels that gets from the database
    image = models.FileField(upload_to='images/', blank=True, null=True)