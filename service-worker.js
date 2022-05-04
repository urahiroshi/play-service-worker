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

const customRequest2 = (request) => {
  if (!request.url.startsWith('https://httpbin.org')) {
    return request;
  }
  return new Request(request, {
    headers: {
      ...request.headers,
      ...{
        hoge: 'hogehoge',
      },
    },
  });
};

self.addEventListener('fetch', (event) => {
  const newRequest = customRequest(event.request);
  event.respondWith(fetch(newRequest));
});

self.addEventListener('fetch', (event) => {
  const newRequest = customRequest2(event.request);
  event.respondWith(fetch(newRequest));
});
