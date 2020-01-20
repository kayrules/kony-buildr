#!/bin/sh

if [ $# != 2 ]; then 
    echo 'BUILDR:KONY-INSTALL-PATH-MISSING'
    exit 1
fi

ANDROID=$1
PATH=$2

APK=$PATH/binaries/android/luavmandroid.apk
AAPT=$ANDROID/build-tools/28.0.3/aapt
ADB=$ANDROID/platform-tools/adb

if [ ! -f $APK ]; then
    echo 'BUILDR:KONY-INSTALL-APK-MISSING'
    exit 2
else
    echo "-- Installing APK from: $APK"
    # -- install apk
    $ADB install -r $APK

    # -- run in simulator
    pkg=$($AAPT dump badging $APK|/usr/bin/awk -F" " '/package/ {print $2}'|/usr/bin/awk -F"'" '/name=/ {print $2}')
    act=$($AAPT dump badging $APK|/usr/bin/awk -F" " '/launchable-activity/ {print $2}'|/usr/bin/awk -F"'" '/name=/ {print $2}')
    $ADB shell am start -n $pkg/$act
fi

exit 0