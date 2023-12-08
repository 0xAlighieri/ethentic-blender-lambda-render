const path = require("path");
const { storeFileRedundant } = require("./lib/storer");
const { renderBlenderPng } = require("./lib/blenderController");
const { writeFileSync } = require("fs");
const { runCommand } = require("./lib/util");
const axios = require("axios");

// take a PNG image, and save a JPG in the same directory with the same name
const saveCompressedImageCopy = async (inputPath) => {
  const { dir, name } = path.parse(inputPath);
  const outputPath = `${dir}/${name}.jpg`;

  const compressTimeTag = `Saving compressed image to ${outputPath}`;
  console.time(compressTimeTag);
  await runCommand(`convert ${inputPath} -quality 95 ${outputPath}`, 20000);
  console.timeEnd(compressTimeTag);
  return outputPath;
};

exports.handler = async (event, context) => {
  try {
    const { stlUrl, canonicalName, traits } = event;
    console.info(
      `Triggered with params: ${JSON.stringify({
        stlUrl,
        canonicalName,
        traits,
      })}`
    );

    console.log(`Requesting ${stlUrl}`);
    const res = await axios.request(stlUrl, {
      method: "get",
      responseType: "arraybuffer",
    });

    const stlFilePath = `/tmp/${path.basename(stlUrl)}`;
    console.log(`Writing to ${stlFilePath}`);
    writeFileSync(stlFilePath, Buffer.from(res.data, "binary"));
    console.log("STL file written");

    const material = "pla";
    const color = `${traits.Color}`.toLowerCase().replace(/ /g, "_");
    const shape = `${traits.Shape}`.toLowerCase();

    const viewPngPath = await renderBlenderPng(
      stlFilePath,
      material,
      color,
      shape
    );

    const viewJpgPath = await saveCompressedImageCopy(viewPngPath);

    const {
      fleekLocation: viewPngFleekLocation,
      spacesLocation: viewPngSpacesLocation,
      viewPngCID,
    } = await storeFileRedundant(
      viewPngPath,
      `collection/0/preview/${path.basename(viewPngPath)}`,
      { ContentType: "image/png", ACL: "public-read" }
    );

    const {
      fleekLocation: viewJpgFleekLocation,
      spacesLocation: viewJpgSpacesLocation,
      viewJpgCID,
    } = await storeFileRedundant(
      viewJpgPath,
      `collection/0/preview/${path.basename(viewJpgPath)}`,
      { ContentType: "image/jpg", ACL: "public-read" }
    );

    return {
      success: true,
      canonicalName,
      viewPngPath,
      viewPngFleekLocation,
      viewPngSpacesLocation,
      viewPngCID,
      viewJpgPath,
      viewJpgFleekLocation,
      viewJpgSpacesLocation,
      viewJpgCID,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: err.message,
    };
  }
};
