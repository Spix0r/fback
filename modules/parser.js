const fetcher = require("./fetcher");
const path = require("path");

function extractTLD(hostname, tldsSet) {
  const parts = hostname.toLowerCase().split(".");
  let tld = "";
  for (let i = 1; i <= parts.length; i++) {
    const candidate = parts.slice(-i).join(".");
    if (tldsSet.has(candidate)) {
      tld = candidate;
    } else if (tld) {
      break;
    }
  }
  return tld || null;
}

async function parseUrl(urlString, update, silent) {
  const url = new URL(urlString);

  const tlds = await fetcher(update, silent);

  const tldsSet = new Set(tlds);

  // Hostname
  const hostname = url.hostname;

  // TLD
  const parts = hostname.toLowerCase().split(".");
  const tld = extractTLD(hostname, tldsSet);

  if (!tld) return null;

  // Validate Domain
  const tldParts = tld.split(".");
  const domainIndex = parts.length - tldParts.length - 1;

  if (domainIndex < 0) {
    return null;
  }

  // Domain Name
  const domainName = parts[domainIndex];

  // Subdomain
  const subdomain = parts.slice(0, domainIndex).join(".");

  // Domain + TLD
  const domain = `${domainName}.${tld}`;

  // Subdomain + Domain + TLD
  const fullDomain = subdomain ? `${subdomain}.${domainName}.${tld}` : `${domainName}.${tld}`;

  // Path Name
  let pathName = url.pathname;

  // File name
  const fileName = path.basename(url.pathname).includes(".") ? path.basename(url.pathname) : "";

  // Full Path
  pathName = pathName.replace(`/${fileName}`, "");
  const fullPath = fileName ? `${pathName}/${fileName}` : pathName;

  return { subdomain, domainName, fullDomain, domain, tld, pathName, fileName, fullPath };
}

module.exports = parseUrl;
