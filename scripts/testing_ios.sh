#!/usr/bin/env bash

# Exit if any errors occur
set -e

# Get the current directory (/scripts/ directory)
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Traverse up to get to the root directory
ROOT_DIR="$(dirname "$SCRIPTS_DIR")"

RED='\033[0;31m' # Red color
GREEN='\033[0;32m' # Green color
NC='\033[0m' # No Color

echo -e "${GREEN}>>> Setting Titanium SDK to 7.0.0.GA ${NC}"
appc ti sdk select 7.0.0.GA

echo -e "${GREEN}>>> Removing ios module from $TITANIUM_SUPPORT_PATH ${NC}"
rm -rf "${TITANIUM_SUPPORT_PATH}"/modules/iphone/ti.adjust/*

echo -e "${GREEN}>>> Cleaning project ${NC}"
cd ${ROOT_DIR}
rm -rf ios/ios/build/*

echo -e "${GREEN}>>> Building Framework file from /ext directory ${NC}"
${ROOT_DIR}/ext/ios/build.sh release

echo -e "${GREEN}>>> Building ios module ${NC}"
cd ${ROOT_DIR}/ios/ios
appc ti build --build-only

echo -e "${GREEN}>>> Unzip module to $TITANIUM_SUPPORT_PATH ${NC}"
unzip -oq ti.adjust*.zip -d "$TITANIUM_SUPPORT_PATH"

echo -e "${GREEN}>>> Built successfully. Run from IDE or: ${NC}"
echo -e "${GREEN}>>> Simulator: \`cd example; appc ti build -p ios -T simulator\` ${NC}"
echo -e "${GREEN}>>> Device: \`cd example; appc ti build -p ios -T device\` ${NC}"
