require('dotenv').config();
const crypto = require('crypto');

// Hash the data using SHA-256
exports.hash = (data) => {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
};

// Encrypt the data
exports.encrypt = (data) => {
  const iv = crypto.randomBytes(16); // Generate a random initialization vector
  const cipher = crypto.createCipheriv(process.env.ENCRYPT_ALGORITHM, process.env.ENCRYPT_KEY, iv);
  const encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex') + cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
};

// Decrypt the data
exports.decrypt = (data) => {
  const decipher = crypto.createDecipheriv(process.env.ENCRYPT_ALGORITHM, process.env.ENCRYPT_KEY, Buffer.from(data.iv, 'hex'));
  const decrypted = decipher.update(data.encryptedData, 'hex', 'utf8') + decipher.final('utf8');
  return decrypted;
};
