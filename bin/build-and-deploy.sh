#!/usr/bin/env bash

npm run build
cp package.json build
cd build || exit 1
npm install --production