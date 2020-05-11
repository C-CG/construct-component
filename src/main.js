import fs from 'fs'
import inquirer from 'inquirer'
import chalk from 'chalk'
import path from 'path'
import { promisify } from 'util'

const cwd = process.cwd()
const access = promisify(fs.access)

/* Handles check for 'components' directory */
async function handleComponentsDirectory () {
  try {
    await access(`${cwd}/components`, fs.constants.R_OK)
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
    }
    return answers['componentsDirectory']
  }
}

/* Handles Q/A from Inquirer */
async function handleInquirerQuestions () {
  try {
    var componentsDirectoryExists = await handleComponentsDirectory()
  } catch {
    console.log(
      `${chalk.red.bold('ERROR')}: 'components' folder cannot be found`
    )
  }
  if (componentsDirectoryExists) {
    const questions = []
    questions.push({
      type: 'input',
      name: 'componentName',
      message: 'Give your component a name:'
    })
    questions.push({
      type: 'list',
      name: 'componentType',
      message: 'Choose what type of component you want to create:',
      choices: ['functional', 'class']
    })
    questions.push({
      type: 'list',
      name: 'componentStyling',
      message: 'How will your component be styled?',
      choices: ['styled-components', 'scss', 'css', 'none']
    })
    const answers = await inquirer.prompt(questions)
    return answers
  }
}

/* Handles the 'construction' of the React component/'components/' creation */
export async function constructComponent (options) {
  try {
    var answers = await handleInquirerQuestions()
  } catch {
    console.log(`${chalk.red.bold('ERROR')}: component could not be created.`)
  }

  fs.mkdirSync(`./components/${answers['componentName']}`) // check if exists
  if (answers['componentType'] === 'class') {
    const currentFile = import.meta.url
    const templatesDir = path.resolve(
      new URL(currentFile).pathname,
      '../../src/templates'
    )
    /* Component file creation */
    fs.copyFile(
      `${templatesDir}/class.component.jsx`,
      `./components/${answers['componentName']}/${answers['componentName']}.component.jsx`,
      error => {
        if (error) throw error
      }
    )
    /* Creating style file (if needed) */
    if (
      answers['componentStyling'] === 'css' ||
      answers['componentStyling'] === 'scss'
    ) {
      fs.writeFile(
        `./components/${answers['componentName']}/${answers['componentName']}.styles.${answers['componentStyling']}`,
        '',
        error => {
          if (error) throw error
        }
      )
    }
    console.log(
      `${chalk.green.bold('DONE')}: '${answers['componentName']}' created`
    )
  }
}
