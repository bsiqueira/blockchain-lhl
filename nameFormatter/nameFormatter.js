class NameFormatter {

  invertName(name) {
    if (!name) {
      if (name === undefined) throw Error('No name provided.')
      return name
    } else {
      let formattedName = name.trim()
      const nameArray = formattedName.split(' ')
      switch (nameArray.length) {
        case 1:
          if (nameArray[0].substr(nameArray[0].length - 1) === '.') return ''
          return formattedName
        case 2:
          if (nameArray[0].substr(nameArray[0].length - 1) === '.') {
            return formattedName
          } else {
            return `${nameArray[1]}, ${nameArray[0]}`
          }
        case 3:
          return `${nameArray[0]} ${nameArray[2]}, ${nameArray[1]}`
        default:
          return formattedName
      }
      return formattedName
    }
  }

}

module.exports = NameFormatter