const { NotionAPI } = require('./build/cjs')

async function main() {
  console.log('Fetching page...')
  const api = new NotionAPI()

  // page example
  // const output = await api.getPage('067dd719-a912-471e-a9a3-ac10710e7fdf')
  // const output = await api.getPage('139ac7d730d54b5e93937a282d8ff635')
  // const output = await api.getPage('8a586d253f984b85b48254da84465d23')
  // const output = await api.getPage('b21b2ed02ad446b2af74ee6e262e2124')
  // const output = await api.getPage('d856b307cd704490bc923ef4255dd9f9')
  try {
    // const output = await api.getCollectionData(
    //   'e6da389e-260b-4e90-986f-f6fba332f0e4',
    //   '5f5617ce-3b1a-48c1-b93c-dae7befe7b74'
    // )

    // collection example
    // const collectionId = '2d8aec23-8281-4a94-9090-caaf823dd21a'
    // const collectionViewId = 'ab639a5a-853e-45e1-9ef7-133b486c0acf'
    // const output = await api.getCollectionData(collectionId, collectionViewId)

    // signed url example
    // const file = {
    //   permissionRecord: {
    //     id: 'd142a056-f104-477c-96d5-2b03fdd8c6e3',
    //     table: 'block'
    //   },
    //   url:
    //     'https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f428f70f-aadc-45e3-acdc-72f762c2fbc9/Aaron_Wang_Design_Resume.pdf'
    // }
    // const output = await api.getSignedFileUrls([file])

    // console.log(JSON.stringify(output, null, 4))
  } catch (err) {
    console.error(err)
  }
}

main()
