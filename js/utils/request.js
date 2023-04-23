import { cacheRequest, getFromCache } from './cacheControl.js';


const request = async (
  url = '',
  method = 'GET',
  data = null,
) => {
  const body = data === null ? null : (typeof data === 'object' ? JSON.stringify(data) : data);
  try {
    const cachedResponseData = await getFromCache('my-cache', url);

    if (cachedResponseData) {
      console.log('Getting response from cache');
      return cachedResponseData;
    }

    const response = await fetch(url, {
      method,
      body,
    });

    const responseData = await response.json();

    cacheRequest('my-cache', { url, responseData });

    console.log('Getting response from API');
    return responseData;
  } catch (error) {
    console.log(error);
  }
};

export default request;