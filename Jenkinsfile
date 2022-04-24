pipeline {
    agent {
        label 'docker'
    }

    environment {
        DOCKER_IMAGE_NAME = 'ghcr.io/ashswap/interface'
        DOCKER_PSECET     = credentials('975ca391-602f-421b-98d2-c3bc9e56bcf2')
    }

    stages {
        stage('Build') {
            steps {
                container('docker-client'){
                    sh('./scripts/build.sh')
                }
            }
        }
        stage('Push') {
            when {
                expression {
                    return getCurrentTag() != '';
                }
            }
            steps {
                container('docker-client'){
                    sh('./scripts/push.sh')
                }
            }
        }
    }
}