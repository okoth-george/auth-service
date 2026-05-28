const prisma = require('../config/prisma');
console.log('Prisma instance:', prisma);

exports.findByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username }
  });
};

exports.findById = async (id) => {
  return await prisma.user.findUnique({
    where: { id }
  });
};

exports.createUser = async (username, hashedPassword) => {
  return await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    }
  });
};

// ← new
exports.updatePassword = async (userId, hashedPassword) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });
};