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

echo -e "${CYAN}[ADJUST][IOS][EXAMPLE]:${GREEN} Setting Titanium SDK to 7.2.0.GA ... ${NC}"
appc ti sdk select 7.2.0.GA
echo -e "${CYAN}[ADJUST][IOS][EXAMPLE]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][IOS][EXAMPLE]:${GREEN} Removing ios module from ${TITANIUM_SUPPORT_PATH} ... ${NC}"
rm -rf "${TITANIUM_SUPPORT_PATH}"/modules/iphone/ti.adjust
echo -e "${CYAN}[ADJUST][IOS][EXAMPLE]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][IOS][EXAMPLE]:${GREEN} Cleaning project ... ${NC}"
cd ${ROOT_DIR}
rm -rf ios/ios/build/*
echo -e "${CYAN}[ADJUST][IOS][EXAMPLE]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][IOS][EXAMPLE]:${GREEN} Building Adjust.framework file ... ${NC}"
${ROOT_DIR}/ext/ios/build-sdk.sh release
echo -e "${CYAN}[ADJUST][IOS][EXAMPLE]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][IOS][EXAMPLE]:${GREEN} Building iOS module ... ${NC}"
cd ${ROOT_DIR}/ios/ios
appc ti build --build-only
echo -e "${CYAN}[ADJUST][IOS][EXAMPLE]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Extracting module to ${TITANIUM_SUPPORT_PATH} ... ${NC}"
unzip -oq ti.adjust*.zip -d "${TITANIUM_SUPPORT_PATH}"
echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Success. Run from IDE or: ${NC}"
echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Emulator: cd example; appc ti build -p ios -T simulator ${NC}"
echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Device: cd example; appc ti build -p ios -T device ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${GREEN} Script completed! ${NC}"
