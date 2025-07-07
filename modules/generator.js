const fileHandler = require("./fileHandler");
const parserUrl = require("./parser");
const logger = require("./logger");

function staticReplace(patterns, variables) {
  const varMap = {
    domain_name: variables.domainName,
    full_domain: variables.fullDomain,
    subdomain: variables.subdomain,
    path: variables.pathName,
    full_path: variables.fullPath,
    file_name: variables.fileName,
  };

  const regex = /\$(domain_name|full_domain|subdomain|path|full_path|file_name)/g;

  const result = [];
  for (let i = 0; i < patterns.patterns.length; i++) {
    const pattern = patterns.patterns[i];
    result.push(pattern.replace(regex, (_, key) => varMap[key] || ""));
  }
  return result;
}

function dynamicReplace(patterns, toReplaces, name) {
  const result = [];
  for (const pattern of patterns) {
    for (const replacement of toReplaces) {
      result.push(pattern.split(name).join(replacement));
    }
  }
  return result;
}

function generateVars(variable, silent) {
  if (variable.includes("-")) {
    variable = variable.split("-");
    const range = Array.from(
      {
        length: parseInt(variable[1]) - parseInt(variable[0]) + 1,
      },
      (_, i) => parseInt(variable[0]) + i
    );

    if (range.length === 0) {
      logger(silent).error("The given numbers range is invalid");
      process.exit(1);
    }

    return range;
  }

  if (!isFinite(parseInt(variable))) {
    logger(silent).error("The given number is invalid");
    process.exit(1);
  }

  return [variable];
}

function cleaner(data) {
  // Remove Duplicates
  uniqueOutput = [...new Set(data)];

  // Add / at the start of items
  const updatedArray = uniqueOutput.map((item) => (item.startsWith("/") ? item : "/" + item));

  return [...new Set(updatedArray)];
}

async function generate(args) {
  var outputs = [];

  for (const url of args.urls) {
    try {
      const urlObj = await parserUrl(url, args.update, args.silent);

      const pattern = JSON.parse(fileHandler.readFile(args.pattern, args.silent));

      const wordlist = fileHandler
        .readFile(args.extension, args.silent, "utf8", "$word", pattern, true)
        .split("\n");

      const extension = fileHandler
        .readFile(args.extension, args.silent, "utf8", "$ext", pattern, true)
        .split("\n");

      const numbers = generateVars(args.numbers, args.silent);
      const year = generateVars(args.year, args.silent);
      const month = generateVars(args.month, args.silent);
      const day = generateVars(args.day, args.silent);

      var output = staticReplace(pattern, urlObj);

      output = dynamicReplace(output, extension, "$ext");
      output = dynamicReplace(output, numbers, "$num");
      output = dynamicReplace(output, wordlist, "$word");
      output = dynamicReplace(output, month, "$m");
      output = dynamicReplace(output, year, "$y");
      output = dynamicReplace(output, day, "$d");

      outputs = outputs.concat(output);
    } catch (e) {
      if (e instanceof SyntaxError) {
        logger(args.silent).error(`invalid Pattern. - ${e}`);
      }

      if (e instanceof TypeError) {
        logger(args.warn).warn(`Invalid Url: ${url}`);
        continue;
      }

      logger(args.silent).error(e);
      process.exit(1);
    }
  }

  result = cleaner(outputs);

  return result;
}

module.exports = { generate };
