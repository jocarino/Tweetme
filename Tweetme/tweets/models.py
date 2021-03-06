import random
from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL

class TweetLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    # The quotes in Tweet are because the Tweet class is bellow
    tweet = models.ForeignKey("Tweet", on_delete=models.CASCADE) 
    timestamp = models.DateTimeField(auto_now_add=True)

class Tweet(models.Model):
    #if reference tweet is deleted, set the foreign key to null
    parent = models.ForeignKey("self", null=True, on_delete=models.SET_NULL)
    #users can have many tweets
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    content = models.TextField(blank=True, null=True)
    #many to many allows to have a list of Users
    likes = models.ManyToManyField(User, related_name='tweet_user', blank=True, through=TweetLike)
    # Image it's a media storage fiels that gets from the database
    image = models.FileField(upload_to='images/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    """
     def __str__(self):
        return self.content
     """

    class Meta:
        #Orders tweets in reverse order accoording to tweet id
        ordering = ['-id']


    @property
    def is_retweet(self):
        #if it has a parent, it means it's a retweet
        return self.parent != None
    
    def serialize(self):
        '''
        Old way of serializing tweets
        '''
        return{
            "id": self.id,
            "content": self.content,
            "likes": random.randint(0,120)
        }
    
