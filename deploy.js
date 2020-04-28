const path = require('path');
const fs = require('fs');
const createWebStore = require('chrome-webstore-upload');
const archiver = require('archiver');

// Create zip file from /src 
const zipped = fs.createWriteStream(path.resolve(__dirname, 'numbered-tabs-extension.zip'));
const archive = archiver('zip');
archive.on('error', err => console.error('Zip file failed', error));
archive.pipe(zipped);
archive.directory(path.resolve(__dirname, 'src'), false);
archive.finalize();

const webStore = createWebStore({
  extensionId: process.env.EXTENSION_ID,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN
});

async function uploadAndPublish(webStore, zipFile) {
  const token = await webStore.fetchToken();
  const uploadRes = await webStore.uploadExisting(zipFile, token)
}

// Upload to chrome store after zip file is created
zipped.on('end', () => {
  console.log('Zip file created');
  uploadAndPublish(webStore, zipped);
});
