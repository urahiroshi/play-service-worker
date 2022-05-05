const authValue = self.crypto.randomUUID();

self.onconnect = (e) => {
  const port = e.ports[0];

  port.addEventListener('message', async (e) => {
    const { url } = e.data;
    const res = await fetch(new Request(url, {
      headers: {
        Authorization: authValue,
      },
    }));
    if (res.ok) {
      const resJson = await res.json();
      port.postMessage({
        ok: res.ok,
        status: res.status,
        json: resJson,
      });
    } else {
      port.postMessage({
        ok: res.ok,
        status: res.status,
      });
    }
  });

  port.start();
};
