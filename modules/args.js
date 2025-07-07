const { readStdin } = require("./fileHandler");
const { Command } = require("commander");
const logger = require("./logger");
const fileHandler = require("./fileHandler");
const program = new Command();
const banner = require("./banner");

// Parse Command Line Arguments
async function parse_args() {
  program
    .option("-s, --silent", "Make Program Silent.", false)
    .option("-u, --update", "Update TLDs File (Needs Internet Connection).")
    .option("-l, --urls <file>", "Urls file path (or use STDIN)")
    .option("-p, --pattern <file>", "Pattern file path", `${__dirname}/../data/pattern.json`)
    .option("-w, --wordlist <file>", "Wordlist file path", `${__dirname}/../data/wordlist.txt`)
    .option("-e, --extension <file>", "extension file path", `${__dirname}/../data/extension.txt`)
    .option("-o, --output <file>", "output file path")
    .option("-n, --numbers <number>", "Numbers ranges in wordlist", "1-3")
    .option("-y, --year <2023-2025>", "Years range in wordlist", "2025")
    .option("-m, --month <1-12>", "Months range in wordlist", "1")
    .option("-d, --day <1-30>", "Days range in wordlist", "1");
  program.parse(process.argv);

  var args = program.opts();

  banner(args.silent);

  try {
    if (!args.urls) {
      args.urls = await readStdin();
    } else {
      args.urls = await fileHandler.readFile(args.urls, args.silent).split("\n");
    }

    if (args.urls.length === 0) {
      logger(args.silent).error("Empty URL");
      process.exit(1);
    }

    return args;
  } catch (e) {
    logger(args.silent).error(`No Urls Provided - Error: ${e}`);
    process.exit(1);
  }
}

module.exports = { parse_args };
