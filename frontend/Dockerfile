# Use Node.js 18 as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the project, including the public folder
COPY . .

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
