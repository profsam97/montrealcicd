## View the live url

Open [montreal-production.up.railway.app](https://montreal-production.up.railway.app) with your browser to see the app running.


## Getting Started
First, install the dependencies for this project.
Please use the below command to install the dependencies.

```bash
npm install
# or
yarn install
```
## Setting Env files 

Create a folder called config in the root directory.
create a file called dev.env. this file contains the 
required variables needed for this app to run successfully

you need a mondodb db, which you can get at the official
website

Open [https://mongodb.com](https://mongodb.com) 

create a database, then get your credentials
and store it in the env file.

Mongo_URL = 'YOUR DB URL'
JWT_SECRET = 'Montreal'


Also add the below variable

_**// used for private/public key with jwt~_**



## Starting the Server
Next, run the following command to start the server.

```bash
npm run dev
# or
yarn dev
```
## View  the App.


Then open the browser and go to http://localhost:3000/

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running.

## test  the App.

The test file is located in /src/test

Please ensure that the env file has been set up, as it won't work properly without 
it.


