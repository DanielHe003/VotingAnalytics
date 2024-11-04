# Start with an official MongoDB image
FROM mongo:latest

# Set up a directory in the container for the app
WORKDIR /app

# Copy your Python script and any other files needed
COPY initialize_db.py /app/
COPY schemas /app/schemas
COPY merged_precincts.geojson /app/
COPY merged_states.geojson /app/
COPY merged_congressional_districts.geojson /app/

# Install Python and dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-venv && \
    python3 -m venv /app/venv && \
    /app/venv/bin/pip install --upgrade pip && \
    /app/venv/bin/pip install pymongo geojson

# Expose MongoDB port
EXPOSE 27017

# Command to start MongoDB and run your script in the virtual environment
CMD mongod --bind_ip_all --logpath /var/log/mongodb.log & \
    sleep 5 && \
    /app/venv/bin/python /app/initialize_db.py && \
    tail -f /var/log/mongodb.log
