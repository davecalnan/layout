const fs = require('fs')
const childProcess = require('child_process')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)
const exec = promisify(childProcess.exec)

const directoriesToExclude = ['api', 'www']

const main = async () => {
  try {
    const directories = await readdir('./packages')
    const packageDirectories = directories.filter(directory => !directoriesToExclude.includes(directory))

    await Promise.all(
      packageDirectories.map(async directory => await exec(`cd ./packages/${directory} && npm publish`))
    )

    console.log('Successfully published all packages.')
  } catch (error) {
    console.error(`Could not publish packages: ${error.message}.`)
  }
}

main()
