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
      console.log(`${chalk.red.green('DONE')}: 'components' folder created.`)
    }
    return answers['componentsDirectory']
  }
}

export async function constructComponent (options) {
  try {
    let answer = await handleComponentsDirectory()
    // Check answer, handle accordingly
  } catch {
    console.log(
      `${chalk.red.bold('ERROR')}: 'components' folder does not exist.`
    )
    process.exit(1)
  }
  console.log(
    `${chalk.green.bold('Component Created')}: ${options.componentName}`
  )
}
