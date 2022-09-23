## Installation and Running Locally
```
    docker-compose build
    docker-compose up
```
## Admin Credentials
```
    - Email: admin@admin.com
    - Password: password 
```

## Test API
1. Import file Deall.postman_collection.json to postman.
2. Authenticate User Admin and Get Access Token http://localhost:8000/api/users/auth/
3. Add Access Token to Authentication Header for accesing the API.
```
    Endpoints:
        - POST   : http://localhost:8000/api/users/refresh-token/
        - GET    : http://localhost:8000/api/users/
        - POST   : http://localhost:8000/api/users/register/
        - POST   : http://localhost:8000/api/users/me/
        - GET    : http://localhost:8000/api/users/:id
        - PUT    : http://localhost:8000/api/users/:id
        - DELETE : http://localhost:8000/api/users/:id
```
## API DIAGRAM
API Diagram Flow : flow_api.jpeg
