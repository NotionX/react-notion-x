import { type ExtendedRecordMap } from 'notion-types'

export const imageRegressionRootId = '11111111-1111-4111-8111-111111111111'
export const imageRegressionBlockId = '30bedb27-f124-81af-ad6f-d52af5294891'
export const imageRegressionSource =
  'attachment:e7f3a695-9dd2-440f-a398-060b2d67f783:image.png'
export const imageRegressionLegacyBlockId =
  '067dd719-a912-471e-a9a3-ac10710e7fdf'
export const imageRegressionLegacySource =
  'https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3441b9fe-72df-4a84-849a-d5cfe9027c9d/background2.jpg'

const expiredImageUrl = `https://file.notion.com/f/f/space-id/e7f3a695-9dd2-440f-a398-060b2d67f783/image.png?table=block&id=${imageRegressionBlockId}&expirationTimestamp=1&signature=expired`
const expiredLegacyImageUrl = `https://file.notion.com/f/f/space-id/3441b9fe-72df-4a84-849a-d5cfe9027c9d/background2.jpg?table=block&id=${imageRegressionLegacyBlockId}&expirationTimestamp=1&signature=expired`

/**
 * Reproduces the cached-record-map failure without relying on a signature's
 * real lifetime. The public image must render from its stable attachment source.
 */
export const imageRegressionRecordMap = {
  block: {
    [imageRegressionRootId]: {
      role: 'reader',
      value: {
        id: imageRegressionRootId,
        type: 'page',
        parent_table: 'space',
        content: [imageRegressionBlockId, imageRegressionLegacyBlockId],
        properties: { title: [['Image URL regression']] },
        format: {},
        permissions: [{ role: 'reader', type: 'public_permission' }]
      }
    },
    [imageRegressionBlockId]: {
      role: 'reader',
      value: {
        id: imageRegressionBlockId,
        type: 'image',
        parent_id: imageRegressionRootId,
        parent_table: 'block',
        properties: {
          source: [[imageRegressionSource]],
          alt_text: [['Notion image regression fixture']]
        }
      }
    },
    [imageRegressionLegacyBlockId]: {
      role: 'reader',
      value: {
        id: imageRegressionLegacyBlockId,
        type: 'image',
        parent_id: imageRegressionRootId,
        parent_table: 'block',
        properties: {
          source: [[imageRegressionLegacySource]],
          alt_text: [['Legacy Notion image regression fixture']]
        }
      }
    }
  },
  collection: {},
  collection_view: {},
  collection_query: {},
  notion_user: {},
  signed_urls: {
    [imageRegressionSource]: expiredImageUrl,
    [imageRegressionBlockId]: expiredImageUrl,
    [imageRegressionLegacySource]: expiredLegacyImageUrl,
    [imageRegressionLegacyBlockId]: expiredLegacyImageUrl
  }
} as unknown as ExtendedRecordMap
