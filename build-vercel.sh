#!/bin/bash
set -e

echo "Installing dependencies with dev packages..."
npm install --include=dev

echo "Building the application..."
npm run build

echo "Preparing files for deployment..."
if [ -d "dist/public" ]; then
    echo "Copying React build files..."
    cp -r dist/public/* ./
    echo "React build deployed successfully!"
else
    echo "Build directory not found, using fallback index.html"
fi

echo "Final deployment files:"
ls -la *.html