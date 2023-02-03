# Docker file for Nodejs
# Version 1.0
FROM node:18.14.0-alpine3.17

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application files to the working directory
COPY . .

# Specify the command to run when the container starts
CMD [ "yarn", "start" ]