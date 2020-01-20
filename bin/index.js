#!/usr/bin/env node

const fs = require('fs');
const shell = require('shelljs');
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const source = __dirname + '/../lib';
const dest = process.cwd();

var konyVEFolder = '/Applications/KonyVisualizerEnterprise8.2.0';
var androidHome = process.env.ANDROID_HOME;
var cleanFlag = '-clean';

var args = process.argv.slice(2);
if(args[0] != cleanFlag) {
    cleanFlag = '';
}

function prepare(done) {
    rl.question('Please enter KonyVisualizerEnterprise8.2.0 path:[' + konyVEFolder + '] ', function(folder1) {
        if(folder1 != '') {
            if(!fs.existsSync(folder1)) {
                console.log('-- path `' + folder1 + '` not exist. process terminated!');
                process.exit(0);
            }
            konyVEFolder = folder1;
        }
        rl.question('Please enter ANDROID_HOME path:[' + androidHome + '] ', function(folder2) {
            if(folder2 != '') {
                if(!fs.existsSync(folder2)) {
                    console.log('-- path `' + folder2 + '` not exist. process terminated!');
                    process.exit(0);
                }
                androidHome = folder2;
            }
            rl.close();
        });
    });

    rl.on("close", function() {
        console.log('- konyVEFolder: ' + konyVEFolder);
        console.log('- androidHome: ' + androidHome);
        
        shell.exec('sh ' + source + '/prepare.sh ' + konyVEFolder, function(code, stdout, stderr) {
            if(code == 0) done();
        });
    });
}

function copyFile(source, target, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function (err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function (err) {
        done(err);
    });
    wr.on("close", function (ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

function copyFiles(done) {
    console.log('2. Copy required files.');
    var files = [
        '/build.js',
        '/package.json',
    ];

    var counter = 0;
    files.map(function (f, i) {
        copyFile(source + f, dest + f, () => {
            console.log(f + ' copied.');
            counter++;
            if(counter == 2) {
                done()
            }
        });
    });
}

function updateProperties(done) {
    console.log('3. Replacing params in ' + file);
    var pluginDir = konyVEFolder + '/Kony_Visualizer_Enterprise/copiedPlugins';
    var javaLoc = konyVEFolder + '/jdk.jdk/Contents/Home';

    var file = dest + '/HeadlessBuild.properties';
    shell.exec('cp HeadlessBuild.properties HeadlessBuild-backup.properties');

    var props = [
        {
            find: '^iphone=true',
            replace: 'iphone=false',
        },
        {
            find: '^android=false',
            replace: 'android=true',
        },
        {
            find: '^plugin.dir=.*',
            replace: 'plugin.dir=' + pluginDir,
        },
        {
            find: '^javaloc=.*',
            replace: 'javaloc=' + javaLoc,
        },
        {
            find: '^androidHome=.*',
            replace: 'androidHome=' + androidHome,
        },
    ];

    props.map(function (p, i) {
        shell.sed('-i', p.find, p.replace, file);
    });

    done();
}

function buildAPK(done) {
    console.log('4. building apk.');
    shell.exec('npm install');
    shell.exec('node build.js ' + cleanFlag);
    // shell.exec('node build.js -clean');

    done();
}

function installAPK(done) {
    console.log('5. installing apk.');
    shell.exec('sh ' + source + '/installApk.sh ' + androidHome + ' ' + dest, function(code, stdout, stderr){
        if(code == 0) done();
    });
}

function cleanup() {
    console.log('6. cleanup.');
    shell.exec('rm package.json package-lock.json');
    shell.exec('mv HeadlessBuild-backup.properties HeadlessBuild.properties');
    console.log('DONE');
    process.exit(0);
}

prepare(function(){
    copyFiles(function(){
        updateProperties(function(){
            buildAPK(function(){
                installAPK(cleanup);
            });
        });
    });
});