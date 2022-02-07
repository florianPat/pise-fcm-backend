#!/usr/bin/env bash

# Exit on error. Append "|| true" if you expect an error.
set -o errexit
# Exit on error inside any functions or subshells.
set -o errtrace
# Do not allow use of undefined vars. Use ${VAR:-} to use an undefined VAR
set -o nounset
# Catch the error in case mysqldump fails (but gzip succeeds) in `mysqldump |gzip`
set -o pipefail

echo '>>> NPM version:'
npm --version
echo '>>> Deta version:'
deta version

echo '>>> Lint code'
npm run lint
echo '>>> Run unit tests'
npm run test
echo '>>> Run e2e tests'
npm run test:e2e
echo '>>> Running build'
npm run build
echo '>>> copy deta micro target and rename file for deta...'
cp -r .deta/ dist/.deta
cp package.json dist/
cp package-lock.json dist/
mv dist/main.js dist/index.js

echo '>>> Deploy "dist" to deta'
cd dist
deta deploy
cd ..

echo '>>> Restore dir to state before build...'
mv dist/index.js dist/main.js
rm dist/package.json
rm dist/package-lock.json

echo '>>> Update environment variables to deta'
deta update --env .env
