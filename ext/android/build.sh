#!/usr/bin/env bash

set -e

# ======================================== #

# Colors for output
NC='\033[0m'
RED='\033[0;31m'
CYAN='\033[1;36m'
GREEN='\033[0;32m'

# ======================================== #

# Usage hint in case of wrong invocation.
if [ $# -ne 2 ] && [ $# -ne 3 ]; then
    echo -e "${CYAN}[ADJUST][ANDROID][BUILD]:${GREEN} Usage: ./build.sh [debug || release] [private || public] [optional: --with-test-lib] ${NC}"
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
    BUILD_DIR=ext/android/sdk/Adjust
    REPO_TYPE_UC="PUBLIC"
elif [ "$REPO_TYPE" == "private" ]; then
    BUILD_DIR=ext/android/sdk-dev/Adjust
    REPO_TYPE_UC="PRIVATE"
fi
if [ "$BUILD_TYPE" == "debug" ]; then
    BUILD_TYPE_UC="DEBUG"
elif [ "$BUILD_TYPE" == "release" ]; then
    BUILD_TYPE_UC="RELEASE"
fi

JAR_OUT_DIR_SDK=android/android/lib
JAR_OUT_DIR_TEST=test/module/android/android/lib

# ======================================== #

# Move to Adjust directory.
cd ${ROOT_DIR}/${BUILD_DIR}

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${GREEN} Running clean and makeDebugJar Gradle tasks for Adjust SDK project ... ${NC}"
if [ "$BUILD_TYPE" == "debug" ]; then
    JAR_IN_DIR_SDK=adjust/build/intermediates/bundles/debug
    ./gradlew clean makeDebugJar
    echo -e "${CYAN}[ADJUST][ANDROID][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${GREEN} Done! ${NC}"
elif [ "$BUILD_TYPE" == "release" ]; then
    JAR_IN_DIR_SDK=adjust/build/intermediates/bundles/release
    ./gradlew clean makeReleaseJar
    echo -e "${CYAN}[ADJUST][ANDROID][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${GREEN} Done! ${NC}"
fi

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${GREEN} Copying Android SDK JAR from ${JAR_IN_DIR_SDK} to ${JAR_OUT_DIR_SDK} ... ${NC}"
cp -v ${JAR_IN_DIR_SDK}/*.jar ${ROOT_DIR}/${JAR_OUT_DIR_SDK}/adjust-android.jar
echo -e "${CYAN}[ADJUST][ANDROID][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${GREEN} Done! ${NC}"

# ======================================== #

if [ $# -eq 3 ] && [ $3 == --with-test-lib ]; then
    echo -e "${CYAN}[ADJUST][ANDROID][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${GREEN} Running clean and makeJar Gradle tasks for Adjust test library project ... ${NC}"
    ./gradlew clean makeJar
    if [ "$BUILD_TYPE" == "debug" ]; then
        JAR_IN_DIR_TEST=testlibrary/build/intermediates/bundles/debug
    else
        JAR_IN_DIR_TEST=testlibrary/build/intermediates/bundles/release
    fi
    echo -e "${CYAN}[ADJUST][ANDROID][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${GREEN} Done! ${NC}"

    # ======================================== #

    echo -e "${CYAN}[ADJUST][ANDROID][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${GREEN} Copying Testing JAR from ${JAR_IN_DIR_TEST} to ${PROXY_DIR} ... ${NC}"
    cp -v ${JAR_IN_DIR_TEST}/*.jar ${ROOT_DIR}/${JAR_OUT_DIR_TEST}/adjust-testing.jar
    echo -e "${CYAN}[ADJUST][ANDROID][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${GREEN} Done! ${NC}"
fi

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${GREEN} Script completed! ${NC}"
