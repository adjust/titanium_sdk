#!/usr/bin/env bash

# Get the current directory
SDK_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Traverse up to get to the root directory
SDK_DIR="$(dirname "$SDK_DIR")"
SDK_DIR="$(dirname "$SDK_DIR")"

BUILD_DIR=${SDK_DIR}/ext/android/sdk/Adjust
OUT_DIR=${SDK_DIR}/ext/android/sdk/Adjust/adjust/build/outputs

# Go to the build directory to execute gradle tasks
cd $BUILD_DIR

# Run gradle tasks
./gradlew clean clearJar makeJar

# Move generated Adjust SDK JAR to Titanium Android module destination folder
mv -v ${OUT_DIR}/*.jar ${SDK_DIR}/android/android/lib/adjust-android.jar
