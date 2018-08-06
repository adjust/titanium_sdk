#!/usr/bin/env bash

set -e

# ======================================== #

# Colors for output
NC='\033[0m'
RED='\033[0;31m'
CYAN='\033[1;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'

# ======================================== #

# Usage hint in case of wrong invocation.
if [ $# -ne 2 ] && [ $# -ne 3 ]; then
    echo -e "${CYAN}[ADJUST][IOS][BUILD]:${YELLOW} Usage: ./build.sh [debug || release] [private || public] [optional: --with-test-lib] ${NC}"
    exit 1
fi

BUILD_TYPE=$1
REPO_TYPE=$2

# ======================================== #

# Directories and paths of interest for the script.
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$ROOT_DIR")"
ROOT_DIR="$(dirname "$ROOT_DIR")"

if [ "$REPO_TYPE" == "public" ]; then
    BUILD_DIR_SDK=ext/ios/sdk/
    BUILD_DIR_TEST=ext/ios/sdk/AdjustTests/AdjustTestLibrary
    REPO_TYPE_UC="PUBLIC"
elif [ "$REPO_TYPE" == "private" ]; then
    BUILD_DIR_SDK=ext/ios/sdk-dev/
    BUILD_DIR_TEST=ext/ios/sdk-dev/AdjustTests/AdjustTestLibrary
    REPO_TYPE_UC="PRIVATE"
fi
if [ "$BUILD_TYPE" == "debug" ]; then
    BUILD_TYPE_UC="DEBUG"
elif [ "$BUILD_TYPE" == "release" ]; then
    REPO_TYPE_UC="RELEASE"
fi

OUT_DIR_SDK=ios/ios/platform
OUT_DIR_TEST=test/module/ios/ios/platform

# ======================================== #

echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Deleting old AdjustSdk.framework file ... ${NC}"
cd ${ROOT_DIR}
rm -rfv ${ROOT_DIR}/${OUT_DIR_SDK}/AdjustSdk.framework
rm -rfv ${ROOT_DIR}/${BUILD_DIR_SDK}/Frameworks/Static/AdjustSdk.framework
echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"

# ======================================== #

if [ $# -eq 3 ] && [ $3 == --with-test-lib ]; then
	echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Deleting old AdjustTestLibrary.framework file ... ${NC}"
	rm -rfv ${ROOT_DIR}/${OUT_DIR_TEST}/AdjustTestLibrary.framework
	rm -rfv ${ROOT_DIR}/${BUILD_DIR_TEST}/Frameworks/Static/AdjustTestLibrary.framework
	echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"
fi

# ======================================== #

echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Rebuilding AdjustSdk.framework file ... ${NC}"
cd ${ROOT_DIR}/${BUILD_DIR_SDK}
if [ "$BUILD_TYPE" == "debug" ]; then
    xcodebuild -target AdjustStatic -configuration Debug clean build
elif [ "$BUILD_TYPE" == "release" ]; then
    xcodebuild -target AdjustStatic -configuration Release clean build
fi
echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"

# ======================================== #

if [ $# -eq 3 ] && [ $3 == --with-test-lib ]; then
	echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Rebuilding AdjustTestLibrary.framework file ... ${NC}"
    cd ${ROOT_DIR}/${BUILD_DIR_TEST}
    if [ "$BUILD_TYPE" == "debug" ]; then
	    xcodebuild -target AdjustTestLibraryStatic -configuration Debug clean build
	elif [ "$BUILD_TYPE" == "release" ]; then
	    xcodebuild -target AdjustTestLibraryStatic -configuration Release clean build
	fi
	echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"
fi

# ======================================== #

echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Copying AdjustSdk.framework to ${ROOT_DIR}/${OUT_DIR_SDK} and ${ROOT_DIR}/${OUT_DIR_TEST} ... ${NC}"
cd ${ROOT_DIR}/${BUILD_DIR_SDK}
cp -Rv Frameworks/Static/AdjustSdk.framework ${ROOT_DIR}/${OUT_DIR_SDK}
echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"

# ======================================== #

if [ $# -eq 3 ] && [ $3 == --with-test-lib ]; then
	echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Copying AdjustTestLibrary.framework to ${ROOT_DIR}/${OUT_DIR_TEST} ... ${NC}"
	cp -Rv Frameworks/Static/AdjustTestLibrary.framework ${ROOT_DIR}/${OUT_DIR_TEST}
	echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"
fi

# ======================================== #

echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Removing symlinks from AdjustSdk.framework ... ${NC}"
cd ${ROOT_DIR}/${OUT_DIR_SDK}/AdjustSdk.framework
rm -rfv AdjustSdk && rm -rfv Headers && mv -v Versions/A/AdjustSdk . && mv -v Versions/A/Headers . && rm -rfv Versions
echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"

# ======================================== #

if [ $# -eq 3 ] && [ $3 == --with-test-lib ]; then
	echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Removing symlinks from AdjustTestLibrary.framework ... ${NC}"
	cd ${ROOT_DIR}/${OUT_DIR_TEST}/AdjustTestLibrary.framework
	rm -rfv AdjustTestLibrary && rm -rfv Headers && mv -v Versions/A/AdjustTestLibrary . && mv -v Versions/A/Headers . && rm -rfv Versions
	echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"
fi

# ======================================== #

echo -e "${CYAN}[ADJUST][IOS][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Script completed! ${NC}"
