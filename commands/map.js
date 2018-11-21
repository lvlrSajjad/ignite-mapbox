// @cliDescription  Generates a map component.
// @cliExample  ignite generate map StoreLocator
// Generates a map component that can be inserted into any screen.
// ----------------------------------------------------------------------------
module.exports = async function (context) {
  const { parameters, strings, print, ignite, filesystem } = context
  const { pascalCase, isBlank } = strings
  const APP_PATH = process.cwd()
  // validation
  if (isBlank(parameters.first)) {
    print.info(`ignite generate map <name>\n`)
    print.info('A name is required.')
    return
  }

  const name = pascalCase(parameters.first)
  const calloutName = `${name}Callout`
  const Package = require(`${APP_PATH}/package.json`);
  const isTypescriptAndross = JSON.stringify(Package.devDependencies).toString().includes("ignite-boilerplate-andross-typescript");
  const isAndross = JSON.stringify(Package.devDependencies).toString().includes("ignite-ir-boilerplate-andross");
  const isBowser = JSON.stringify(Package.devDependencies).toString().includes("ignite-ir-boilerplate-bowser");

  // Copies the `map.js.ejs` in the templates folder
  // into App/Components/${name}.js.
  let copyJobs;
  if (isTypescriptAndross){
    copyJobs = [{
      template: 'typescriptAndross/App/Components/Folder/Component.ejs',
      target: `js/App/Components/${name}/${name}Component.tsx`
    }, {
      template: 'typescriptAndross/App/Config/MapboxConfig.tsx',
      target: `js/App/Config/MapboxConfig.tsx`
    }, {
      template: 'typescriptAndross/App/Containers/Container.ejs',
      target: `js/App/Containers/${name}.ts`
    }]
    const containerName = name
    const appNavFilePath = `${process.cwd()}/js/App/Navigation/AppNavigation.tsx`
    const importToAdd = `import ${containerName} from '../Containers/${containerName}'`
    const routeToAdd = `  ${containerName}: { screen: ${containerName} },`

    if (!filesystem.exists(appNavFilePath)) {
      const msg = `No '${appNavFilePath}' file found.  Can't insert container.`
      print.error(msg)
      process.exit(1)
    }

    // insert container import
    ignite.patchInFile(appNavFilePath, {
      after: `import { createSwitchNavigator, createStackNavigator } from "react-navigation";`,
      insert: importToAdd
    })

    // insert container route
    ignite.patchInFile(appNavFilePath, {
      after: 'export const MainNav',
      insert: routeToAdd
    })

  } else if (isAndross){
    copyJobs = [{
      template: 'andross/App/Components/Folder/Component.ejs',
      target: `App/Components/${name}/${name}Component.js`
    }, {
      template: 'andross/App/Config/MapboxConfig.js',
      target: `App/Config/MapboxConfig.js`
    }, {
      template: 'andross/App/Containers/Container.ejs',
      target: `App/Containers/${name}.js`
    }]

    const containerName = name
    const appNavFilePath = `${process.cwd()}/App/Navigation/AppNavigation.js`
    const importToAdd = `import ${containerName} from '../Containers/${containerName}'`
    const routeToAdd = `  ${containerName}: { screen: ${containerName} },`

    if (!filesystem.exists(appNavFilePath)) {
      const msg = `No '${appNavFilePath}' file found.  Can't insert container.`
      print.error(msg)
      process.exit(1)
    }

    // insert container import
    ignite.patchInFile(appNavFilePath, {
      after: `import[\\s\\S]*from\\s+'react-navigation';?`,
      insert: importToAdd
    })

    // insert container route
    ignite.patchInFile(appNavFilePath, {
      after: 'const PrimaryNav',
      insert: routeToAdd
    })


  } else if (isBowser){
    copyJobs = [{
      template: 'bowser/src/views/mapbox/Mapbox.ejs',
      target: `src/views/mapbox/${name}.js`
    }, {
      template: 'bowser/src/config/MapboxConfig.tsx',
      target: `src/config/MapboxConfig.tsx`
    }]
  }

  // make the templates and pass in props with the third argument here
  await ignite.copyBatch(context, copyJobs, { name: name, calloutName: calloutName })
}
