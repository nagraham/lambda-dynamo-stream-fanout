#!/usr/bin/env bash

# Since I write code with an IDE on Windows, but use Ubuntu (on Windows) to do
# stuff, I like to use this script to wipe out windows return characters
find {lib,bin,src,test}/ package* tsconfig* -type f | xargs  sed -i -e 's/\r//g'
