#!/usr/bin/python3

import os, re

fileContent = {}

for file in os.listdir("./ft_fun/"):
    with open("./ft_fun/%s" % file, 'r') as f:
        thisFile = f.read()
        f.close()
    fileNumber = re.findall('//file([0-9]*)', thisFile)
    fileContent[int(fileNumber[0])] = thisFile
if os.path.exists('./main.c') is True:
    os.remove('./main.c')
with open('./main.c', 'w') as f:
    for key in sorted(fileContent):
        f.write(fileContent[key] +'\n')
    f.close()
