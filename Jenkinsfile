pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'ekinay-ci'
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

        stage('Docker Cleanup Before Start') {
            steps {
                echo 'Önce eski Ekinay containerları temizleniyor...'
                sh 'docker compose down || true'
                sh '''
                    docker rm -f ekinay-rabbitmq ekinay-redis ekinay-backend ekinay-frontend ekinay-alert-worker || true
                '''
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Docker image build işlemi başlatılıyor...'
                sh 'docker compose build'
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
                sh 'sleep 35'
            }
        }

        stage('Docker Status') {
            steps {
                echo 'Çalışan containerlar listeleniyor...'
                sh 'docker ps'
            }
        }

        stage('Backend Logs') {
            steps {
                echo 'Backend logları kontrol ediliyor...'
                sh 'docker logs ekinay-backend --tail 50'
            }
        }

        stage('Backend Health Check') {
            steps {
                echo 'Backend container içinden health check yapılıyor...'
                sh '''
                    docker exec ekinay-backend node -e "fetch('http://localhost:3000').then(r => { if (!r.ok) process.exit(1); return r.text(); }).then(t => console.log(t)).catch(e => { console.error(e); process.exit(1); })"
                '''
            }
        }

        stage('Frontend Health Check') {
            steps {
                echo 'Frontend container içinden health check yapılıyor...'
                sh '''
                    docker exec ekinay-frontend wget -qO- http://localhost | head -n 5
                '''
            }
        }

        stage('RabbitMQ Status') {
            steps {
                echo 'RabbitMQ container durumu kontrol ediliyor...'
                sh 'docker logs ekinay-rabbitmq --tail 20'
            }
        }

        stage('Redis Status') {
            steps {
                echo 'Redis container durumu kontrol ediliyor...'
                sh 'docker logs ekinay-redis --tail 20'
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