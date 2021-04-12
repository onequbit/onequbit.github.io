
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, request, Response
from datetime import datetime

app = Flask(__name__)

@app.route('/',methods=['GET'])
def root():
    return Response(status=404)

@app.route('/time',methods=['GET'])
def time():
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    return current_time

@app.route('/api/<query>')
def api(query):
    return query