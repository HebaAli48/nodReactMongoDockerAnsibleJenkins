pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'docker-compose -f docker-compose.yml build'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing the application...'
                sh '''
                # Run your backend and frontend tests here
                docker-compose -f docker-compose.yml run backend npm test
                docker-compose -f docker-compose.yml run frontend npm test
                '''
            }
        }
        // stage('Push Docker Images') {
        //     steps {
        //         echo 'Pushing Docker images to Docker Hub...'
        //         sh '''
        //         docker login -u <your_dockerhub_username> -p <your_dockerhub_password>
        //         docker tag backend <your_dockerhub_username>/backend:latest
        //         docker tag frontend <your_dockerhub_username>/frontend:latest
        //         docker push <your_dockerhub_username>/backend:latest
        //         docker push <your_dockerhub_username>/frontend:latest
        //         '''
        //     }
        // }
        stage('Deploy') {
            steps {
                echo 'Deploying to DigitalOcean droplet...'
                sshagent(['digitalocean-ssh-key']) {
                    sh '''
                    # Clone the repository on the droplet and use Ansible for deployment
                    ssh -o StrictHostKeyChecking=no root@<droplet_ip> "git clone https://github.com/your-repo/project.git || (cd project && git pull)"
                    ansible-playbook -i <droplet_ip>, playbook.yml
                    '''
                }
            }
        }
    }
    post {
        always {
            echo 'Cleaning up...'
            sh 'docker-compose -f docker-compose.yml down'
        }
    }
}
