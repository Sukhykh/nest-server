# ABOUT DOCKER: this node will be run inside Docker
FROM node:18.17

# ABOUT DOCKER: create root dir inside Docker
WORKDIR /app

# ABOUT DOCKER: copy package.json and package-lock.json to root dir
COPY package*.json ./

# ABOUT DOCKER: install all dependencies from package.json
RUN npm install

# ABOUT DOCKER: copy all files
COPY . .

# ABOUT DOCKER: copy ./dist folder
COPY ./dist ./dist

# ABOUT DOCKER: define port
EXPOSE 5000

# ABOUT DOCKER: 
CMD ["npm", "run", "start:dev"]