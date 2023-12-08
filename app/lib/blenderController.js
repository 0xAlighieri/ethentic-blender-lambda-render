const { runCommand } = require("./util");
const path = require("path");

const blenderFilePath = "arch_docker.blend";
const pythonScript = "ethentic_v4.py";

// render a PNG preview of a model, given a 32 byte hex seed
// returns the path to the output file
const renderBlenderPng = async (stlModelPath, material, color, shape) => {
  const { name } = path.parse(stlModelPath);
  const renderPath = `/tmp/${name}.png`;
  const renderTimeTag = `Preview for STL model ${stlModelPath}`;
  console.time(renderTimeTag);
  await runCommand(
    `blender ${blenderFilePath} --background --python ${pythonScript} -- ${stlModelPath} ${material} ${color} ${shape}`,
    1500000
  );
  console.timeEnd(renderTimeTag);
  return renderPath;
};

module.exports = {
  renderBlenderPng,
};
