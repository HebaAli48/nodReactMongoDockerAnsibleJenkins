pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-credentials'
        SSH_CREDENTIALS = 'digitalocean-ssh-key'
        DROPLET_IP = '164.92.166.224'
        BACKEND_IMAGE = 'hebaali4/backend'
        FRONTEND_IMAGE = 'hebaali4/frontend'
        MONGO_IMAGE = 'hebaali4/mmongo'
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
                        
                        # Tag and push the backend, frontend, and mongo images to Docker Hub
                        docker tag ${BACKEND_IMAGE}:latest ${BACKEND_IMAGE}:latest
                        docker tag ${FRONTEND_IMAGE}:latest ${FRONTEND_IMAGE}:latest
                        docker tag ${MONGO_IMAGE}:latest ${MONGO_IMAGE}:latest

                        docker push ${BACKEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:latest
                        docker push ${MONGO_IMAGE}:latest
                        '''
                    }
                }
            }
        }

      
        stage('Manual Deployment Approval') {
            steps {
                input message: 'The build was successful. Do you want to proceed with the deployment?', ok: 'Proceed'
            }
        }

        stage('Deploy to Droplet') {
            steps {
                script {
                    sshagent([SSH_CREDENTIALS]) {
                        sh '''
                        ssh -o StrictHostKeyChecking=no root@${DROPLET_IP} '
                            docker pull ${BACKEND_IMAGE}:latest
                            docker pull ${FRONTEND_IMAGE}:latest
                            docker pull ${MONGO_IMAGE}:latest
                            cd /root/web-java-devops
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
            sh 'docker-compose down'
        }
    }
}
