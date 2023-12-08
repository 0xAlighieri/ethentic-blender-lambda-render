// responsible for storing renders where they should go
const fs = require("fs");
const AWS = require("aws-sdk");

const getFleekEndpoint = () => {
  const s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.FLEEK_KEY,
    secretAccessKey: process.env.FLEEK_SECRET,
    endpoint: process.env.FLEEK_ENDPOINT,
    region: "us-east-1",
    s3ForcePathStyle: true,
  });
  return s3;
}

const getSpacesEndpoint = () => {
  const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT);
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  });
  return s3;
}

const storeFile = async (service, filePath, key, uploadParams) => {
  let endpoint, bucketName;
  if (service == "fleek") {
    endpoint = getFleekEndpoint();
    bucketName = process.env.FLEEK_BUCKET_NAME;
  }  else if (service == "spaces") {
    endpoint = getSpacesEndpoint();
    bucketName = process.env.SPACES_NAME;
  } else {
    throw new Error("Invalid service name. Valid options are 'fleek' and 'spaces'");
  }

  const contents = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: contents,
    ...uploadParams,
  };

  const data = await endpoint.upload(params).promise();
  return data;
}

// store in both fleek and spaces
const storeFileRedundant = async (filePath, key, uploadParams) => {
  const fleekResult = await storeFile("fleek", filePath, key, uploadParams);
  console.log(`File ${filePath} uploaded to fleek successfully: ${fleekResult.Location}`);
  const spacesResult = await storeFile("spaces", filePath, key, uploadParams);
  console.log(`File ${filePath} uploaded to spaces successfully: ${spacesResult.Location}`);

  return {
    ipfsCIDV1: String(fleekResult.ETag).replace("\"",""),
    fleekLocation: fleekResult.Location,
    spacesLocation: spacesResult.Location,
  };
}

const storeFileToFleek = async (filePath, key, uploadParams) => {
  const result = await storeFile("fleek", filePath, key, uploadParams);
  return result;
}

const storeFileToSpaces = async (filePath, key, uploadParams) => {
  const result = await storeFile("spaces", filePath, key, uploadParams);
  return result;
}

module.exports = {
  getFleekEndpoint,
  storeFileRedundant,
  storeFileToFleek,
  storeFileToSpaces,
};