# 🕷 FBack

**A lightning-fast CLI tool for generating target-specific wordlists to fuzz backup files**

---

## 🕸 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Usage](#-usage)
- [Pattern Variables](#-pattern-variables)
- [Examples](#-examples)
- [Contributing](#-contributing)
- [License](#-license)

## 🕸 Overview

**FBack** is a powerful command-line tool designed for security professionals and penetration testers. It generates comprehensive wordlists for fuzzing backup files by analyzing target URLs and applying customizable patterns with dates, extensions, and URL components.

## 🕸 Features

- **Target-Specific**: Generates wordlists based on actual URL components
- **Date Patterns**: Supports year, month, and day ranges for time-based backups
- **Customizable**: Flexible pattern system with JSON configuration
- **Multiple Sources**: Supports wordlists, extensions, and number ranges
- **Fast**: Optimized for performance with large datasets

## 🕸 Installation

### Using NPM (Recommended)

```bash
npm install @spix0r/fback -g
```

### Build From Source

```bash
git clone https://github.com/Spix0r/fback.git
cd fback
chmod +x main.js
npm install . -g
```

## 🕸 Quick Start

Generate a wordlist from a single URL:

```bash
echo "https://example.com/admin/config.php" | fback
```

Generate from multiple URLs with custom patterns:

```bash
fback -l urls.txt -o backup_wordlist.txt -y 2020-2024 -m 1-12
```

## 🕸 Usage

```bash
fback --help
```

### Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `-s, --silent` | Suppress console output | `false` |
| `-u, --update` | Refresh public suffix/TLD list (requires internet) | `false` |
| `-l, --urls <file>` | URLs input file (uses stdin if omitted) | `stdin` |
| `-p, --pattern <file>` | Pattern JSON file | `data/pattern.json` |
| `-w, --wordlist <file>` | Wordlist file | `data/wordlist.txt` |
| `-e, --extension <file>` | Extensions file | `data/extension.txt` |
| `-o, --output <file>` | Output file (uses stdout if omitted) | `stdout` |
| `-n, --numbers <range>` | Number ranges (e.g., "1-100") | - |
| `-y, --year <range>` | Year ranges (e.g., "2020-2024") | - |
| `-m, --month <range>` | Month ranges (1-12) | - |
| `-d, --day <range>` | Day ranges (1-31) | - |

## 🕸 Pattern Variables

FBack uses a flexible pattern system with the following variables:

**Example URL**: `https://www.example.com/admin/dashboard/config.php?id=1`

| Variable | Description | Example Output |
|----------|-------------|----------------|
| `$domain_name` | Domain name only | `example` |
| `$full_domain` | Complete domain | `www.example.com` |
| `$subdomain` | Subdomain part | `www` |
| `$path` | Directory path | `/admin/dashboard` |
| `$full_path` | Complete path with file | `/admin/dashboard/config.php` |
| `$file_name` | File name with extension | `config.php` |
| `$word` | Words from wordlist | `backup`, `old`, `temp` |
| `$num` | Numbers from range | `1`, `2`, `3` |
| `$ext` | Extensions from list | `.bak`, `.old`, `.tmp` |
| `$y` | Years from range | `2023`, `2024` |
| `$m` | Months from range | `01`, `02`, `12` |
| `$d` | Days from range | `01`, `15`, `31` |

### Custom Pattern Configuration

Create a custom `pattern.json` file:

```json
{
  "patterns": [
    "$file_name.$ext",
    "$file_name_$y$m$d.$ext",
    "$path/$word.$ext",
    "$domain_name_$word_$y.$ext"
  ]
}
```

## 🕸 Examples

### Basic Usage

```bash
# Generate wordlist from stdin
echo "https://example.com/admin/config.php" | fback

# Process multiple URLs from file
fback -l target_urls.txt -o wordlist.txt
```

### Advanced Usage

```bash
# Generate comprehensive wordlist with date ranges
fback -l urls.txt \
  -p custom-patterns.json \
  -w security-wordlist.txt \
  -e backup-extensions.txt \
  -y 2020-2024 \
  -m 1-12 \
  -d 1-31 \
  -o comprehensive_wordlist.txt

# Silent mode with number ranges
fback -l urls.txt -s -n 1-1000 -o output.txt
```

### Update Public Suffix List

```bash
# Update TLD list (requires internet connection)
fback -u
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Made with ❤️ by <a href="https://github.com/Spix0r">🕷Spix0r</a></strong>
</p>

<p align="center">
  <em>⭐ Star this repository if you find it useful!</em>
</p>
