void setBuildStatus(String message, String state) {
  step([
      $class: "GitHubCommitStatusSetter",
      reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.com/my-org/my-repo"],
      contextSource: [$class: "ManuallyEnteredCommitContextSource", context: "ci/jenkins/build-status"],
      errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
      statusResultSource: [ $class: "ConditionalStatusResultSource", results: [[$class: "AnyBuildResult", message: message, state: state]] ]
  ]);
}

def getRepoURL() {
  sh "git config --get remote.origin.url > .git/remote-url"
  return readFile(".git/remote-url").trim()
}

def getCurrentTag() {
  sh "git tag --points-at HEAD > .git/current-tag"
  return readFile(".git/current-tag").trim()
}

def getCommitSha() {
  sh "git rev-parse HEAD > .git/current-commit"
  return readFile(".git/current-commit").trim()
}

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
    post {
        success {
            setBuildStatus("Build succeeded", "SUCCESS");
        }
        failure {
            setBuildStatus("Build failed", "FAILURE");
        }
    }
}