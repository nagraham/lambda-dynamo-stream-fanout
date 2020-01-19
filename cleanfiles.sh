#!/usr/bin/env bash

# wipe out windows return characters
find {lib,bin,src,test}/ package* tsconfig* -type f | xargs  sed -i -e 's/\r//g'
