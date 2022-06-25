#!/usr/bin/env node

import 'zx/globals';
import get from 'lodash-es/get.js';
import set from 'lodash-es/set.js';
import take from 'lodash-es/take.js';
import pick from 'lodash-es/pick.js';

const appJsonPath = path.join(process.env.PWD, 'app.json');
const appJsonExists = await fs.pathExists(appJsonPath);

//helpers
const intVersion = str => {
    return parseInt(`${str}`.replaceAll('.', ''));
};
// --end helpers

if (!appJsonExists) {
    console.log(chalk.red(`Cannot find app.json at path '${appJsonPath}'`));
    console.log(chalk.red(`Update Stopped!`));
} else {
    const VERSION_PATH = 'expo.version';
    const IOS_VERSION_PATH = 'expo.ios.buildNumber';
    const ANDROID_VERSION_PATH = 'expo.android.versionCode';
    const appJSONContent = await fs.readJSON('app.json');
    const version = get(appJSONContent, VERSION_PATH);
    const iosBuildNumber = get(appJSONContent, IOS_VERSION_PATH);
    const androidVersionCode = get(appJSONContent, ANDROID_VERSION_PATH);

    const oldVersions = {
        version,
        iosBuildNumber,
        androidVersionCode,
    };

    let platform = argv.p || argv.platform || 'all';
    const updateTypes = {
        major: !!argv.major,
        minor: !!argv.minor,
    };
    updateTypes.patch = !(updateTypes.major || updateTypes.minor);

    const updateIncrement =
        updateTypes.major ?
            `1.0.0` :
            updateTypes.minor ?
                `0.1.0` :
                `0.0.1`;

    const getNewIOSVersion = () => {
        const incSegments = updateIncrement.split('.');
        const ibn = iosBuildNumber.split('.').map((num, index) => {
            if (updateTypes.major) {
                if (index > 0)
                    return '0';
            }
            if (updateTypes.minor) {
                if (index > 1)
                    return '0';
            }
            return num;
        });

        return ibn.map((num, index) =>
            parseInt(num) + parseInt(incSegments[index] || 0),
        ).join('.');
    };

    const getNewAndroidVersion = () => {
        return androidVersionCode + 1;
        // const incNumber = updateIncrement.replaceAll('.', '');
        // const avc = `${androidVersionCode}`.split('').map((num, index) => {
        //     if (updateTypes.major) {
        //         if (index > 0)
        //             return '0';
        //     }
        //     if (updateTypes.minor) {
        //         if (index > 1)
        //             return '0';
        //     }
        //     return num;
        // });
        // return parseInt(avc.join('')) + parseInt(incNumber);
    };

    const newVersions = {
        iosBuildNumber: getNewIOSVersion(),
        androidVersionCode: getNewAndroidVersion(),
    };
    newVersions.version = take(newVersions.iosBuildNumber.split('.'), 2).
        join('.');
    // Math.floor(
    // max([
    //     intVersion(newVersions.iosBuildNumber),
    //     intVersion(newVersions.androidVersionCode)])
    // / 10).
    // toString().
    // split('').
    // join('.');

    const writeVersions = () => {
        switch (platform) {
            case 'ios':
                set(appJSONContent, IOS_VERSION_PATH,
                    newVersions.iosBuildNumber);
                break;
            case 'android':
                set(appJSONContent, ANDROID_VERSION_PATH,
                    newVersions.androidVersionCode);
                break;
            case 'all':
                set(appJSONContent, IOS_VERSION_PATH,
                    newVersions.iosBuildNumber);
                set(appJSONContent, ANDROID_VERSION_PATH,
                    newVersions.androidVersionCode);
                break;
        }
        //set json object
        set(appJSONContent, VERSION_PATH, newVersions.version);
        //write file
        fs.writeJSONSync(appJsonPath, appJSONContent,
            {spaces: 2, replacer: null},
        );
    };

    console.log(chalk.yellow(`updating version for platform: ${platform}`));

    writeVersions();

    console.table(pick(appJSONContent,
        [VERSION_PATH, IOS_VERSION_PATH, ANDROID_VERSION_PATH]));

    console.log(chalk.green('🎉　DONE !'));

}
