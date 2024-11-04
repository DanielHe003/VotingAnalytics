
#!/bin/bash
# Start MongoDB in the background
mongod --fork --logpath /var/log/mongodb.log --bind_ip_all

# Wait for MongoDB to start
sleep 5

# Run the Python script to initialize the database
python3 /app/initialize_db.py

# Keep the container running
tail -f /dev/null
