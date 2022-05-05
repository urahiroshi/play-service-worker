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

const registerServiceWorker = async () => {
  const registration = await navigator.serviceWorker.register(
    '/service-worker.js',
    {
      scope: '/',
    }
  );
  if (registration.installing) {
    console.log('Service worker installing');
  } else if (registration.waiting) {
    console.log('Service worker installed');
  } else if (registration.active) {
    console.log('Service worker active');
  }
};

const updateServiceWorker = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    registration.update();
  } else {
    console.log('no registered service worker');
  }
};

window.addEventListener('load', () => {
  [
    { id: 'call-api', onClick: callApi },
    { id: 'register-service-worker', onClick: registerServiceWorker },
    { id: 'update-service-worker', onClick: updateServiceWorker },
    { id: 'call-api-worker', onClick: createCallApiWithWorker() },
  ].forEach(({ id, onClick }) => {
    const button = document.getElementById(id);
    button.addEventListener('click', onClick);
  });
});
