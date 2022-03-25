import { NextApiRequest, NextApiResponse } from 'next'
import { fetchTweetAst } from 'static-tweets'

// NOTE: Tweets are expected to be pre-loaded at build-time. This API function is
// provided as a fallback just in case some tweets are dynamically included on the
// page.
export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const tweetId = req.query.tweetId as string

  if (!tweetId) {
    return res
      .status(400)
      .send({ error: 'missing required parameter "tweetId"' })
  }

  console.log('getTweetAst', tweetId)
  const tweetAst = await fetchTweetAst(tweetId)
  console.log('tweetAst', tweetId, tweetAst)

  res.status(200).json(tweetAst)
}
