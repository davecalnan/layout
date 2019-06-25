const fs = require('fs')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)
const writefile = promisify(fs.writefile)

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

const updateDependencies = async (directories, dependenciesToUpdate, newVersion) => {
  try {
    directories.map(directory => {
      const package = requirePackageDotJSON(directory)

      const updateDependenciesObject = (dependenciesObject = {}, dependenciesObjectName) => {
        Object
          .entries(dependenciesObject)
          .filter(([dependency, version]) => dependenciesToUpdate.includes(dependency))
          .forEach(([dependency, version]) => package[dependenciesObjectName][dependency] = newVersion)
      }

      updateDependenciesObject(package.dependencies, 'dependencies')
      updateDependenciesObject(package.devDependencies, 'devDependencies')

      return await writefile(`./packages/${directory}/package.json`, JSON.stringify(package, null, 2))
    })
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

    const packageNames = packages.map(({ name }) => name)
    const packageVersions = packages.map(({ version }) => version)

    const highestVersion = packageVersions
      .sort((a, b) => a < b)[0]
      .split('.')
      .map(string => Number(string))

    const newVersion = bumpVersion(highestVersion, process.argv[2])

    const packagesWithUpdatedVersions = packages.map(package => {
      const updatedPackage = {...package}
      updatedPackage.version = newVersion
      return updatedPackage
    })

    await Promise.all(
      updateDependencies(directories, packageNames, newVersion)
    )

    console.log(`Successfully updated package versions:`)
    console.log(
      packages
        .map(({ name, version }) => `- ${name}: ${version} -> ${newVersion}`)
        .join('\n')
    )
    console.log(`Successfully updated dependencies for:`)
    console.log(
      [...packagesWithUpdatedVersions, ...nonPackages]
        .map(({ name }) => `- ${name}`)
        .join('\n')
    )
  } catch (error) {
    console.error(`Could not update package versions: ${error.message}.`)
  }
}

main()

