#!/usr/bin/env bash

set -e

# ======================================== #

# Colors for output
NC='\033[0m'
RED='\033[0;31m'
CYAN='\033[1;36m'
GREEN='\033[0;32m'

# ======================================== #

# Directories and paths of interest for the script.
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPTS_DIR")"
TEST_MODULE_DIR=${ROOT_DIR}/test/module
TEST_APP_DIR=${ROOT_DIR}/test/app

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Setting Titanium SDK to 7.2.0.GA ... ${NC}"
appc ti sdk select 7.2.0.GA
echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Removing android module from ${TITANIUM_SUPPORT_PATH} ... ${NC}"
rm -rf "${TITANIUM_SUPPORT_PATH}"/modules/android/ti.adjust.test/*
echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Cleaning project ... ${NC}"
cd ${TEST_MODULE_DIR}
rm -rf android/android/build/*
rm -rf android/android/libs/armeabi-v7a/libti.*
rm -rf android/android/libs/x86/libti.*
echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Removing app from test device/emulator ... ${NC}"
adb uninstall com.adjust.examples || true
echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Building Adjust SDK JAR file ... ${NC}"
${ROOT_DIR}/ext/android/build-test.sh
echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Building Android module ... ${NC}"
cd ${TEST_MODULE_DIR}/android/android
appc ti build --build-only
echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Extracting module to ${TITANIUM_SUPPORT_PATH} ... ${NC}"
unzip -oq dist/ti.adjust.test*.zip -d "${TITANIUM_SUPPORT_PATH}"
echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Success. Run from IDE or: ${NC}"
echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Emulator: cd example; appc ti build -p android -T emulator ${NC}"
echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Device: cd example; appc ti build -p android -T device ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${GREEN} Script completed! ${NC}"
