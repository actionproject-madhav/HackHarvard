// Offline capability using Service Worker
export const cacheData = (key: string, data: any): boolean => {
  try {
    localStorage.setItem(`offline_${key}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error caching data:', error);
    return false;
  }
};

export const getCachedData = (key: string): any => {
  try {
    const data = localStorage.getItem(`offline_${key}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
};

export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const registerOfflineListener = (callback: (isOnline: boolean) => void): void => {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
};
