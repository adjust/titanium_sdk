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
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$ROOT_DIR")"
ROOT_DIR="$(dirname "$ROOT_DIR")"
BUILD_DIR=ext/android/sdk/Adjust
JAR_IN_DIR=testlibrary/build/outputs
JAR_OUT_DIR=test/module/android/android/lib
cd $ROOT_DIR

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][BUILD-TEST]:${GREEN} Running Gradle tasks: clean makeJar ... ${NC}"
cd $BUILD_DIR
./gradlew clean :testlibrary:makeJar
echo -e "${CYAN}[ADJUST][ANDROID][BUILD-TEST]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][BUILD-TEST]:${GREEN} Moving test library JAR from ${JAR_IN_DIR} to ${JAR_OUT_DIR} ... ${NC}"
mv -v ${JAR_IN_DIR}/*.jar ${ROOT_DIR}/${JAR_OUT_DIR}/adjust-testing.jar
echo -e "${CYAN}[ADJUST][ANDROID][BUILD-TEST]:${GREEN} Done! ${NC}"

# ======================================== #

echo -e "${CYAN}[ADJUST][ANDROID][BUILD-TEST]:${GREEN} Script completed! ${NC}"

# ======================================== #