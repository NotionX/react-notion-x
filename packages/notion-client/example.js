const { NotionAPI } = require('./build')

async function main() {
  const api = new NotionAPI()

  // const output = await api.getPage('067dd719-a912-471e-a9a3-ac10710e7fdf')

  const collectionId = '2d8aec23-8281-4a94-9090-caaf823dd21a'
  const collectionViewId = 'ab639a5a-853e-45e1-9ef7-133b486c0acf'
  const output = await api.getCollectionData(collectionId, collectionViewId)

  console.log(JSON.stringify(output, null, 2))
}

main()
