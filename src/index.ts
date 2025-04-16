#!/usr/bin/env node
/**
 * Main entry point for the flights MCP
 */
import 'dotenv/config';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

console.log('Starting Flight Search MCP server');

try {
  // Create the MCP server
  const server = createServer();
  
  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  
  // Connect the server to the transport
  server.connect(transport)
    .then(() => {
      console.log('Server initialized successfully and connected to transport');
    })
    .catch((error) => {
      console.error(`Error connecting to transport: ${error}`);
      process.exit(1);
    });
  
} catch (error) {
  console.error(`Server initialization error: ${error}`);
  process.exit(1);
}
