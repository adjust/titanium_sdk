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

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Setting Titanium SDK to 7.2.0.GA ... ${NC}"
appc ti sdk select 7.2.0.GA
echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Removing android module from ${TITANIUM_SUPPORT_PATH} ... ${NC}"
rm -rf "${TITANIUM_SUPPORT_PATH}"/modules/android/ti.adjust/*
echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Cleaning project ... ${NC}"
cd ${ROOT_DIR}
rm -rf android/android/build/*
rm -rf android/android/libs/armeabi-v7a/libti.*
rm -rf android/android/libs/x86/libti.*
echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Removing app from test device/emulator ... ${NC}"
adb uninstall com.adjust.examples || true
echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Building Adjust SDK JAR file ... ${NC}"
${ROOT_DIR}/ext/android/build-sdk.sh release
echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Building Android module ... ${NC}"
cd ${ROOT_DIR}/android/android
appc ti build --build-only
echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Extracting module to ${TITANIUM_SUPPORT_PATH} ... ${NC}"
unzip -oq dist/ti.adjust*.zip -d "${TITANIUM_SUPPORT_PATH}"
echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Success. Run from IDE or: ${NC}"
echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Emulator: cd example; appc ti build -p android -T emulator ${NC}"
echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Device: cd example; appc ti build -p android -T device ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Script completed! ${NC}"
