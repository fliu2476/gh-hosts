import dns from "dns/promises";

export interface HostConfig {
  url: string;
  ip: string | null;
}

const lookup = async (url: string): Promise<string> => {
  const result = await dns.lookup(url);
  return result.address;
};

const retry = async <T>(fn: () => Promise<T>, retries: number): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      return retry(fn, retries - 1);
    }
    throw error;
  }
};

export const getHostConfig = async (url: string): Promise<HostConfig> => {
  try {
    const ip = await retry(() => lookup(url), 3);
    return { url, ip };
  } catch (error) {
    console.warn(`[Warn] Failed to resolve ${url}`);
    return { url, ip: null };
  }
};

export const resolveUrls = async (urls: string[]): Promise<HostConfig[]> => {
  const promises = urls.map(getHostConfig);
  return Promise.all(promises);
};
