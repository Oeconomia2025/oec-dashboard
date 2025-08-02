#!/bin/bash
set -e

echo "Installing dependencies with dev dependencies..."
npm install --include=dev

echo "Building React frontend..."
npx vite build

echo "Building Node.js server..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Creating api directory..."
mkdir -p api

echo "Copying files for Vercel deployment..."
cp -r dist/public/* .
cp dist/index.js api/index.js

echo "Build completed successfully!"