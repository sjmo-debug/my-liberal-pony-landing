

## Add localStorage Caching to About Content Hook

### What This Does
Adds a localStorage caching layer to the About page data fetching. Instead of hitting Google Sheets on every page load, the app will:
1. Serve instantly from cache if it's less than 1 hour old
2. Fetch fresh data only when cache expires (or doesn't exist)
3. Fall back to stale cache if the fetch fails (so the page never goes blank)

This means faster page loads and resilience against network issues.

### Changes

**File: `src/hooks/useAboutContent.ts`**

Update the `queryFn` to wrap the existing fetch logic with localStorage caching:

- Before fetching, check `localStorage` for a cached item under key `about_page_data`
- If cache exists and is less than 1 hour old, return the cached data immediately
- If cache is missing or stale, fetch from Google Sheets as before
- On successful fetch, save the parsed result + timestamp to localStorage
- If fetch fails and stale cache exists, return the stale cache as a fallback
- If fetch fails and no cache exists, return the existing hardcoded `FALLBACK` array

The `refetchInterval` and `staleTime` on the React Query config will be increased to 1 hour (3600000ms) to match the localStorage cache duration, so React Query doesn't bypass the cache with its own refetch cycle.

### Technical Details
- Cache key: `about_page_data`
- Cache duration: 1 hour (3600000ms)
- Storage format: `{ data: AboutEntry[], timestamp: number }`
- No new dependencies needed -- uses built-in `localStorage`
- The existing `FALLBACK` array remains as the last-resort safety net
- React Query's in-memory cache still works on top of this for instant re-renders within the same session

