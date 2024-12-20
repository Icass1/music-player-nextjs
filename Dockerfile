# Use the official Node.js image as a base
FROM node:19.9.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of your application code
COPY . .

ENV NODE_ENV=production





# Build the Next.js app
RUN pnpm exec next build

# Expose the port your app runs on
EXPOSE 8080

# Define the command to run your app
CMD ["pnpm", "exec", "next", "start", "-p", "8080"]