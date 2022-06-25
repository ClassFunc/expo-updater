## expo-version-updater

<img width="600" alt="Ảnh chụp Màn hình 2022-06-25 lúc 18 51 32" src="https://user-images.githubusercontent.com/2741804/175772405-6de6d5a6-567d-47f6-ac85-9038c0ddb889.png">

### Install:
```shell
npm i -g expo-version-updater
```

### Usage:
In Expo project root (where app.json file exists)

```sh
exup # for update all versions of ios, android and version field

updating version for platform: all
┌─────────┬─────────┬──────────────────────────┬──────────────────────┐
│ (index) │ version │           ios            │       android        │
├─────────┼─────────┼──────────────────────────┼──────────────────────┤
│  expo   │  '7.0'  │ { buildNumber: '7.0.5' } │ { versionCode: 705 } │
└─────────┴─────────┴──────────────────────────┴──────────────────────┘
🎉　DONE !
```

```sh
exup -p ios --minor

updating version for platform: ios
┌─────────┬─────────┬──────────────────────────┬──────────────────────┐
│ (index) │ version │           ios            │       android        │
├─────────┼─────────┼──────────────────────────┼──────────────────────┤
│  expo   │  '7.1'  │ { buildNumber: '7.1.0' } │ { versionCode: 705 } │
└─────────┴─────────┴──────────────────────────┴──────────────────────┘
🎉　DONE !

```

API: 
- `-p ` or `--platform`=`ios` | `android` | `all`(default)
- `--patch`(default), `--minor`, `--major`


