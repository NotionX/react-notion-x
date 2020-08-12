const { program } = require('commander')
const { NotionAPI } = require('./build')

async function main(argv) {
  program.parse(argv)

  const api = new NotionAPI()

  // const output = await api.getPage(program.args[0])
  const output = await api.getCollectionData(program.args[0], program.args[1])
  console.log(JSON.stringify(output, null, 2))
}

main(process.argv)
