const path = require('path');
const fs = require('fs');
const createWebStore = require('chrome-webstore-upload');
const archiver = require('archiver');

const logger = console.log;

const config = {
  extensionId: process.env.EXTENSION_ID,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN
};
logger("Current config", config)
const ZIP_FILE_NAME = 'numbered-tabs-extension.zip';
const webStore = createWebStore(config);

// Write zip file from /src 
const zipped = fs.createWriteStream(path.resolve(__dirname, ZIP_FILE_NAME));
zipped.on('finish', () => {
  logger('Zip file created');
  uploadAndPublish(webStore);
});
const archive = archiver('zip');
archive.on('error', err => console.error('Zip file failed', error));
archive.pipe(zipped);
archive.directory(path.resolve(__dirname, 'src'), false);
// Upload to chrome store after zip file is created
archive.finalize();

async function uploadAndPublish(webStore) {
  const zipFile = fs.createReadStream(path.resolve(__dirname, ZIP_FILE_NAME));
  logger("Uploading...")
  const token = await webStore.fetchToken();
  console.log("Got an access token!", token);
  const uploadRes = await webStore.uploadExisting(zipFile, token);
  logger("Finished uploading!", uploadRes);
  const publishRes = await webStore.publish('default', token);
  logger("Finished publishing!", publishRes);
}

