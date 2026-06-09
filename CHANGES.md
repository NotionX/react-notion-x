# Changes vs. Upstream (NotionX/react-notion-x)

This document summarizes additions and modifications made in this fork (`jack-h-park/react-notion-x`) relative to the upstream repository ([NotionX/react-notion-x](https://github.com/NotionX/react-notion-x)).

> Baseline: `upstream/master`  
> Known fork branches: `origin/main`, `origin/feat/text-thumbnail-preview`, `origin/claude/infallible-lovelace`

---

## 1. Gallery Card Cover — Text Thumbnail Teaser

Generates a text-based thumbnail from page content for gallery cards that have no image. Reproduces the Notion app's `page_content` / `page_content_first` cover type behavior.

### New file: `collection-card-cover.ts`

- **Location**: `packages/react-notion-x/src/third-party/collection-card-cover.ts` (669 lines)
- **Main export**: `getCollectionCardCoverCandidate()`

**Return type (`CollectionCardCoverCandidate`)**

| kind | Description |
|------|-------------|
| `image` | Image URL + alt + objectPosition |
| `teaser` | Text-based thumbnail (eyebrow / title / body / icon + tone) |
| `empty` | No cover |

**Image candidate search logic**

1. Traverses direct child blocks of the page (BFS, up to 16 blocks)
2. Transparent containers (`column_list`, `column`, `synced_block`, etc.) are recursed into
3. `image` block → used directly
4. `video` block → used if `display_source` is an image URL
5. `pdf` / `file` block → used if registered in the `preview_images` map
6. Nested `page` / `collection_view_page` blocks are skipped

**Text teaser construction logic**

When no image is found, a teaser is built from text blocks:

- **tone classification**
  - `callout` → prominent callout style
  - `quote` → blockquote style
  - `default` → plain text style
- **eyebrow**: short label (heading, callout title, etc.). Metadata-like text (`KEY: value` patterns) and weak headings (`overview`, `summary`, etc.) are excluded
- **title**: first meaningful heading in the page. Suppressed if it duplicates the page title
- **body**: up to 3 meaningful text blocks, capped at 240 characters
- **icon**: emoji/icon from a callout block (URL-format icons are excluded)
- `genericEyebrowTexts` (executive summary, overview, etc.) suppress the eyebrow if there is no body

**Helper functions**

| Function | Role |
|----------|------|
| `traversePageContent` | Full page block traversal with a visited-set |
| `getFlattenedPreviewBlocks` | BFS extraction of up to 16 preview blocks |
| `getLoadedDescendantBlocks` | Extract child blocks from callout/toggle |
| `resolveVisualCandidate` | Build an image candidate from a single block |
| `buildTeaserCandidate` | Analyze text blocks and build a teaser candidate |
| `getCalloutOrToggleTexts` | Extract eyebrow/body from callout/toggle |
| `getMeaningfulTextParts` | Collect up to N meaningful text parts |
| `shouldSuppressTeaserTitle` | Determine if teaser title duplicates the page title |
| `finalizeTeaserCandidate` | Finalize teaser candidate (suppress generic eyebrow, etc.) |
| `clipText` | Clip text to maxChars and append `…` |
| `isMetadataLikeText` | Detect `KEY: value` patterns |
| `isImageLikeUrl` | Determine if a URL points to an image (by extension/domain) |
| `hasPreviewImage` | Check if a URL is registered in `recordMap.preview_images` |

### Tests: `collection-card-cover.test.ts`

- **Location**: `packages/react-notion-x/src/third-party/collection-card-cover.test.ts` (659 lines)
- Vitest-based unit tests
- Covers: direct image, nested container image, video preview, callout teaser, quote teaser, page title deduplication suppression, generic eyebrow handling, and more

### `collection-card.tsx` changes

- Calls `getCollectionCardCoverCandidate()` and branches on `candidate.kind`:
  - `image` → existing `<LazyImage>` rendering
  - `teaser` → `<CollectionCardCoverTeaser>` rendering (new)
  - `empty` → no cover area

---

## 2. Button Block Improvements

- **Location**: `packages/react-notion-x/src/components/button.tsx`

**Changes**

| Item | Description |
|------|-------------|
| Icon rendering | Renders the automation's `properties.icon` before the button label as `<span class="notion-button-icon">` |
| `open_page` action | Supports both `target.page.id` (new API) and `target.pageId` (old API) |
| Buttons without automation | Rendered with the `<Text>` component instead of `getTextContent()` (rich text support) |
| Import order | Import order cleaned up to satisfy ESLint rules |

---

## 3. Quote Block Fix

- **Location**: `packages/react-notion-x/src/block.tsx`

**Change**

```
// Before
if (!block.properties) return null

// After
if (!block.properties && !children) return null
```

When a Notion quote block's text lives in **child blocks** rather than `properties.title`, the old code skipped the block entirely. Now the block renders as long as it has children, even when `properties` is absent.

---

## 4. New CSS Styles

- **Location**: `packages/react-notion-x/src/styles.css`

**Teaser thumbnail styles** (for gallery card covers)

| Class | Role |
|-------|------|
| `.notion-collection-card-cover-teaser` | Full area without border, 18px padding |
| `.notion-collection-card-cover-teaser-panel` | Flex column layout, 6px gap |
| `.notion-collection-card-cover-teaser-panel-callout` | Callout variant, 10px gap |
| `.notion-collection-card-cover-teaser-panel-quote` | 3px left border + padding |
| `.notion-collection-card-cover-teaser-eyebrow` | 11px, uppercase, 1-line clamp |
| `.notion-collection-card-cover-teaser-title` | 600 weight, 15px, 3-line clamp |
| `.notion-collection-card-cover-teaser-body` | 13px, multi-line clamp |
| `.notion-collection-card-cover-teaser-icon` | Fixed flex, 17px |

**Button dark-mode styles**

| Class | Role |
|-------|------|
| `.notion-button-icon` | Button icon spacing |
| `.dark-mode .notion-button:hover` | Dark-mode hover color |
| `.dark-mode .notion-button:active` | Dark-mode active color |
| `.dark-mode .notion-button.notion-default:hover` | Dark-mode default button hover |
| `.dark-mode .notion-button.notion-default:active` | Dark-mode default button active |

---

## 5. notion-client API Improvements

- **Location**: `packages/notion-client/src/notion-api.ts`

**Changes**

| Item | Description |
|------|-------------|
| `automation` / `automation_action` initialization | Initializes as empty objects when the maps are absent from `recordMap` |
| `getAllContentBlockIds()` new method | Collects content block IDs from both regular pages and collection sub-pages |
| `getCollectionPageIds()` new method | Returns a list of collection page block IDs from `recordMap` |
| Signed URL scope expanded | `addSignedUrls` call now includes collection sub-page blocks |

---

## 6. Packaging — Direct GitHub Tarball Install Support

Upstream only supports npm distribution. This fork modifies the package structure to allow installing directly from the GitHub repository as an npm dependency (`github:jack-h-park/react-notion-x#tag`).

**Changes**

| File | Change |
|------|--------|
| `package.json` (root) | Configured root to act as the `react-notion-x` package (added `main`, `exports`) |
| `packages/react-notion-x/package.json` | `build/` output included in `exports`, `prepare` script removed |
| `packages/react-notion-x/build/` | Build artifacts (`index.js`, `third-party/*.js`, `.d.ts`) committed to the repository |

**Release tag naming convention**

```
7.10.0-jp.1 ~ 7.10.0-jp.8   (latest: jp.8)
7.7.1-jp.2, 7.7.1-jp.3
```

The `-jp.N` suffix distinguishes fork releases from upstream versions.
