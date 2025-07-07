const args = require("./modules/args");
const fileHandler = require("./modules/fileHandler");
const generator = require("./modules/generator");

// Generate Wordlist
args.parse_args().then((args) => {
  generator.generate(args).then((result) => {
    if (!result) {
      logger(args.silent).warn("Result is empty.");
      process.exit(0);
    }
    fileHandler.writeFile(args.output, args.silent, result.join("\n"));

    console.log(result.join("\n"));
  });
});
