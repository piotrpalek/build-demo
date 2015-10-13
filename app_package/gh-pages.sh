#!/bin/bash

gulp build
mkdir -p ../gh-pages/demo
mv dist/* ../gh-pages/demo

cd ..

git add gh-pages --all --force
git commit -m 'GH-PAGES UPDATE' -a
git subtree split --prefix gh-pages -b gh-pages
git push -f origin gh-pages:gh-pages
git branch -D gh-pages

rm -rf gh-pages
