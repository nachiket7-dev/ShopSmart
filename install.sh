#!/bin/bash

# Function to check and install dependencies
install_deps() {
  folder=$1

  # Check if node_modules is missing OR package.json is newer
  if [ ! -d "$folder/node_modules" ] || [ "$folder/package.json" -nt "$folder/node_modules" ]; then
    echo "Installing dependencies in $folder..."
    
    # Run npm install inside the folder
    (cd "$folder" && npm install)
    
    # Check if it failed
    if [ $? -ne 0 ]; then
      echo "Failed to install dependencies for $folder"
      exit 1
    fi
    
    # Update the folder timestamp to mark it as done
    touch "$folder/node_modules"
  else
    echo "$folder is already up to date."
  fi
}

# Run for both client and server
install_deps "client"
install_deps "server"
