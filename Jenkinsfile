pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'ekinay-ci'
        BACKEND_URL = 'http://localhost:3000'
        FRONTEND_URL = 'http://localhost:8080'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Kod deposu kontrol ediliyor...'
                checkout scm
            }
        }

        stage('Prepare Environment') {
            steps {
                echo 'Jenkins credentials ile .env dosyası oluşturuluyor...'
                withCredentials([
                    string(credentialsId: 'ekinay-mongo-uri', variable: 'MONGO_URI_VALUE'),
                    string(credentialsId: 'ekinay-auto-alert-secret', variable: 'AUTO_ALERT_SECRET_VALUE')
                ]) {
                    sh '''
                        cat > .env <<EOF
MONGO_URI=$MONGO_URI_VALUE
AUTO_ALERT_SECRET=$AUTO_ALERT_SECRET_VALUE
EOF
                    '''
                }
            }
        }

        stage('Backend Install') {
            steps {
                echo 'Backend bağımlılıkları kuruluyor...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Docker image build işlemi başlatılıyor...'
                sh 'docker compose build'
            }
        }

        stage('Docker Compose Down Before Start') {
            steps {
                echo 'Önce eski containerlar kapatılıyor...'
                sh 'docker compose down || true'
            }
        }

        stage('Docker Compose Up') {
            steps {
                echo 'Docker Compose ile servisler ayağa kaldırılıyor...'
                sh 'docker compose up -d'
            }
        }

        stage('Wait For Services') {
            steps {
                echo 'Servislerin açılması bekleniyor...'
                sh 'sleep 25'
            }
        }

        stage('Backend Health Check') {
            steps {
                echo 'Backend health check yapılıyor...'
                sh 'curl -f http://localhost:3000'
            }
        }

        stage('Frontend Health Check') {
            steps {
                echo 'Frontend health check yapılıyor...'
                sh 'curl -f http://localhost:8080'
            }
        }

        stage('Docker Status') {
            steps {
                echo 'Çalışan containerlar listeleniyor...'
                sh 'docker ps'
            }
        }
    }

    post {
        always {
            echo 'Pipeline tamamlandı. Containerlar kapatılıyor...'
            sh 'docker compose down || true'
            sh 'rm -f .env || true'
        }

        success {
            echo 'CI/CD pipeline başarıyla tamamlandı.'
        }

        failure {
            echo 'CI/CD pipeline başarısız oldu.'
        }
    }
}