# Voter Analysis Database - MongoDB Docker Container

This repository provides instructions for setting up and accessing a MongoDB Docker container, which hosts the voter analysis database.

## Prerequisites
Ensure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/)

## Setup Instructions

### 1. Pull the MongoDB Docker Image

To get the latest version of the MongoDB image for the voter analysis database, use the following command:
docker pull eshanrand/voter_database:latest

### 2. Run the MongoDB container
docker run --name voter_analysis_database eshanrand/voter_database:latest
### 3 Accessing mongosh shell in the container 
docker exec -it voter_analysis_database mongosh
You can use this to check the structure of the datbase/insertion deletion

## useful commands

### For stopping container 
docker stop voter_analysis_database
### For restarting the container
docker start voter_analysis_database
### mongosh commands 
show dbs
show collections
use voter_analysis_project
