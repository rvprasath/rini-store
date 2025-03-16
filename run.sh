#!/bin/bash

echo "Running React build..."
cd front-end
npm run build

# Check if the build process completed successfully
if [ $? -ne 0 ]; then
  echo "Build failed: React build did not complete successfully."
  exit 1
fi

# Check if the build folder exists
if [ ! -d "build" ]; then
  echo "Build failed: 'build' folder not found."
  exit 1
fi

echo "Build completed successfully."
echo "Starting the production server..."

cd ..
npm run start:prod
