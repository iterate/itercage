import { Non2xxResponseError } from './errors';

const isJson = response => {
  const contentType = response.headers.get('content-type');

  return contentType && contentType.indexOf('application/json') !== -1;
};

async function itercageFetch(path, options = {}) {
  const { headers = {} } = options;

  const response = await fetch(path, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers
    }
  });

  const responseContent = isJson(response)
    ? await response.json()
    : await response.text();

  if (response.ok) {
    return responseContent;
  } else {
    const message = `Failed to fetch ${response.url} (${response.status} ${
      response.statusText
    }). Response content: ${JSON.stringify(responseContent)}`;

    throw new Non2xxResponseError(responseContent, message);
  }
}

export default {
  get: path => {
    return itercageFetch(path);
  },
  post: (path, data) => {
    return itercageFetch(path, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  delete: (path, data) => {
    return itercageFetch(path, {
      method: 'DELETE',
      body: JSON.stringify(data)
    });
  }
};
