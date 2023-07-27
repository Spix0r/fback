import os
import tldextract
import pathlib
import argparse
import json
import sys
from urllib.parse import urlparse

currentPath = os.path.dirname(os.path.realpath(__file__))
def setup_argparse():
    """
    Parse Command line arguments
    """
    parser = argparse.ArgumentParser(description="Fback")
    parser.add_argument('-l', help='List of urls' , required=True if sys.stdin.isatty() else False)
    parser.add_argument('-p', help='Patterns file path')
    parser.add_argument('-o', help='output file path')
    parser.add_argument('-w', help='Wordlist file path')
    parser.add_argument('-n', help='Numbers ranges in wordlist',type=int,default=3)
    parser.add_argument('-e', help='extension file path')
    parser.add_argument('-yr', help='Years ranges in wordlist')
    parser.add_argument('-mr', help='Months ranges in wordlist')
    parser.add_argument('-dr', help='Days ranges in wordlist')
    return parser.parse_args()

def extract_url_parts(url):
    """
    Extract $domain_name, $subdomain, $tld, $full_domain, $full_path, $path, $file_name
    """
    extractUrl = tldextract.extract(url)
    parsed = urlparse(url)

    domain_name = extractUrl.domain
    subdomain = extractUrl.subdomain
    tld = extractUrl.suffix
    scheme = parsed.scheme

    if subdomain != '':
        full_domain = subdomain + '.' + domain_name + '.' + tld
    else:
        full_domain = domain_name + '.' + tld

    path = os.path.dirname(parsed.path)
    full_path = pathlib.Path(parsed.path)

    file_name = os.path.basename(parsed.path)
    if '.' not in file_name:
        file_name = ''
    
    return {"domain_name": domain_name, "scheme":scheme ,"subdomain": subdomain, "tld": tld, "full_domain": full_domain, "path": path, "full_path": str(full_path) , "file_name": file_name}


def generateVariablesList(args):
    """
    Generate a List for numerical variables Ex : 1999-2002
    """
    if args:
        if "-" in args:
            startEnd = args.split("-")
            return [str(x) for x in range(int(startEnd[0]),int(startEnd[1])+1)]
    
        return [args]
    return None


def readFile(filename,type):
    """
    Read JSON & txt files
    """
    with open(currentPath+"/"+filename,"r") as f:
        
        if type == "list":
            lines = [line.rstrip() for line in f]
            return lines
        
        if type == "json":
            return json.loads(f.read())

def loadPatterns(args):
    """
    Load Pattern file
    """
    filePath = "res/patterns.json"
    if args.p:
        filePath = args.p
    patterns = readFile(filePath,type="json")
    patternList = []
    for pattern in patterns:
        for p in patterns[pattern]:
          patternList.append(p)
    return patternList

def loadUrls(args):
    """
    Load Urls from stdin or arguments
    """
    if not args.l:
        args.l = sys.stdin.read()
        urls = args.l.rstrip().split("\n")
    else:
        urls = readFile(args.l,"list")
    return urls

def staticReplace(pattern,variables):
    """
    Store Static Variables into Patterns
    """
    patterns = []
    for p in pattern:
        s = p.replace('$domain_name', variables["domain_name"])
        s = s.replace('$full_domain', variables["full_domain"]) 
        s = s.replace('$subdomain', variables["subdomain"])
        s = s.replace('$path', variables["path"])
        s = s.replace('$full_path', variables["full_path"])
        s = s.replace('$file_name', variables["file_name"])
        if s not in patterns:
            patterns.append(s)
    return patterns

def dynamicReplace(pattern,repList,name):
    """
    Store Dynamic Variables into Patterns
    """
    patterns = []
    for p in pattern:
        for x in repList:
            s = p.replace(name, str(x))
            if s not in patterns:
                patterns.append(s)
    return patterns

def checkPatternsExtension(pattern):
    """
    Check for $b_ext or $c_ext in pattern
    """
    bext = False
    cext = False

    for p in pattern:
        if "$b_ext" in p:
            bext = True
        if "$c_ext" in p:
            cext = True

    return {"b_ext":bext,"c_ext":cext}

def createWordlist(pattern,wordlist,ext,b_ext,c_ext,args,variables,years,months,days):
    """
    Create wordlist with pattern and all variables
    """

    patterns = staticReplace(pattern,variables)
    patterns = dynamicReplace(patterns,wordlist,"$word")
    patterns = dynamicReplace(patterns,ext,"$ext")
    patterns = dynamicReplace(patterns,[num for num in range(1,args.n+1)],"$num")     
    if years:
        patterns = dynamicReplace(patterns,years,r"%y")
    if months:
        patterns = dynamicReplace(patterns,months,r"%m")
    if days:
        patterns = dynamicReplace(patterns,days,r"%d")
    
    bcExt = checkPatternsExtension([p for p in patterns])

    if bcExt["b_ext"]:
        patterns = dynamicReplace(patterns,b_ext,"$b_ext")
    if bcExt["c_ext"]:
        patterns = dynamicReplace(patterns,c_ext,"$c_ext")

    finallWordlist = cleanResult(patterns,variables["scheme"],variables["full_domain"])
    
    return finallWordlist

def cleanResult(result,scheme,domain):
    """
    Clean results and add url to wordlist items
    """
    cleaned = []
    for word in result:
        if "//" in word:
            word = word.replace("//","/")
        if word[0] == "/":
            cleaned.append(scheme+"://"+domain+word)
        else:
            cleaned.append(scheme+"://"+domain+"/"+word)

    return cleaned

def saveResults(results,args):
    """
    Save results to a file
    """
    if args.o:
        with open(args.o,'w') as f:
            for i in results:
                if "%" not in i and "$" not in i:
                    f.write(i+"\n")
def main():
    """
    The main function
    """
    args = setup_argparse()
    patterns = loadPatterns(args)
    wordlist = readFile(args.w,type="list") if args.w else ["web", "fullbackup", "backup", "data", "site", "assets", "logs", "debug", "install"]
    b_ext = ["bpa", "bak", "swp", "~", "tmp", "bckp", "new", "spg", "acp", "bkup", "backup", "bak3", "bkz", "abu", "bdb", "blend", "backupdb", "sav", "save", "orig", "tig", "sh", "bck", "bk", "bash", "copy", "backup1", "bakx", "npf", "log", "old", "bundle", "adi", "mbk", "ba", "bak2", "bps", "pack", "abk", "back"]
    c_ext = ["zip", "rar", "7z", "tar", "gzip", "bzip", "bz", "tar.xz", "pkg.tar.xz", "tg", "tar.gz", "tar.bzip", "tsv.gz", "gz", "dz", "tbz", "pkg"]
    ext = b_ext + c_ext
    years = generateVariablesList(args.yr)
    months = generateVariablesList(args.mr)
    days = generateVariablesList(args.dr)
    urls = loadUrls(args)

    results = []
    for url in urls:
        variables = extract_url_parts(url)
        result = createWordlist(patterns,wordlist,ext,b_ext,c_ext,args,variables,years,months,days)
        results += result

    results = set(list(results))
    saveResults(results,args)
    for res in results:
        if "%" not in res and "$" not in res:
            print(res)

if __name__ == "__main__":
  main()