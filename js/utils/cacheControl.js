export const cacheRequest = async (cacheName, requestOptions) => {
  if (!cacheName || !requestOptions) {
    throw new Error('cacheName or requestOptions are not specified for caching the request');
  }

  const { url, responseData } = requestOptions;

  const cache = await caches.open(cacheName);

  cache.put(url, new Response(JSON.stringify(responseData)));
};

export const getFromCache = async (cacheName, url) => {
  if (!cacheName || !url) {
    throw new Error('cacheName or url are not specified for getting from cache');
  }

  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(url);

  if (cachedResponse) {
    return cachedResponse.json();
  }

  return null;
};

export const resetCache = async (cacheName) => {
  if (!cacheName) {
    throw new Error('cacheName is not specified for resetting the cache');
  }

  await caches.delete(cacheName);
  console.log('Cache has been cleaned');
};