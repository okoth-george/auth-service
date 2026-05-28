FROM node:22-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# 1. Copy package files
COPY package*.json ./

# 2. Install dependencies
RUN npm install

COPY prisma ./prisma
COPY prisma.config.js ./

ARG DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
ENV DATABASE_URL=$DATABASE_URL

# Generate the client at build time
RUN npx prisma generate

# 3. Copy the entire app including prisma schema
COPY . .


EXPOSE 3000

CMD ["npm", "run", "dev"]