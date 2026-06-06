FROM node:20-alpine

WORKDIR /app

# Install dependencies safely using lockfile verification
COPY package*.json ./
RUN npm install

# Copy the rest of your application source code
COPY . .

# Expose Vite's default local development preview port
EXPOSE 5173

# Default runtime command (Perfect for local Docker workflows)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]