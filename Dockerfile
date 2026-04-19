# Use an official Node image as a base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Define build-time variable (must start with VITE_ for Vite)
ARG VITE_API_URL=https://dnt-admin.trwq-ta.io.vn/api
ENV VITE_API_URL=$VITE_API_URL

# Build the Vite app
RUN npm run build

# Use nginx or other server to serve
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
# docker build --build-arg  VITE_API_URL=http://27.71.27.147:1337/api -t jeyluu/customer-journey-web:release-1.0.8 . .
# docker run -p 3000:80 jeyluu/customer-journey-web:release-1.0.6