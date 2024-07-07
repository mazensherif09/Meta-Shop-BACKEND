import dotenv from "dotenv";
dotenv.config(); //config env
export const corsOptions = {
  origin: process.env.DOMAINS.split(","), // List of allowed origins
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: [
    "Content-Type", // Required for POST requests with a JSON or XML body
    "Authorization", // Required if you're using authorization headers
    "Access-Control-Allow-Origin",
    "X-Requested-With", // Required for XMLHttpRequests
    "X-File-Name", // Required for file uploads
    "X-File-Size", // Required for chunked uploads
    "X-File-Type", // Required for chunked uploads
    "Content-Disposition", // Required for file uploads
  ],
};
