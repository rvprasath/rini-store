// config.js

require('dotenv').config();

module.exports = {
    UPLOAD_DIR: process.env.UPLOAD_DIR || '/Users/macbook/Public/Shrinidhi_Project/s3',
    HOST: 'localhost',
    USER: '',
    PASSWORD: '',
    DATABASE: '',
    PORT: 3306
};
