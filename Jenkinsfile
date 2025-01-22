pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'docker-compose up -d --build'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing the application...'
                sh '''
                # Run your backend and frontend tests here
                docker logs mongo
                docker logs backend
                docker logs frontend
                '''
            }
        }
        stage('Manual Approval') {
            steps {
                input message: 'The build was successful. Do you want to proceed with the deployment?', ok: 'Proceed'
            }
        }
      stage('Deploy') {
             steps {
               echo 'Deploying to DigitalOcean droplet...'
               sshagent(['digitalocean-ssh-key']) {
               sh '''
               # Ensure Ansible is installed and configured
               ansible --version
            
              # Add the host's SSH key to known_hosts
              ssh-keyscan -H 164.92.166.224 >> ~/.ssh/known_hosts
            
              # Run Ansible playbook for deployment
              ansible-playbook -i inventory.ini playbook.yml
              '''
        }
            }
        }

    }
    post {
        always {
            echo 'Cleaning up...'
            // Uncomment the next line if you want to stop and remove Docker containers after the pipeline finishes
            // sh 'docker-compose -f docker-compose.yml down'
        }
    }
}
