#!/bin/bash
# Setup script for the Flight Search MCP TypeScript project

echo "Setting up Flight Search MCP (TypeScript)..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

echo "Setup complete!"
echo ""
echo "To start the server, run: npm start"
echo "To publish to Smithery, run: npx @smithery/cli publish"
echo "To run on Smithery, run: npx @smithery/cli run @your-username/flights-mcp-ts --config '{\"duffelApiKey\":\"your_duffel_api_key\"}'"
