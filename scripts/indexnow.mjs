// Tells IndexNow (Bing, Yandex, Seznam, Naver) that the pages in the live
// sitemap changed. Run after a deploy: `pnpm indexnow`. The key file is
// public/<key>.txt and must be live before this is run.
const HOST = 'chairo.app'
const KEY = '6b3fb5e1ef3647ee86a544ad26755d48'

const sitemap = await fetch(`https://${HOST}/sitemap.xml`).then((r) => r.text())
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
})
console.log(
  `IndexNow: ${res.status} ${res.statusText} (${urlList.length} URLs)`,
)
if (!res.ok) {
  console.error(await res.text())
  process.exit(1)
}
