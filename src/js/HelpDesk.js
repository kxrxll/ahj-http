export default class HelpDesk {
  constructor(el) {
    this.el = el;
    this.container = this.el.querySelector('.container');
    this.editButton = this.el.querySelector('.edit');
    this.deleteButton = this.el.querySelector('.remove');
    this.newTicketButton = this.el.querySelector('.button');
    this.popover = this.el.querySelector('.popover');
    this.form = this.popover.querySelector('.ticketedit');
    this.approveTicketButton = this.form.querySelector('.ok');
    this.closePopupButton = this.form.querySelector('.close');
    this.deletionPopup = this.el.querySelector('.delete');
    this.approveDeleteButton = this.deletionPopup.querySelector('.submit_delete');
    this.cancelDeleteButton = this.deletionPopup.querySelector('.close_delete');
  }

  init() {
    // Load tickets from server
    this.getAllTickets();
    // Add listeners
    this.newTicketButton.addEventListener('click', () => {
      this.popover.classList.remove('hidden');
    });
    this.closePopupButton.addEventListener('click', () => {
      this.popover.classList.add('hidden');
    });
    this.deleteButton.addEventListener('click', () => {
      this.deletionPopup.classList.remove('hidden');
    });
    this.cancelDeleteButton.addEventListener('click', () => {
      this.deletionPopup.classList.add('hidden');
    });
    this.approveTicketButton.addEventListener('click', this.createTicket.bind(this));
    this.approveDeleteButton.addEventListener('click', this.deleteTicket);
  }

  getAllTickets() {
    const url = 'https://helpdesk-kxrxll.herokuapp.com/?method=allTickets';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          this.drawList(JSON.parse(xhr.response));
        }
      }
    });
    xhr.send();
  }

  getTicketDescription(evt) {
    const { id } = evt.target.closest('.ticket').dataset;
    const url = `https://helpdesk-kxrxll.herokuapp.com/?method=getTicket&id=${id}`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          this.description = document.createElement('p');
          this.description.textContent = xhr.response;
          evt.target.appendChild(this.description);
        }
      }
    });
    xhr.send();
  }

  createTicket() {
    const params = [
      `name=${this.form.querySelector('.description').value}&description=${
        encodeURIComponent(this.form.querySelector('.fulldescription').value)}`,
    ];
    const url = 'https://helpdesk-kxrxll.herokuapp.com/?method=postTicket';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          this.popover.classList.add('hidden');
          this.getAllTickets();
        }
      }
    });
    xhr.send(params);
  }

  drawList(arr) {
    this.container.innerHTML = '';
    for (const element of arr) {
      const newTicket = document.createElement('div');
      newTicket.classList.add('ticket');
      newTicket.dataset.id = element.id;
      newTicket.innerHTML = `
        <input type="checkbox">
        <p class="description">${element.name}</p>
        <p class="time">${element.created}</p>
        <div class="edit">Edit</div>
        <div class="remove">Delete</div>
      `;
      newTicket.querySelector('.description').addEventListener('click', this.getTicketDescription.bind(this));
      this.container.appendChild(newTicket);
    }
  }
}
