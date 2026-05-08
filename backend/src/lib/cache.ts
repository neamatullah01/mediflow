import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: 21600, // 6 hours in seconds (for AI forecast caching per PRD §10)
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: true,
});

export const getCacheKey = (prefix: string, identifier: string): string => {
  return `${prefix}:${identifier}`;
};

export const getFromCache = <T>(key: string): T | undefined => {
  return cache.get<T>(key);
};

export const setCache = <T>(key: string, value: T, ttl?: number): boolean => {
  if (ttl !== undefined) {
    return cache.set(key, value, ttl);
  }
  return cache.set(key, value);
};

export const deleteFromCache = (key: string): number => {
  return cache.del(key);
};

export const flushCache = (): void => {
  cache.flushAll();
};

export const getCacheStats = (): NodeCache.Stats => {
  return cache.getStats();
};

export default cache;
