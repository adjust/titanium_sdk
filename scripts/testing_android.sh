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
rm -rf "${TITANIUM_SUPPORT_PATH}"/modules/android/ti.adjust/*

echo -e "${GREEN}>>> Cleaning project ${NC}"
cd ${ROOT_DIR}
rm -rf android/android/build/*
rm -rf android/android/libs/armeabi-v7a/libti.*
rm -rf android/android/libs/x86/libti.*

echo -e "${GREEN}>>> Removing app from test device ${NC}"
adb uninstall com.adjust.examples || true

echo -e "${GREEN}>>> Building Android JAR file from /ext directory ${NC}"
${ROOT_DIR}/ext/android/build.sh release

echo -e "${GREEN}>>> Building Android module ${NC}"
cd ${ROOT_DIR}/android/android
appc ti build --build-only

echo -e "${GREEN}>>> Unzip module to $TITANIUM_SUPPORT_PATH ${NC}"
unzip -oq dist/ti.adjust*.zip -d "$TITANIUM_SUPPORT_PATH"

echo -e "${GREEN}>>> Built successfully. Run from IDE ${NC}"
