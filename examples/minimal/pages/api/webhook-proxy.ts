import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { url, payload, headers } = req.body

    if (!url || !payload) {
      return res.status(400).json({ error: 'Missing url or payload' })
    }

    // Forward the request to the actual webhook URL
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(payload)
    })

    const responseData = await response.text()

    // Return the response from the webhook
    return res.status(response.status).json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: responseData
    })
  } catch (err) {
    console.error('Webhook proxy error:', err)
    return res.status(500).json({
      error: 'Failed to forward webhook',
      message: err instanceof Error ? err.message : 'Unknown error'
    })
  }
}
