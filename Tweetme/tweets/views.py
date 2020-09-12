import random
from django.conf import settings
from django.utils.http import is_safe_url
from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404, JsonResponse

from .models import Tweet
from .forms import TweetForm
from .serializers import TweetSerializer

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

def home_view(request, *args, **kwargs):
    #return HttpResponse("<h1> Hello World </h1>")
    return render(request, "pages/home.html", context={}, status=200)

def tweet_create_view(request, *args, **kwargs):
    serializer = TweetSerializer(data=request.POST or None)
    if serializer.is_valid():
        serializer.save()
    return JsonResponse({}, status=400)

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

def tweet_list_view(request, *args, **kwargs):
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


def tweet_detail_view(request, tweet_id, *args, **kwargs):
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