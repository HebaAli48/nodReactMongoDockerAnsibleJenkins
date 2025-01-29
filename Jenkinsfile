pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-credentials'
        SSH_CREDENTIALS = 'digitalocean-ssh-key'
        DROPLET_IP = '164.92.166.224'
        BACKEND_IMAGE = 'nodreactmongodockeransiblejenkins-backend'
        FRONTEND_IMAGE = 'nodreactmongodockeransiblejenkins-frontend'
        MONGO_IMAGE = 'mongo'
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out code from GitHub...'
                git branch: 'main', url: 'https://github.com/HebaAli48/nodReactMongoDockerAnsibleJenkins.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'docker-compose up -d --build'
                sh 'docker images'  // This will list all locally available Docker images for you to check
            }
        }

        stage('Test') {
            steps {
                echo 'Testing the application...'
                script {
                    // Capture logs into files
                    sh 'docker logs mongo > mongo_logs.txt'
                    sh 'docker logs backend > backend_logs.txt'
                    sh 'docker logs frontend > frontend_logs.txt'

                    // Optionally, you can display logs in the Jenkins console for review
                    echo 'Mongo Logs:'
                    sh 'cat mongo_logs.txt'
                    echo 'Backend Logs:'
                    sh 'cat backend_logs.txt'
                    echo 'Frontend Logs:'
                    sh 'cat frontend_logs.txt'

                    // Optionally, archive logs as artifacts
                    archiveArtifacts artifacts: '*.txt', allowEmptyArchive: true
                }
            }
        }

        stage('Manual DockerHub pushed Approval') {
            steps {
                input message: 'The build was successful. Do you want to proceed with the deployment?', ok: 'Proceed'
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CREDENTIALS, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''
                        echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin
                        
                        # Tag the images with the correct names
                        docker tag ${BACKEND_IMAGE}:latest hebaali4/backend:latest
                        docker tag ${FRONTEND_IMAGE}:latest hebaali4/frontend:latest
                        docker tag ${MONGO_IMAGE}:latest hebaali4/mongo:latest

                        # Push the tagged images to Docker Hub
                        docker push hebaali4/backend:latest
                        docker push hebaali4/frontend:latest
                        docker push hebaali4/mongo:latest
                        '''
                    }
                }
            }
        }

        stage('Manual Deployment Approval') {
            steps {
                input message: 'The images have been pushed to DockerHub. Do you want to proceed with the deployment?', ok: 'Proceed'
            }
        }

        stage('Deploy to Droplet') {
        steps {
            script {
                sshagent([SSH_CREDENTIALS]) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no root@${DROPLET_IP} '
                        # Install Docker Compose if not already installed
                        if ! command -v docker-compose &> /dev/null; then
                            echo "Docker Compose not found. Installing..."
                            sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r .tag_name)/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
                            sudo chmod +x /usr/local/bin/docker-compose
                        fi
                        
                        # Login to Docker Hub (replace with actual Docker Hub credentials)
                        echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin
                        
                        # Pull latest images
                        docker pull hebaali4/backend:latest
                        docker pull hebaali4/frontend:latest
                        docker pull hebaali4/mongo:latest
                        
                        # Change to the application directory and manage Docker containers
                        cd /root/web-java-devops || exit 1
                        docker-compose down
                        docker-compose up -d
                    '
                    '''
                }
            }
        }
}

    }
    
    post {
        always {
            echo 'Cleaning up...'
            sh 'docker-compose down'  // This cleans up any running containers
        }
    }
}
