const fs = require("fs");
const logger = require("./logger");

function validateFile(pattern, data, toReplaces) {
  if (data.length === 0 && JSON.stringify(pattern).includes(toReplaces)) {
    logger.warn(`The given list for ${toReplaces} is empty!`);
  }
}

function readFile(
  path,
  silent,
  encoding = "utf8",
  toReplaces = "",
  pattern = {},
  validate = false
) {
  try {
    const data = fs.readFileSync(path, encoding);

    if (validate) {
      validateFile(pattern, data, toReplaces);
    }

    return data;
  } catch (err) {
    logger(silent).error(err);
  }
}

function writeFile(path, silent, data, encoding = "utf8") {
  if (!path) {
    return;
  }

  try {
    fs.writeFileSync(path, data, encoding);
  } catch (err) {
    logger(silent).error(err);
  }
}

function readStdin() {
  return new Promise((resolve) => {
    // If input is from a terminal, don't wait for stdin
    if (process.stdin.isTTY) {
      return resolve([]);
    }

    let input = "";
    process.stdin.setEncoding("utf8");

    process.stdin.on("data", (chunk) => {
      input += chunk;
    });

    process.stdin.on("end", () => {
      resolve(input.trim().split("\n").filter(Boolean));
    });
  });
}

module.exports = { readFile, writeFile, readStdin };
