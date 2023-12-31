Pusher.logToConsole = true;

const pusher = new Pusher(
  '280638f54721b27e6878', // Add your API key
  {
    cluster: 'mt1', // Add your cluster
  },
);

const channel = pusher.subscribe('delivery-channel');
channel.bind('location-update-event', (data) => {
  if (data) {
    renderMessage(typeof data === 'string' ? data : data?.message);
  }
});

function renderMessage(message) {
  const container = document.querySelector('.messages');
  const eventElement = createElement('div', 'event', message);
  container.appendChild(eventElement);
}

function createElement(type, className, html) {
  const element = document.createElement(type);
  element.className = className;
  element.innerHTML = html;

  return element;
}
