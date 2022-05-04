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
}

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
  const callApiButton = document.getElementById('call-api');
  callApiButton.addEventListener('click', callApi);
  const registerServiceWorkerButton = document.getElementById('register-service-worker');
  registerServiceWorkerButton.addEventListener('click', registerServiceWorker);
  const updateServiceWorkerButton = document.getElementById('update-service-worker');
  updateServiceWorkerButton.addEventListener('click', updateServiceWorker);
});
