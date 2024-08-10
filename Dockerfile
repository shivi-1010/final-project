# Use the official Node.js image.
FROM node:14

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package.json package-lock.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the TypeScript code.
RUN npm run build

# Run the migrations and then start the server.
CMD npm run migration:run && npm start




# # Use the official Node.js image.
# FROM node:lts-alpine

# # Create and set the working directory.
# WORKDIR /app

# # Copy package.json and package-lock.json (if available) and install dependencies.
# COPY package*.json ./
# RUN npm install

# # Copy the rest of the application code.
# COPY . .

# # Compile TypeScript code.
# RUN npm run build

# # Expose the port your app runs on.
# EXPOSE 4000

# # Start the application.
# CMD ["npm", "start"]
