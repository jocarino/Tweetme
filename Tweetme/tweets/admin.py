from django.contrib import admin
from .models import Tweet, TweetLike

class TweetLikeAdmin(admin.TabularInline):
    model = TweetLike


class TweetAdmin(admin.ModelAdmin):
    #inlines adds the tweetlike model to the admin of tweet
    inlines = [TweetLikeAdmin]
    #what to display when doing the look up (the Tweet __str__) can be changed in the model
    list_display = ['__str__', 'user']
    # user__username is user's username and etc
    # look ups like Tweet.objects.filter(user__name/user__id=something)
    search_fields = ['user__username', 'user__email']
    class Meta:
        model = Tweet


admin.site.register(Tweet, TweetAdmin)