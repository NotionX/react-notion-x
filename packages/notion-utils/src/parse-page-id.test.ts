import test from 'ava'
import { parsePageId } from './parse-page-id'

const pageIdFixturesSuccess = [
  '267c0d1f1df8457f9b5c8f7efca16d83',
  'Twitter-Automation-Tool-267c0d1f1df8457f9b5c8f7efca16d83',
  'www.notion.so/saasifysh/Twitter-Automation-Tool-267c0d1f1df8457f9b5c8f7efca16d83',
  'www.notion.so/saasifysh/Twitter-Automation-Tool-267c0d1f1df8457f9b5c8f7efca16d83?foo=bar&bar=foo',
  'https://www.notion.so/saasifysh/Standalone-Notion-Hosting-717a3608b1874cc5bafb5b9680b53395',
  'Standalone-Notion-Hosting-717a3608b1874cc5bafb5b9680b53395',
  'Standalone-Notion-Hosting-717a3608b1874cc5bafb5b9680b53395?foo',
  '-717a3608b1874cc5bafb5b9680b53395',
  '717a3608b1874cc5bafb5b9680b53395',
  '717a3608b1874cc5bafb5b9680b53395?',
  'e5a735e3-3baa-458b-9889-93b55a54ee54',
  'fde5ac74-eea3-4527-8f00-4482710e1af3',
  'about-e5a735e3-3baa-458b-9889-93b55a54ee54',
  '.com/about-e5a735e3-3baa-458b-9889-93b55a54ee54',
  'About-d9ae0c6e7cad49a78e21d240cf2e3d04'
]

const pageIdFixturesFailure = [
  '717A3608b1874CC5bafb5b9680b53395',
  '717A36',
  '',
  'notion.so/saasifysh/Twitter-Automation-Tool-267c0d1f1df8457f9b5c8f7efca16d83abc',
  'a267c0d1f1df8457f9b5c8f7efca16d83',
  '267c0d1f1df8457f9b5c8f7efca16d83a',
  '267c0d1f1%f8457f9b5c8f7efca16d83',
  'Twitter-Automation-Tool',
  'fde5ac74-eea3-4527-8f00-4482710e1af',
  null
]

test('utils.parsePageId non-uuid success', (t) => {
  for (const id of pageIdFixturesSuccess) {
    const pageId = parsePageId(id, { uuid: false })
    t.truthy(pageId)
    t.falsy((pageId as string).includes('-'))
    t.snapshot(pageId)
  }
})

test('utils.parsePageId uuid success', (t) => {
  for (const id of pageIdFixturesSuccess) {
    const pageId = parsePageId(id, { uuid: true })
    t.truthy(pageId)
    t.truthy((pageId as string).includes('-'))
    t.snapshot(pageId)
  }
})

test('utils.parsePageId failure', (t) => {
  for (const id of pageIdFixturesFailure) {
    const pageId = parsePageId(id as string)
    t.falsy(pageId)
  }
})
