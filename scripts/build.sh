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
if [ $# -ne 4 ] ; then
    echo -e "${CYAN}[ADJUST][BUILD]:${YELLOW} Usage: ./build.sh [ios || android] [example || test] [debug || release] [private || public] ${NC}"
    exit 1
fi

PLATFORM=$1
APP_TYPE=$2
BUILD_TYPE=$3
REPO_TYPE=$4

# ======================================== #

# Directories and paths of interest for the script.
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPTS_DIR")"

if [ "$REPO_TYPE" == "public" ]; then
    REPO_TYPE_UC="PUBLIC"
elif [ "$REPO_TYPE" == "private" ]; then
    REPO_TYPE_UC="PRIVATE"
fi
if [ "$BUILD_TYPE" == "debug" ]; then
    BUILD_TYPE_UC="DEBUG"
elif [ "$BUILD_TYPE" == "release" ]; then
    REPO_TYPE_UC="RELEASE"
fi

TEST_MODULE_DIR=${ROOT_DIR}/test/module
TEST_APP_DIR=${ROOT_DIR}/test/app

# ======================================== #

echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Setting Titanium SDK to 7.2.0.GA ... ${NC}"
appc ti sdk select 7.2.0.GA
echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"

# ======================================== #

if [ "$PLATFORM" == "android" ]; then
	if [ "$APP_TYPE" == "example" ]; then
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Removing example app from test device/emulator ... ${NC}"
		adb uninstall com.adjust.examples || true
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"
	elif [ "$APP_TYPE" == "test" ]; then
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Removing test app from test device/emulator ... ${NC}"
		adb uninstall com.adjust.testapp || true
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"
	fi
fi

# ======================================== #

if [ "$PLATFORM" == "android" ]; then
	echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Removing SDK android module from ${TITANIUM_SUPPORT_PATH} ... ${NC}"
	rm -rf "${TITANIUM_SUPPORT_PATH}"/modules/android/ti.adjust/*
	echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"

	if [ "$APP_TYPE" == "test" ]; then
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Removing test library android module from ${TITANIUM_SUPPORT_PATH} ... ${NC}"
		rm -rf "${TITANIUM_SUPPORT_PATH}"/modules/android/ti.adjust.test/*
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"
	fi
elif [ "$PLATFORM" == "ios" ]; then
	# iOS to come.
	echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} iOS to come! ${NC}"
fi

# ======================================== #

if [ "$PLATFORM" == "android" ]; then
	echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Cleaning SDK module project ... ${NC}"
	cd ${ROOT_DIR}
	rm -rf android/android/build/*
	rm -rf android/android/libs/armeabi-v7a/libti.*
	rm -rf android/android/libs/x86/libti.*
	echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"

	if [ "$APP_TYPE" == "test" ]; then
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Cleaning test library module project ... ${NC}"
		cd ${TEST_MODULE_DIR}
		rm -rf android/android/build/*
		rm -rf android/android/libs/armeabi-v7a/libti.*
		rm -rf android/android/libs/x86/libti.*
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"
	fi
elif [ "$PLATFORM" == "ios" ]; then
	# iOS to come.
	echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} iOS to come! ${NC}"
fi

# ======================================== #

if [ "$PLATFORM" == "android" ]; then
	if [ "$APP_TYPE" == "example" ]; then
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Building Adjust SDK JAR file ... ${NC}"
		if [ "$BUILD_TYPE" == "debug" ]; then
			if [ "$REPO_TYPE" == "private" ]; then
				${ROOT_DIR}/ext/android/build.sh debug private
			elif [ "$REPO_TYPE" == "public" ]; then
				${ROOT_DIR}/ext/android/build.sh debug public
			fi
		elif [ "$BUILD_TYPE" == "release" ]; then
			if [ "$REPO_TYPE" == "private" ]; then
				${ROOT_DIR}/ext/android/build.sh release private
			elif [ "$REPO_TYPE" == "public" ]; then
				${ROOT_DIR}/ext/android/build.sh release public
			fi
		fi
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"
	elif [ "$APP_TYPE" == "test" ]; then
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Building Adjust SDK and test library JAR file ... ${NC}"
		if [ "$BUILD_TYPE" == "debug" ]; then
			if [ "$REPO_TYPE" == "private" ]; then
				${ROOT_DIR}/ext/android/build.sh debug private --with-test-lib
			elif [ "$REPO_TYPE" == "public" ]; then
				${ROOT_DIR}/ext/android/build.sh debug public --with-test-lib
			fi
		elif [ "$BUILD_TYPE" == "release" ]; then
			if [ "$REPO_TYPE" == "private" ]; then
				${ROOT_DIR}/ext/android/build.sh release private --with-test-lib
			elif [ "$REPO_TYPE" == "public" ]; then
				${ROOT_DIR}/ext/android/build.sh release public --with-test-lib
			fi
		fi
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"
	fi
elif [ "$PLATFORM" == "ios" ]; then
	# iOS to come.
	echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} iOS to come! ${NC}"
fi

# ======================================== #

if [ "$PLATFORM" == "android" ]; then
	echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Building SDK android module ... ${NC}"
	cd ${ROOT_DIR}/android/android
	appc ti build --build-only
	echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"

	echo -e "${CYAN}[ADJUST][ANDROID][EXAMPLE]:${YELLOW} Extracting SDK module to ${TITANIUM_SUPPORT_PATH} ... ${NC}"
	unzip -oq dist/ti.adjust*.zip -d "${TITANIUM_SUPPORT_PATH}"
	echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"

	if [ "$APP_TYPE" == "test" ]; then
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Building test library android module ... ${NC}"
		cd ${TEST_MODULE_DIR}/android/android
		appc ti build --build-only
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"

		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Extracting module to ${TITANIUM_SUPPORT_PATH} ... ${NC}"
		unzip -oq dist/ti.adjust.test*.zip -d "${TITANIUM_SUPPORT_PATH}"
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Done! ${NC}"
	fi
elif [ "$PLATFORM" == "ios" ]; then
	# iOS to come.
	echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} iOS to come! ${NC}"
fi

if [ "$PLATFORM" == "android" ]; then
	if [ "$APP_TYPE" == "example" ]; then
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Run from IDE or: ${NC}"
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Emulator: cd ${ROOT_DIR}/example; appc ti build -p android -T emulator ${NC}"
		echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Device: cd ${ROOT_DIR}/example; appc ti build -p android -T device ${NC}"
	elif [ "$APP_TYPE" == "test" ]; then
		echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${YELLOW} Run from IDE or: ${NC}"
		echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${YELLOW} Emulator: cd ${ROOT_DIR}/test/app; appc ti build -p android -T emulator ${NC}"
		echo -e "${CYAN}[ADJUST][ANDROID][TEST]:${YELLOW} Device: cd ${ROOT_DIR}/test/app; appc ti build -p android -T device ${NC}"
	fi
elif [ "$PLATFORM" == "ios" ]; then
	# iOS to come.
	echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} iOS to come! ${NC}"
fi

# ======================================== #

echo -e "${CYAN}[ADJUST][BUILD][$REPO_TYPE_UC][$BUILD_TYPE_UC]:${YELLOW} Script completed! ${NC}"
