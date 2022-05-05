const authValue = self.crypto.randomUUID();

self.onmessage = async (e) => {
  const { url } = e.data;
  const res = await fetch(new Request(url, {
    headers: {
      Authorization: authValue,
    },
  }));
  if (res.ok) {
    const resJson = await res.json();
    self.postMessage({
      ok: res.ok,
      status: res.status,
      json: resJson,
    });
  } else {
    self.postMessage({
      ok: res.ok,
      status: res.status,
    });
  }
};
