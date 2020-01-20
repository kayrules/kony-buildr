#!/bin/sh

if [ $# != 1 ]; then 
    echo 'BUILDR:KONY-PATH-MISSING'
    exit 1
fi

# KonyVEFolder=/Applications/KonyVisualizerEnterprise8.2.0
KonyVEFolder=$1
echo $KonyVEFolder
if [ ! -d "$KonyVEFolder" ]; then
    echo 'BUILDR:KONY-VE-MISSING'
    exit 2
fi

plugins=$KonyVEFolder/Kony_Visualizer_Enterprise/plugins
echo $plugins
if [ ! -d "$plugins" ]; then
    echo 'BUILDR:KONY-PLUGINS-MISSING'
    exit 3
fi

copiedPlugins=$KonyVEFolder/Kony_Visualizer_Enterprise/copiedPlugins
echo $copiedPlugins
if [ ! -d "$copiedPlugins" ]; then 
    echo '-- copying plugins'
    mkdir $copiedPlugins
    cp $plugins/com.kony.desktopweb_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.ios_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.spa_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.studio.viz.core.win64_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.studio.viz.core.win32_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.studio.viz.core.mac64_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.studio.viz.core.mac32_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.thirdparty.jars_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.windows_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.windows8_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.windows10_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.windowsphone8_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.pat.android_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.pat.tabrcandroid_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.cloudmiddleware_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.webcommons_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.mobile.fabric.client.sdk_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.pat.tool.keditor_8.4* $copiedPlugins >/dev/null 2>&1
    cp $plugins/com.kony.cloudthirdparty_8.4* $copiedPlugins >/dev/null 2>&1
fi

echo 'BUILDR:DONE'
exit 0