import fs from 'fs'
import chalk from 'chalk'
import { promisify } from 'util'

const access = promisify(fs.access)

export async function constructComponent (options) {
  try {
    await access('./components', fs.constants.R_OK)
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
