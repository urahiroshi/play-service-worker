const authValue = self.crypto.randomUUID();

const customRequest = (request) => {
  if (!request.url.startsWith('https://httpbin.org')) {
    return request;
  }
  return new Request(request, {
    headers: {
      ...request.headers,
      ...{
        Authorization: authValue,
      },
    },
  });
};

self.addEventListener('fetch', (event) => {
  const newRequest = customRequest(event.request);
  event.respondWith(fetch(newRequest));
});
