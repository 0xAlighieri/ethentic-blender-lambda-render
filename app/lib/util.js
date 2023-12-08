const { exec } = require("child_process");

async function runCommand(command, timeout = 5000) {
  console.log(`Running ${command}`);
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command that failed: ${command}`);
        console.error(`error: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        console.error(`stdout: ${stdout}`);
        reject(new Error(stdout || stderr)); // it seems random if the message is in stdout or stderr, but not normally both
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        resolve(stderr);
        return;
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
    setTimeout(() => {
      reject(
        new Error(
          `Exec of ${command} timed out (${Math.round(timeout / 1000)}s)`
        )
      );
    }, timeout);
  });
}

module.exports = {
  runCommand,
};
