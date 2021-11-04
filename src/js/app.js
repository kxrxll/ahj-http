import HelpDesk from './HelpDesk';

const helpDesk = new HelpDesk(document.querySelector('body'));
helpDesk.init();

/*
const subscribeForm = document.querySelector('form');
subscribeForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const params = Array.from(subscribeForm.elements)
    .filter(({ name }) => name)
    .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
    .join('&');
  const url = 'http://localhost:7070';
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // event listener here
  xhr.send(params);
  evt.preventDefault();
  const queryString = Array.from(subscribeForm.elements)
    .filter(({ name }) => name)
    .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
    .join('&');
  const url = `http://localhost:7070/?${queryString}`;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  // event listener here
  xhr.send();
});
*/
