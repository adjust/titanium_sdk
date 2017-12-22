if [ $# -ne 1 ]; then
    echo $0: "usage: ./build.sh [debug || release]"
    exit 1
fi

BUILD_TYPE=$1

# Get the current directory (ext/android/)
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Traverse up to get to the root directory
ROOT_DIR="$(dirname "$ROOT_DIR")"
ROOT_DIR="$(dirname "$ROOT_DIR")"
BUILD_DIR=ext/android/sdk/Adjust
JAR_OUT_DIR=android/android/lib

RED='\033[0;31m' # Red color
GREEN='\033[0;32m' # Green color
NC='\033[0m' # No Color

cd $ROOT_DIR/$BUILD_DIR

if [ "$BUILD_TYPE" == "debug" ]; then
    JAR_IN_DIR=adjust/build/intermediates/bundles/debug
    echo -e "${GREEN}>>> Running Gradle tasks: makeDebugJar${NC}"
    ./gradlew makeDebugJar

elif [ "$BUILD_TYPE" == "release" ]; then
    JAR_IN_DIR=adjust/build/intermediates/bundles/release
    echo -e "${GREEN}>>> Running Gradle tasks: makeReleaseJar${NC}"
    ./gradlew makeReleaseJar
fi

echo -e "${GREEN}>>> Moving the jar from ${JAR_IN_DIR} to ${JAR_OUT_DIR} ${NC}"
mv -v ${JAR_IN_DIR}/*.jar ${ROOT_DIR}/${JAR_OUT_DIR}/adjust-android.jar
