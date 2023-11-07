

pipeline {

    agent any

    tools {
        nodejs  'NodeJs'
    }

    environment {
        registry = '154114/montreal-app'  //dockerhub username/repo-name
        registryCredential = 'dockerhub' // the credential we added for our docker in jenkins configure credentials page
    }

    stages{
        stage('Install') {
            steps {
            echo  'installing dependencies'
            sh 'npm install'
            }
        }
        stage('Testing') {
            steps {
                withEnv(["Mongo_URL=mongodb+srv://proftoby97:469iHVvyRaTkKD5T@montreal.i85lhyq.mongodb.net/?retryWrites=true&w=majority", "JWT_SECRET=Montreal"]){
                echo 'Testing app'
                sh 'npm test '
                }    
            }
        }
        //for code linting 
        stage('Code linting') {
            steps {
                echo 'Running code linting'
                sh 'npm install eslint'
                sh 'npm init @eslint/config'
                sh 'npx eslint '
            }
        }
        stage('build') {
            steps {
            echo 'Building project'

            sh 'npm run build'
            }
        }

        stage('Sonar Analysis') {
            environment {
             scannerHome =   tool 'mysonarscanner4' // must tally with the SonarQube Scanner name in /manage jenkins > tools page
            }
            steps { 
            withSonarQubeEnv('sonar-pro'){   // must tally with the SonarQube Scanner env  in /manage jenkins > configure global settings page
                sh ''' ${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=montreal \
                -Dsonar.projectName=Montrealapp \
                -Dsonar.projectVersion=1.0.0 \
                -Dsonar.projectSources=src/  
                -Dsonar.javascript.lcov.reportPaths=coverage/lcov-report/lcov.info \
                -Dsonar.javascript.exclusions=node_modules/**/*
                '''
            }
            }
        }
        stage('Quality gate') {
            steps {
                timeout(time :10 , unit: 'MINUTES'){
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage("Build App Image") {
            steps {
                script {
                    dockerImage = docker.build registry + ":V$BUILD_NUMBER"
                }
            }
        }
        stage("Upload Image to Docker Hub") {
            steps {
                script {
                    docker.withRegistry('', registryCredential) {
                        dockerImage.push("V$BUILD_NUMBER")
                        dockerImage.push('latest')
                    }
                }
            }
        }
            //this stage is important because as we keep the images, the size of the vm will keep increasing.
        stage("Remove Docker Image") {  
            steps {
                sh "docker rmi $registry:V$BUILD_NUMBER"
            }
        }

        stage("Deploy App To Kubernetes") {
            agent{label 'KOPS'}
            steps {
            sh "helm upgrade --install --force montrealapp -stack helm/montreal-chart --set appimage=${registry}:V${BUILD_NUMBER} --namespace prod"
            }
        }
        
    }
}