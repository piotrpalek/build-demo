#!/bin/bash

gulp build
mkdir -p ../gh-pages/demo
mv dist/* ../gh-pages/demo

cd ..

git add gh-pages
git commit -m 'GH-PAGES UPDATE'
git subtree push --prefix gh-pages origin gh-pages
