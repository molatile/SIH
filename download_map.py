import urllib.request
import json

url = "https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States"
response = urllib.request.urlopen(url)
data = json.loads(response.read())

with open('public/india-states.json', 'w', encoding='utf-8') as f:
    json.dump(data, f)
print("Downloaded successfully!")
