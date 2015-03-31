#!/bin/bash

path=${1:-"../../"}     # path is the target folder. By default it's ../../

node ./index "$path"    # running against the folder containing node_modules/build-demo
cd "${path}tmp"         # cd to tmp in there
npm install             # npm
jspm install            # install
