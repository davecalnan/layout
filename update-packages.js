const fs = require('fs')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)
const writeFile = promisify(fs.writeFile)

const directoriesToExclude = ['api', 'www']

const bumpVersion = ([major, minor, patch], flag = '--patch') => {
  if (flag === '--major') {
    return [major + 1, minor, patch].join('.')
  }

  if (flag === '--minor') {
    return [major, minor + 1, patch].join('.')
  }

  if (flag === '--patch') {
    return [major, minor, patch + 1].join('.')
  }

  throw new Error('Invalid flag provided.')
}

const requirePackageDotJSON = directory => require(`./packages/${directory}/package.json`)

const updateDependencies = async (directory, dependenciesToUpdate, newVersion) => {
  try {
    const package = requirePackageDotJSON(directory)

    if (!directoriesToExclude.includes(directory)) {
      package.version = newVersion
    }

    const updateDependenciesObject = (dependenciesObject = {}, dependenciesObjectName) => {
      Object
        .entries(dependenciesObject)
        .filter(([dependency, version]) => dependenciesToUpdate.includes(dependency))
        .forEach(([dependency, version]) => package[dependenciesObjectName][dependency] = newVersion)
    }

    updateDependenciesObject(package.dependencies, 'dependencies')
    updateDependenciesObject(package.devDependencies, 'devDependencies')

    return await writeFile(`./packages/${directory}/package.json`, JSON.stringify(package, null, 2))
  } catch (error) {
    console.error(`Could not update dependencies: ${error.message}`)
  }
}


const main = async () => {
  try {
    const directories = await readdir('./packages')

    const nonPackages = directories
      .filter(directory => directoriesToExclude.includes(directory))
      .map(requirePackageDotJSON)

    const packages = directories
      .filter(directory => !directoriesToExclude.includes(directory))
      .map(requirePackageDotJSON)
      .map(package => ({ ...package })) // Freeze initial package versions.

    const packageNames = packages.map(({ name }) => name)
    const packageVersions = packages.map(({ version }) => version)

    const highestVersion = packageVersions
      .sort((a, b) => a < b)[0]
      .split('.')
      .map(string => Number(string))

    const newVersion = bumpVersion(highestVersion, process.argv[2])

    await Promise.all(
      directories.map(directory => updateDependencies(directory, packageNames, newVersion))
    )

    console.log(`Successfully updated package versions:`)
    console.log(
      packages
        .map(({ name, version }) => `- ${name}: ${version} -> ${newVersion}`)
        .join('\n')
    )
    console.log(`Successfully updated dependencies for:`)
    console.log(
      [...packages, ...nonPackages]
        .map(({ name }) => `- ${name}`)
        .join('\n')
    )
  } catch (error) {
    console.error(`Could not update package versions: ${error.message}.`)
  }
}

main()

