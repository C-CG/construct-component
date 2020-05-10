import fs from 'fs'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { promisify } from 'util'

const access = promisify(fs.access)

/* Used to handle 'components' folder creation/checking */
async function handleComponentsDirectory () {
  try {
    await access('./components', fs.constants.R_OK)
    return true
  } catch {
    const questions = []
    questions.push({
      type: 'confirm',
      name: 'componentsDirectory',
      message:
        "'components' directory does not exist, do you want to create it?"
    })
    const answers = await inquirer.prompt(questions)
    if (answers['componentsDirectory']) {
      fs.mkdirSync('./components')
      console.log(`${chalk.green.bold('DONE')}: 'components' folder created.`)
    }
    return answers['componentsDirectory']
  }
}

async function handleFileCreation (componentName) {
  /* Component File */
  fs.copyFile(
    './src/templates/class.component.jsx',
    `./components/${componentName}/${componentName}.component.jsx`,
    error => {
      if (error) throw error
    }
  )
  /* Styles File */
  fs.writeFile(
    `./components/${componentName}/${componentName}.styles.css`,
    '',
    error => {
      if (error) throw error
    }
  )
}

async function handleComponentCreation (componentExists, componentName) {
  if (componentExists) {
    const questions = []
    questions.push({
      type: 'confirm',
      name: 'createComponent',
      message: `component '${componentName}' already exists, do you want to over-write it?`
    })
    const answers = await inquirer.prompt(questions)
    return answers['createComponent']
  } else {
    fs.mkdirSync(`./components/${componentName}`)
    await handleFileCreation(componentName)
    return true
  }
}

export async function constructComponent (options) {
  try {
    var componentsDirectoryExists = await handleComponentsDirectory()
  } catch {
    console.log(
      `${chalk.red.bold(
        'ERROR'
      )}: 'components' could not be created/does not exist.`
    )
    process.exit(1)
  }

  if (!componentsDirectoryExists) {
    process.exit(1)
  } else {
    const componentExists = fs.existsSync(
      `./components/${options.componentName}`
    )
    const createComponent = await handleComponentCreation(
      componentExists,
      options.componentName
    )
    if (!createComponent) {
      process.exit(1)
    } else {
      console.log(
        `${chalk.green.bold('DONE')}: '${
          options.componentName
        }' component created.`
      )
    }
  }
}
