process.exit(1)

const packages = directories
  .filter(directory => !directoriesToExclude.includes(directory))
  .map(package => require(`./packages/${package}/package.json`))

const versions = packages.map(({ version }) => version)

const getHighestVersion = versions => versions.sort((a, b) => a < b)[0]

getHighestVersion(versions)
