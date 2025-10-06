// Jenkinsfile (Windows)
pipeline {
    agent any

    environment {
        COMPOSE = "docker compose -f docker-compose.yml"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/BK-KRISH/college-app.git'
            }
        }

        stage('Build images') {
            steps {
                echo "Building images..."
                bat "${COMPOSE} build --no-cache"
            }
        }

        stage('Start services for tests') {
            steps {
                echo "Starting DB + App (detached)..."
                bat "${COMPOSE} up -d db app"
            }
        }

        stage('Smoke Test (wait for /health)') {
            steps {
                echo "Waiting for app health..."
                bat """
                @echo off
                set i=0
                :waitloop
                set /a i+=1
                curl -sS http://localhost:8082/health > NUL 2>&1 && (echo Health OK & exit /b 0)
                if %i% GEQ 30 (
                  echo App did not become healthy in time
                  exit /b 1
                )
                timeout /t 2 > NUL
                goto waitloop
                """
            }
        }

        stage('Deploy (recreate)') {
            steps {
                echo "Deploying (recreate containers)..."
                // Recreate to ensure latest image runs; ignore errors on down
                bat """
                @echo off
                ${COMPOSE} down || exit /b 0
                ${COMPOSE} up -d --build
                """
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline Succeeded. App should be at http://localhost:8082"
        }
        failure {
            echo "❌ Pipeline failed. Check logs in Jenkins."
        }
    }
}
