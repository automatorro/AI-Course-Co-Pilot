export type ImageSearchResult = {
  url: string
  thumb: string
  author?: string
  source?: string
  link?: string
}

export const searchImages = async (query: string, page = 1): Promise<ImageSearchResult[]> => {
  try {
    const { data } = await (window as any).supabase.functions.invoke('image-search', {
      body: { query, page }
    })
    if (data && Array.isArray(data.results)) return data.results as ImageSearchResult[]
  } catch {}
  const baseUrl = `https://lexica.art/api/v1/search?q=${encodeURIComponent(query)}&page=${page}`
  const tryFetchJson = async (u: string) => {
    const res = await fetch(u, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  }
  let json: any = null
  try {
    json = await tryFetchJson(baseUrl)
  } catch {}
  if (!json) {
    const proxied = `https://cors.isomorphic-git.org/${baseUrl}`
    try {
      json = await tryFetchJson(proxied)
    } catch {}
  }
  const items: any[] = Array.isArray(json?.images) ? json.images : []
  return items.map(it => ({
    url: it.src || '',
    thumb: it.srcSmall || it.src || '',
    author: it.prompt ? 'Lexica' : undefined,
    source: 'Lexica',
    link: it.src || undefined
  })).filter(x => x.url)
}
