const showResponse = (content) => {
  const targetElem = document.getElementById('response');
  targetElem.textContent = content;
};

const callApi = async () => {
  const res = await fetch('https://httpbin.org/get');
  if (res.ok) {
    const content = await res.text();
    showResponse(content);
  } else {
    alert('response is failed');
    console.error(res.status);
  }
}

window.addEventListener('load', () => {
  const callApiButton = document.getElementById('call-api');
  callApiButton.addEventListener('click', callApi);
});
