function banner(silent) {
  const magenta = "\x1b[35m";
  const yellow = "\x1b[33m";
  const reset = "\x1b[0m";
  const banner =
    magenta +
    `

  █████▒▄▄▄▄    ▄▄▄       ▄████▄   ██ ▄█▀
▓██   ▒▓█████▄ ▒████▄    ▒██▀ ▀█   ██▄█▒ 
▒████ ░▒██▒ ▄██▒██  ▀█▄  ▒▓█    ▄ ▓███▄░ 
░▓█▒  ░▒██░█▀  ░██▄▄▄▄██ ▒▓▓▄ ▄██▒▓██ █▄ 
░▒█░   ░▓█  ▀█▓ ▓█   ▓██▒▒ ▓███▀ ░▒██▒ █▄
 ▒ ░   ░▒▓███▀▒ ▒▒   ▓▒█░░ ░▒ ▒  ░▒ ▒▒ ▓▒
 ░     ▒░▒   ░   ▒   ▒▒ ░  ░  ▒   ░ ░▒ ▒░
 ░ ░    ░    ░   ░   ▒   ░        ░ ░░ ░ 
        ░            ░  ░░ ░      ░  ░   
             ░           ░  
                      ` +
    reset +
    "[github.com/Spix0r]\n\n";

  if (!silent) {
    process.stderr.write(banner);
  }
}

module.exports = banner;
