// Ignite plugin for Maps
// ----------------------------------------------------------------------------

const NPM_MODULE_NAME = '@mapbox/react-native-mapbox-gl'
const NPM_MODULE_VERSION = '6.1.3'
// const PLUGIN_PATH = __dirname
const APP_PATH = process.cwd()
const EXAMPLE_FILE = 'MapsExample.js.ejs'

const GRADLE_CONFIG = `
implementation (project(':mapbox-react-native-mapbox-gl')) {
        implementation('com.squareup.okhttp3:okhttp:3.6.0') {
            force = true
        }
    }`

const GRADLE_CONFIG_OLD = `
compile (project(':mapbox-react-native-mapbox-gl')) {
        compile('com.squareup.okhttp3:okhttp:3.6.0') {
            force = true
        }
    }`


const WRONG_SETTINGS_CONFIG = `include ':@mapbox/react-native-mapbox-gl'
project(':@mapbox/react-native-mapbox-gl').projectDir = new File(rootProject.projectDir, '../node_modules/@mapbox/react-native-mapbox-gl/android/rctmgl')`

const WRONG_SETTINGS_CONFIG_NEW = `include ':@mapbox_react-native-mapbox-gl'
project(':@mapbox_react-native-mapbox-gl').projectDir = new File(rootProject.projectDir, '../node_modules/@mapbox/react-native-mapbox-gl/android/rctmgl')`


const CORRECT_SETTINGS_CONFIG = `include ':mapbox-react-native-mapbox-gl'
project(':mapbox-react-native-mapbox-gl').projectDir = new File(rootProject.projectDir, '../node_modules/@mapbox/react-native-mapbox-gl/android/rctmgl')`

const add = async function (context) {
  const { ignite, print } = context
  // install a npm module and link it
  await ignite.addModule(NPM_MODULE_NAME, { version: NPM_MODULE_VERSION, link: true })
  // add our component example to the plugin component examples screen
 // await ignite.addPluginComponentExample(EXAMPLE_FILE, { title: 'Maps Example' })
  const Package = require(`${APP_PATH}/package.json`);
  const isTypescriptAndross = JSON.stringify(Package.devDependencies).toString().includes("ignite-boilerplate-andross-typescript");
  const isAndross = JSON.stringify(Package.devDependencies).toString().includes("ignite-ir-boilerplate-andross");
  const isBowser = JSON.stringify(Package.devDependencies).toString().includes("ignite-ir-boilerplate-bowser");

  if (isAndross){
    // add the app build gradle config
    ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
      insert: GRADLE_CONFIG_OLD,
      replace: `\n    compile project(':@mapbox/react-native-mapbox-gl')`
    })

    ignite.patchInFile(`${APP_PATH}/android/settings.gradle`, {
      insert: CORRECT_SETTINGS_CONFIG,
      replace: WRONG_SETTINGS_CONFIG
    })

    ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
      insert: `buildToolsVersion "26.0.1"`,
      replace: `buildToolsVersion "23.0.1"`
    })

    ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
      insert: `compileSdkVersion 26`,
      replace: `compileSdkVersion 23`
    })

    ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
      insert: `compile "com.android.support:appcompat-v7:26.0.1"`,
      replace: `compile "com.android.support:appcompat-v7:23.0.1"`
    })

    ignite.patchInFile(`${APP_PATH}/android/build.gradle`, {
      before: `maven {`,
      insert: `
      maven { url "https://jitpack.io" }
        maven { url "https://maven.google.com" }
        `
    })


  } else if (isBowser || isTypescriptAndross){
    ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
      insert: GRADLE_CONFIG,
      replace: `\n    compile project(':@mapbox_react-native-mapbox-gl')`
    })

    ignite.patchInFile(`${APP_PATH}/android/settings.gradle`, {
      insert: CORRECT_SETTINGS_CONFIG,
      replace: WRONG_SETTINGS_CONFIG_NEW
    })
  }


  print.info('done')

  // print.warning(`⚠️  Using Google Maps on Android? ⚠️`)
  // print.info('')
  // print.info(`  If you're using Google Maps on Android (this is the default), there's still another step.`)
  // print.info(`  You must add an API Key from ${print.colors.cyan('https://developers.google.com/maps/android/?authuser=1')}`)
  // print.info('')
  // print.info('  It is free for apps that are not behind a paywall or a login. See')
  // print.info(`  Google's plans page for more details.`)
  // print.info('')
  // print.info(`  Place the key in ${print.colors.bold('android/app/src/main/AndroidManifest.xml')}`)
  // print.info('')
  // print.info(`  As a child of the ${print.colors.bold('<application>')} tag, add this: `)
  // print.info('')
  // print.info(print.colors.bold('        <meta-data'))
  // print.info(print.colors.bold('            android:name="com.google.android.geo.API_KEY"'))
  // print.info(print.colors.bold('            android:value="PASTE-YOUR-API-KEY-HERE-FOR-A-GOOD-TIME" />'))
  // print.info('')
}

/**
 * Remove from the project.
 */
const remove = async function (context) {
  const { ignite } = context

  // remove the npm module and unlink it
  await ignite.removeModule(NPM_MODULE_NAME, { unlink: true })
  // remove our component example from the plugin component examples screen
  await ignite.removePluginComponentExample(EXAMPLE_FILE)

  // Remove the app build gradle config we added
  ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
    delete: GRADLE_CONFIG
  })

  ignite.patchInFile(`${APP_PATH}/android/settings.gradle`, {
    delete: CORRECT_SETTINGS_CONFIG
  })

  // TODO: Remove API key
  // android/app/src/main/AndroidManifest.xml
}

module.exports = { add, remove }
