const logger = require("./logger");
const { readFile, writeFile } = require("./fileHandler");
const { existsSync } = require("fs");

async function fetcher(update, silent) {
  try {
    const URL = "https://publicsuffix.org/list/public_suffix_list.dat";

    if (update || !existsSync(`${__dirname}/../data/public_suffix_list.dat`)) {
      const response = await fetch(URL);

      if (!response.ok) {
        logger(silent).error(`There was an error while fetching ${URL}`);
      }

      const text = await response.text();

      // Save file
      writeFile(`${__dirname}/../data/public_suffix_list.dat`, silent, text);

      const result = text
        .split("\n")
        .filter((line) => !line.trim().startsWith("//") && line.trim() !== "");

      return [...new Set(result)];
    }

    return readFile(`${__dirname}/../data/public_suffix_list.dat`)
      .split("\n")
      .filter((line) => !line.trim().startsWith("//") && line.trim() !== "");
  } catch (error) {
    return logger(silent).error(error);
  }
}

module.exports = fetcher;
