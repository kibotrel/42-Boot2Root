#!/usr/bin/python3
index = 'isrveawhobpnutfg'

for i in 'abcdefghijklmnopqrstuvwxyz':
    if index[ord(i) & 0xf] in 'giants':
        print("{} : {}".format(index[ord(i) & 0xf], i))
