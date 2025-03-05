/* eslint-disable @typescript-eslint/no-require-imports */
// server.js for Next.js 15.1.7
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

// Force production mode since we're deploying
process.env.NODE_ENV = "production";

// App configuration
const hostname = "0.0.0.0"; // Listen on all network interfaces
const port = process.env.PORT || 8080;

// Create Next.js app instance - use a try/catch to better handle errors
let app;
try {
  console.log(`Starting Next.js 15.1.7 in production mode`);
  app = next({
    dev: false,
    hostname,
    port,
    dir: process.cwd(),
  });
} catch (err) {
  console.error("Error initializing Next.js app:", err);
  process.exit(1);
}

// Prepare and start the app with comprehensive error handling
async function startServer() {
  try {
    // Log Node.js and npm versions
    console.log(`Node.js version: ${process.version}`);
    console.log(`Next.js version: ${require("next/package.json").version}`);

    // Log environment variables (excluding sensitive data)
    console.log("Environment variables:", {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      // Add other non-sensitive variables here
    });

    // Try to get request handler
    const handle = app.getRequestHandler();
    console.log("Successfully created request handler");

    // Prepare Next.js app
    console.log("Preparing Next.js app...");
    await app.prepare();
    console.log("Next.js app prepared successfully");

    // Create HTTP server
    createServer(async (req, res) => {
      try {
        // For debugging
        console.log(
          `${new Date().toISOString()} - Request: ${req.method} ${req.url}`
        );

        // Parse URL
        const parsedUrl = parse(req.url, true);

        // Let Next.js handle the request
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error handling request:", req.url, err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      }
    }).listen(port, (err) => {
      if (err) {
        console.error("Error starting server:", err);
        process.exit(1);
      }
      console.log(`> Server ready on http://${hostname}:${port}`);
    });
  } catch (err) {
    console.error("Fatal error during server startup:", err);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  // Don't exit the process, just log the error
});

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit the process, just log the error
});

// Start server
startServer();
