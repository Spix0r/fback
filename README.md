# FBack

Back is a Python script that generates customized wordlists for fuzzing backup files. It takes a JSON-based pattern file and seed wordlist as input. These patterns are applied to the provided seed wordlist to generate all possible combinations and variations based on the defined rules.

## Options

    -l - List of urls (required if not piped from stdin)
    -p - Path to patterns file (default: res/patterns.json)
    -o - Output file path
    -w - Wordlist file path (default: common words)
    -n - Number ranges in wordlist (default: 1-3)
    -e - Extensions file path
    -yr - Year ranges in wordlist
    -mr - Month ranges in wordlist
    -dr - Day ranges in wordlist

## Patterns

Patterns are loaded from the patterns.json file or custom file specified with -p.

The patterns support variable replacement:

    $domain_name - Replaced with domain name
    $full_domain - Replaced with full_domain name
    $subdomain - Replaced with subdomain
    $path - Replaced with directory path
    $full_path - Replaced with full_path
    $file_name - Replaced with file name
    $word - Replaced with words from wordlist
    $num - Replaced with numbers from range
    $b_ext - Replaced with backup extensions
    $c_ext - Replaced with compress extensions
    $ext - Replaced with all extensions
    %y - Replaced with years from range
    %m - Replaced with months from range
    %d - Replaced with days from range

## Usage

```bash
echo "https://example.com/path/file" | python fback.py -p custom.json -o fbackout.txt -yr 2022-2023 -mr 1-12 -dr 1-31
```
Generate wordlist from URL list:
```bash
python fback.py -l urls.txt -w mywords.txt -e extensions.txt -yr 2000-2020 -o fbackout.txt
```
