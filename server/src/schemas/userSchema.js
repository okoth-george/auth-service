const { z } = require('zod');

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6)
});

module.exports = { registerSchema };