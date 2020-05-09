import arg from 'arg'
import { constructComponent } from '../src/main'

function parseArgumentsIntoOptions (rawArgs) {
  const args = arg(
    {
      '--class': Boolean,
      '--functional': Boolean,
      '-c': '--class',
      '-f': '--functional'
    },
    {
      argv: rawArgs.slice(2)
    }
  )
  return {
    componentName: args._[0],
    classComponent: args['--class'] || false,
    functionalComponent: args['--functional'] || false
  }
}

export async function cli (args) {
  let options = parseArgumentsIntoOptions(args)
  await constructComponent(options)
}
