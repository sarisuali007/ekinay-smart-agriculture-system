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

        stage('Backend Install') {
            steps {
                echo 'Backend bağımlılıkları kuruluyor...'
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Docker image build işlemi başlatılıyor...'
                bat 'docker compose build'
            }
        }

        stage('Docker Compose Up') {
            steps {
                echo 'Docker Compose ile servisler ayağa kaldırılıyor...'
                bat 'docker compose up -d'
            }
        }

        stage('Wait For Services') {
            steps {
                echo 'Servislerin açılması bekleniyor...'
                bat 'timeout /t 20 /nobreak'
            }
        }

        stage('Backend Health Check') {
            steps {
                echo 'Backend health check yapılıyor...'
                bat 'curl -f http://localhost:3000'
            }
        }

        stage('Frontend Health Check') {
            steps {
                echo 'Frontend health check yapılıyor...'
                bat 'curl -f http://localhost:8080'
            }
        }

        stage('Docker Status') {
            steps {
                echo 'Çalışan containerlar listeleniyor...'
                bat 'docker ps'
            }
        }
    }

    post {
        always {
            echo 'Pipeline tamamlandı. Containerlar kapatılıyor...'
            bat 'docker compose down'
        }

        success {
            echo 'CI/CD pipeline başarıyla tamamlandı.'
        }

        failure {
            echo 'CI/CD pipeline başarısız oldu.'
        }
    }
}