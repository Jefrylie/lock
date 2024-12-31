import requests

url = 'http://localhost:8000/api/v1/upload-image'

token = 'Testing'

files = {'image': open('C:\\Users\\user\\Pictures\\Screenshots\\Screenshot (35).png', 'rb')}

data = {'status': 'pass'}

headers = {
    'Authorization': token
}

response = requests.post(url, headers=headers, files=files, data=data)

print(response.status_code) 
print(response.text) 

files['image'].close()
