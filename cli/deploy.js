import { exec } from 'child_process'

const deploy = directory => {
  const child = exec(`now ${ directory }`)

  child.stdout.on('data', data => console.log('stdout: ' + data))
  child.stderr.on('data', data => console.log('stderr: ' + data))
  child.on('close', code => console.log('closing code: ' + code))
}

const main = () => {
  const outputDirectory = 'site'
  deploy(outputDirectory)
}

main()
