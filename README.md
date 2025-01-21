# User Management App

## Overview
This is a full-stack CRUD application for managing users. It allows users to perform the following operations:

- **Create**: Add new users.
- **Read**: View a list of all users.
- **Update**: Edit details of existing users.
- **Delete**: Remove users.

The backend is built with Node.js, Express, and MongoDB. The frontend is implemented to interact seamlessly with the backend API endpoints.

## Features
- API for managing user data with operations such as GET, POST, PUT, and DELETE.
- MongoDB database to store user information.
- Dockerized deployment for backend and database.
- Jenkins pipeline for CI/CD.

---

## Project Structure
### Backend
- **`server.js`**: Main entry point for the backend server.
- **MongoDB**: Used as the database to store user information.
- **Express**: Used to build the RESTful API endpoints.
- **CORS**: Enabled to allow cross-origin requests.

### Frontend
- React-based frontend for interacting with the backend API. It provides the user interface for CRUD operations.

---

## Backend API Endpoints
### Base URL: `http://localhost:5000`

1. **Get all users**
   - `GET /users`
   - Response: List of all users in the database.

2. **Add a new user**
   - `POST /users`
   - Request body (JSON):
     ```json
     {
       "name": "John Doe",
       "email": "john.doe@example.com",
       "jobTitle": "Developer",
       "age": 30
     }
     ```

3. **Update an existing user**
   - `PUT /users/:id`
   - Request body (JSON):
     ```json
     {
       "name": "Jane Doe",
       "email": "jane.doe@example.com",
       "jobTitle": "Designer",
       "age": 28
     }
     ```

4. **Delete a user**
   - `DELETE /users/:id`
   - Response: Confirmation message upon successful deletion.

---

## Docker Compose Configuration
The project uses Docker Compose to orchestrate the services.

### `docker-compose.yml`
```yaml
version: '3.8'
services:
  mongo:
    image: mongo:latest
    container_name: mongo
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db

  backend:
    build: .
    container_name: backend
    ports:
      - '5000:5000'
    depends_on:
      - mongo
    environment:
      - PORT=5000
      - MONGO_URI=mongodb://mongo:27017/mydb

volumes:
  mongo-data:
```

### Explanation
1. **`mongo` service**:
   - Runs the MongoDB database container.
   - Exposes port `27017` for the database.
   - Persists data in a volume named `mongo-data`.

2. **`backend` service**:
   - Runs the Node.js application.
   - Exposes port `5000`.
   - Connects to the MongoDB service using `MONGO_URI`.

---

## Jenkins CI/CD Pipeline
### Jenkinsfile
```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'docker-compose build'
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test' // Replace with your test commands
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                sh 'docker-compose up -d'
            }
        }
    }
    post {
        always {
            echo 'Cleaning up...'
            sh 'docker-compose down'
        }
    }
}
```

### Explanation
1. **Build Stage**:
   - Builds the Docker images for the backend and MongoDB services.

2. **Test Stage**:
   - Runs tests for the application (modify test command based on your setup).

3. **Deploy Stage**:
   - Deploys the application by bringing up the Docker containers.

4. **Post-Cleanup**:
   - Ensures Docker containers are stopped and removed after the pipeline.

---

## How to Run the App

### Prerequisites
- Node.js and npm
- Docker and Docker Compose
- MongoDB (if running without Docker)
- Jenkins (optional for CI/CD)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the backend API at `http://localhost:5000`.

4. Run the frontend (if applicable) to interact with the API.

5. Access Jenkins and configure the pipeline using the provided `Jenkinsfile`.

---

## Frontend Integration
- The frontend is designed to send HTTP requests to the backend API using `fetch` or `Axios`.
- CRUD operations are mapped to the respective endpoints (`/users` for GET, POST, PUT, DELETE).

---

## Technologies Used
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React (or other frontend frameworks as needed)
- **Containerization**: Docker, Docker Compose
- **CI/CD**: Jenkins

---

## Future Improvements
- Add authentication and authorization.
- Implement better error handling and logging.
- Add frontend testing and backend unit tests.
- Deploy to a cloud provider like AWS, Azure, or DigitalOcean.

---

## License
This project is licensed under the MIT License.

