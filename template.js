const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { promisify } = require('util');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const log = (message) => console.log(`[${new Date().toISOString()}: INFO]: ${message}`);

const promptInput = (question) => new Promise((resolve) => {
  rl.question(question, resolve);
});

const createProject = async () => {

  const listOfFiles = [
    `src/config/index.js`,
    `src/config/logger-config.js`,
    `src/config/server-config.js`,
    `src/controllers/index.js`,
    `src/middlewares/index.js`,
    `src/repositories/index.js`,
    `src/routes/index.js`,
    `src/services/index.js`,
    `src/utils/index.js`,
    `src/index.js`,
  ];

  for (const filepath of listOfFiles) {
    const filedir = path.dirname(filepath);
    const filename = path.basename(filepath);
    if (filedir !== "") {
      await promisify(fs.mkdir)(filedir, { recursive: true });
      log(`Creating a directory at: ${filedir} for file: ${filename}`);
    }
    if (!fs.existsSync(filepath) || fs.statSync(filepath).size === 0) {
      await promisify(fs.writeFile)(filepath, '');
      log(`Creating a new file: ${filename} at path: ${filepath}`);
    } else {
      log(`File is already present at: ${filepath}`);
    }
  }

  rl.close();
};

createProject().catch(console.error);