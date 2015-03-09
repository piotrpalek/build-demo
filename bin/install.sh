#!/bin/bash

path=${1:-"../../"}     # path is the target folder. By default it's ../../

node ./index "$path"    # running against the folder containing node_modules/build-demo
cd "${path}tmp"         # cd to tmp in there
npm install             # npm
jspm init               # init
jspm install            # install

jspm install ember=github:components/ember@1.11.0-beta.5 -o overrides/ember.json
