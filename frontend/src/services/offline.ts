// Offline capability using Service Worker
export const cacheData = (key, data) => {
  try {
    localStorage.setItem(`offline_${key}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error caching data:', error);
    return false;
  }
};

export const getCachedData = (key) => {
  try {
    const data = localStorage.getItem(`offline_${key}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
};

export const isOnline = () => {
  return navigator.onLine;
};

export const registerOfflineListener = (callback) => {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
};