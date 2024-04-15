
require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN
const ACCESS_TOKEN = process.env.ACCESS_TOKEN



const oauth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
oauth2Client.setCredentials({refreshToken: REFRESH_TOKEN,access_token:ACCESS_TOKEN});


const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

module.exports = {
    uploadfile: async () => {
        try {
            const createFile = await drive.files.create({
                requestBody: {
                    name: 'ahii.jpg',
                    mimeType: 'image/jpg'
                },
                media: {
                    minetype: 'image/jpg',
                    body: fs.createReadStream(path.join(__dirname, '/../2.jpg'))
                }
            })
            console.log(createFile.data)
        } catch (error) {
            console.log(error)
        }
    }
}