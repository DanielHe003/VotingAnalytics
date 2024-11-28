# Voter Analysis Project

This project includes both the frontend and backend for a voter analysis application.

## Frontend

You can access the frontend of the application here:

[Frontend on Netlify](https://gentle-cassata-a909ff.netlify.app/)

## How to start the backend

Follow these steps to setup both the server and database:

1. **Delete useless Container**  
Delete any old containers named any of the following: 
voter_analysis_server
eshanrand/voter_analysis:latest
voter_analysis_database
eshanrand/voter_database:latest
2. **Run compose command**
docker-compose up 
This will start both the server and database and link them together so you don't have to worry about that.
It'll take like 15-20 secs to setup the db and stuff after that all requests are quick you'll see exactly whats going in the shell. 
If you want to acess mongo shell 
docker exec -it voter_analysis_database mongosh
To stop the services either ctrl c or run docker-compose down
3. **Server endpoints**
All server endpoints organized by use case can be found in the following Google Doc:  
[Server Endpoints Documentation](https://docs.google.com/document/d/1oLvWEi59ObiaPXhZOTS81RGHHGIwimMg4nweHH-rAVw/edit?usp=sharing)