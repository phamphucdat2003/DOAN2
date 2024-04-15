// googleDriveAPI.js
const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refreshToken: REFRESH_TOKEN, access_token: ACCESS_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

module.exports = {
  uploadfile: async (imgname,imgfile) => {
    try {
      const createfile = await drive.files.create({
        requestBody: {
          name: imgname,
          mimeType: 'image/jpeg',
          parents: ['1d-wLJ35oaDtdnkPoYymEbbTMINfZpEKk']
        },
        media: {
          mimeType: 'image/jpeg',
          body: fs.createReadStream(imgfile), 
        },
      });
      return createfile.data.id;
    } catch (error) {
      console.error(error);
    }
  },
  deletafile: async (fileId) => {
    try {
      const deleteFile = await drive.files.delete({
        fileId
      })
    } catch (error) {
      console.error(error);
    }
  }
};