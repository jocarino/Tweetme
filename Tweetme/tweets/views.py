import random
from django.conf import settings
from django.utils.http import is_safe_url
from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404, JsonResponse

from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Tweet
from .forms import TweetForm
from .serializers import (
    TweetSerializer, 
    TweetActionSerializer,
    TweetCreateSerializer,
)

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

def home_view(request, *args, **kwargs):
    username = None
    if request.user.is_authenticated:
        username = request.user.username
    return render(request, "pages/home.html", context={"username":username}, status=200)

def local_tweets_list_view(request, *args, **kwargs):
    return render(request, "tweets/list.html", context={})

def local_tweets_detail_view(request, tweet_id, *args, **kwargs):
    return render(request, "tweets/detail.html", context={"tweet_id":tweet_id})

def local_tweets_profile_view(request, username, *args, **kwargs):
    return render(request, "tweets/profile.html", context={"profile_username":username})


@api_view(['POST'])#http method of the client == POST
#@authentication_classes([SessionAuthentication, MyCustomAuth])
@permission_classes([IsAuthenticated])
def tweet_create_view(request, *args, **kwargs):
    serializer = TweetCreateSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response({}, status=400)


@api_view(['GET'])
def tweet_detail_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404) #tweet not found
    obj = qs.first()
    serializer = TweetSerializer(obj)
    return Response(serializer.data)

@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def tweet_delete_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404) #tweet not found
    #check if user has permission to delete this tweet
    qs = qs.filter(user=request.user)
    if not qs.exists():
        return Response({"message": "You cannot delete this tweet."}, status=401) #unauthorize
    obj = qs.first()
    obj.delete()
    return Response({"message": "Tweet delete."}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tweet_action_view(request, *args, **kwargs):
    """ 
    id is required
    Action option are: like, unlike and retweet
    """
    serializer = TweetActionSerializer(data=request.data)
    #validate action through the TweetAction serializer
    if serializer.is_valid(raise_exception=True):
        data = serializer.validated_data
        #get serializer data
        tweet_id = data.get("id")
        action = data.get("action")
        content = data.get("content")

        qs = Tweet.objects.filter(id=tweet_id)
        if not qs.exists():
            return Response({}, status=404) #tweet not found
        obj = qs.first()
        if action == "like":
            obj.likes.add(request.user)
            serializer = TweetSerializer(obj)
            return Response(serializer.data, status=200)
        elif action == "unlike":
            obj.likes.remove(request.user)
            serializer = TweetSerializer(obj)
            return Response(serializer.data, status=200)
        elif action == "retweet":
            new_tweet = Tweet.objects.create(
                    user=request.user,
                    parent=obj,
                    content=content)
            serializer = TweetSerializer(new_tweet)
            return Response(serializer.data, status=201)
    return Response({}, status=200)

@api_view(['GET'])
def tweet_list_view(request, *args, **kwargs):
    qs = Tweet.objects.all()
    username= request.GET.get('username') # ?username=Justin
    if username != None:
        qs = qs.filter(user__username__iexact=username)
    serializer = TweetSerializer(qs, many=True)
    return Response(serializer.data)



def tweet_create_view_pure_django(request, *args, **kwargs):
    """ 
    REST API Creat View -< Django Rest Framework
    """
    user = request.user
    if not request.user.is_authenticated:
        user = None
        if request.is_ajax():
            return JsonResponse({}, status=401) # send not authorized request
        return redirect(settings.LOGIN_URL)
    form = TweetForm(request.POST or None)
    #print("ajax", request.is_ajax())
    #now I can use this to redirect to where I want
    #it comes from the POST request from the form
    next_url = request.POST.get("next") or None 

    if form.is_valid():
        obj = form.save(commit=False)

        obj.user = user

        obj.save()
        if request.is_ajax():
            return JsonResponse(obj.serialize(), status=201) #201-created items

        if next != None and is_safe_url(next_url, ALLOWED_HOSTS):
            return redirect(next_url)
        form = TweetForm()
    #handling form error
    if form.errors:
        if request.is_ajax():
            return JsonResponse(form.errors, status=400)
    return render(request, 'components/form.html', context={"form": form})

def tweet_list_view_pure_django(request, *args, **kwargs):
    '''
    REST API VIEW
    Consume by JS or anything else
    returns json data
    '''
    qs = Tweet.objects.all()
    tweet_list = [x.serialize() for x in qs]
    data = {
        "isUser": False,
        "response": tweet_list
    }
    return JsonResponse(data)


def tweet_detail_view_pure_django(request, tweet_id, *args, **kwargs):
    '''
    REST API VIEW
    Consume by JS or anything else
    returns json data
    '''
    data = {
        "id": tweet_id,
    }
    status = 200
    try:
        obj = Tweet.objects.get(id=tweet_id)
        data['content'] = obj.content
 
    except:
        data['message'] = "Not found"
        status = 404


    return JsonResponse(data, status=status) # json.dumps content_type='application/json'