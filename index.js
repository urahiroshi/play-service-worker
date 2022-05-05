const showResponse = (content) => {
  const targetElem = document.getElementById('response');
  targetElem.textContent = content;
};

const showAuthorization = (content) => {
  const targetElem = document.getElementById('authorization');
  targetElem.textContent = `Authorization=${content}`;
};

const callApi = async () => {
  const res = await fetch('https://httpbin.org/get');
  if (res.ok) {
    const resJson = await res.json();
    showResponse(JSON.stringify(resJson));
    showAuthorization(resJson.headers.Authorization);
  } else {
    alert('response is failed');
    console.error(res.status);
  }
};

const createCallApiWithWorker = () => {
  let worker;
  return () => {
    if (!worker) {
      worker = new Worker('./dedicated-worker.js');
      worker.onmessage = (e) => {
        const res = e.data;
        if (res.ok) {
          showResponse(JSON.stringify(res.json));
          showAuthorization(res.json.headers.Authorization);  
        } else {
          alert('response is failed');
          console.error(res.status);
        }
      };
    }
    worker.postMessage({
      url: 'https://httpbin.org/get'
    });
  };
};

const createCallApiWithSharedWorker = () => {
  let worker;
  return () => {
    if (!worker) {
      worker = new SharedWorker('./shared-worker.js');
      worker.port.start();
      worker.port.onmessage = (e) => {
        const res = e.data;
        if (res.ok) {
          showResponse(JSON.stringify(res.json));
          showAuthorization(res.json.headers.Authorization);  
        } else {
          alert('response is failed');
          console.error(res.status);
        }
      };
    }
    worker.port.postMessage({
      url: 'https://httpbin.org/get'
    });
  };
}

const registerServiceWorker = async () => {
  await navigator.serviceWorker.register(
    '/service-worker.js',
    {
      scope: '/',
    }
  );
  await updateServiceWorkerStatus();
};

const unregisterServiceWorker = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    return;
  }
  await registration.unregister();
  await updateServiceWorkerStatus();
}

const updateServiceWorkerStatus = async () => {
  const statusElem = document.getElementById('service-worker-status');
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    statusElem.textContent = 'Service Worker registered';
    console.log({ registration });
  } else {
    statusElem.textContent = 'No registered Service Worker'
  }
};

window.addEventListener('load', async () => {
  [
    { id: 'call-api', onClick: callApi },
    { id: 'register-service-worker', onClick: registerServiceWorker },
    { id: 'unregister-service-worker', onClick: unregisterServiceWorker },
    { id: 'call-api-worker', onClick: createCallApiWithWorker() },
    { id: 'call-api-shared-worker', onClick: createCallApiWithSharedWorker() },
  ].forEach(({ id, onClick }) => {
    const button = document.getElementById(id);
    button.addEventListener('click', onClick);
  });
  await updateServiceWorkerStatus();
});
