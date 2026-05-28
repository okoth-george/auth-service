require('dotenv').config()
const { defineConfig, env } = require('prisma/config') // Notice we imported 'env' here
const { PrismaPg } = require('@prisma/adapter-pg')

module.exports = defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  
  // 1. Define the main datasource URL here so ALL commands can find it
  datasource: {
    url: env('DATABASE_URL'), 
  },

  // 2. Keep your migration configuration clean
  migrate: {
    async adapter() {
      // Prisma automatically passes the evaluated env down here
      return new PrismaPg({ connectionString: process.env.DATABASE_URL })
    },
  },
})