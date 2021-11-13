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

  createTicket(evt) {
    let params = [];
    if (!evt.target.dataset.id) {
      params = [
        `name=${this.form.querySelector('.description').value}
        &description=${
  encodeURIComponent(this.form.querySelector('.fulldescription').value)}`];
    } else {
      params = [
        `name=${this.form.querySelector('.description').value}
      &description=${
  encodeURIComponent(this.form.querySelector('.fulldescription').value)}
        &id=${
  encodeURIComponent(evt.target.dataset.id)}`,
      ];
    }
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

      newTicket.querySelector('.edit').addEventListener('click', this.editTicket.bind(this));

      newTicket.querySelector('.remove').addEventListener('click', this.deleteTicket.bind(this));

      this.container.appendChild(newTicket);
    }
  }

  editTicket(evt) {
    const short = evt.target.closest('.ticket').querySelector('.description').textContent;
    const { id } = evt.target.closest('.ticket').dataset;
    const url = `https://helpdesk-kxrxll.herokuapp.com/?method=getTicket&id=${id}`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const fulldescription = xhr.response;
          this.popover.classList.remove('hidden');
          document.querySelector('input.fulldescription').value = fulldescription;
        }
      }
    });
    xhr.send();
    this.popover.classList.remove('hidden');
    document.querySelector('input.description').value = short;
    document.querySelector('.ok').dataset.id = id;
  }

  deleteTicket(evt) {
    const { id } = evt.target.closest('.ticket').dataset;
    const url = `https://helpdesk-kxrxll.herokuapp.com/?method=deleteTicket&id=${id}`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          this.getAllTickets();
        }
      }
    });
    xhr.send();
  }
}
