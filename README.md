# Voter Analysis Project

This project includes both the frontend and backend for a voter analysis application.

## Frontend

You can access the frontend of the application here:

[Frontend on Netlify](https://gentle-cassata-a909ff.netlify.app/)

## Docker Container

To run the backend server using Docker, follow these steps:

1. **Pull the Docker Image**  
   Run the following command to pull the Docker image:
   docker pull eshanrand/voter_analysis_app
2.  **Start the container and run server** 
docker run -p 8080:8080 --name voter_analysis_app eshanrand/voter_analysis_app ./gradlew bootrun



3. **Access the API**
http://localhost:8080/api/samplefeature/

