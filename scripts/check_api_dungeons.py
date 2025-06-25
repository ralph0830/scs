import requests

url = 'http://localhost:3000/api/admin/dungeons'
resp = requests.get(url)
resp.raise_for_status()
for d in resp.json():
    print(d['id'], d['name'], repr(d.get('unlockRequirement')))
