#!/bin/bash
set -e

echo "Installing dependencies with dev packages..."
npm install --include=dev

echo "Building the application..."
npm run build

echo "Copying files to public directory for Vercel..."
mkdir -p public
cp -r dist/public/* public/

echo "Build completed successfully!"
ls -la public/