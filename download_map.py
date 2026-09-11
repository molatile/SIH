import urllib.request
import json

url = "https://raw.githubusercontent.com/adarshbiradar/maps-geojson/master/india.json"
response = urllib.request.urlopen(url)
data = json.loads(response.read())

with open('public/india-states.json', 'w', encoding='utf-8') as f:
    json.dump(data, f)
print("Downloaded successfully!")
