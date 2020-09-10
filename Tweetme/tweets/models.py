import random
from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL

class Tweet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) #many users can have many tweets
    content = models.TextField(blank=True, null=True)
    # Image it's a media storage fiels that gets from the database
    image = models.FileField(upload_to='images/', blank=True, null=True)
    """
     def __str__(self):
        return self.content
     """

    class Meta:
        #Orders tweets in reverse order accoording to tweet id
        ordering = ['-id']

    def serialize(self):
        return{
            "id": self.id,
            "content": self.content,
            "likes": random.randint(0,120)
        }