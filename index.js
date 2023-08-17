

class TodoApp {
  constructor() {
    this.inputElement = document.getElementById('title');
    this.createBtn = document.getElementById('create');
    this.listElement = document.getElementById('list');
    this.searchBtn = document.getElementById('search1');
    this.notes = JSON.parse(localStorage.getItem('notes')) || [];

    this.createBtn.addEventListener('click', this.createNote.bind(this));
    this.listElement.addEventListener('click', this.handleListClick.bind(this));
    this.searchBtn.addEventListener('click', this.searchNotes.bind(this));

    this.render();
  }

  saveToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  render() {
    this.listElement.innerHTML = '';
    if (this.notes.length === 0) {
      this.listElement.innerHTML = '<p>Нет элементов</p>';
    }
    for (let i = 0; i < this.notes.length; i++) {
      this.listElement.insertAdjacentHTML('beforeend', this.getNoteTemplate(this.notes[i], i));
    }
  }

  createNote() {
    if (this.inputElement.value.length === 0) {
      return;
    }
    const newNote = {
      title: this.inputElement.value,
      completed: false,
    };
    this.notes.push(newNote);
    this.saveToLocalStorage();
    this.render();
    this.inputElement.value = '';
  }

  handleListClick(event) {
    if (event.target.dataset.index) {
      const index = parseInt(event.target.dataset.index);
      const type = event.target.dataset.type;

      if (type === 'toggle') {
        this.notes[index].completed = !this.notes[index].completed;
      } else if (type === 'remove') {
        this.notes.splice(index, 1);
      } else if (type === 'edit') {
        this.notes[index].editing = true;
      } else if (type === 'save') {
        const editedInput = document.getElementById(`editInput-${index}`);
        this.notes[index].title = editedInput.value;
        this.notes[index].editing = false;
      }
      this.saveToLocalStorage();
      this.render();
    }
  }

  searchNotes() {
    const searchTerm = this.inputElement.value.trim().toLowerCase();

    if (searchTerm === '') {
      this.render();
      return;
    }

    const filteredNotes = this.notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm)
    );

    this.listElement.innerHTML = '';
    if (filteredNotes.length === 0) {
      this.listElement.innerHTML = '<p>Нет совпадающих элементов</p>';
    } else {
      filteredNotes.forEach((note, index) => {
        this.listElement.insertAdjacentHTML('beforeend', this.getNoteTemplate(note, index, true));
      });
    }
  }

  getNoteTemplate(note, index) {
    const editingTemplate = `
    <input type="text" class="form-control" value="${note.title}" id="editInput-${index}">
    <button class="btn btn-small btn-success" data-index="${index}" data-type="save">Save</button>
    <button class="btn btn-small btn-danger" data-type="remove" data-index="${index}">&times;</button>
  `;

  const viewTemplate = `
    <span class="${note.completed ? 'text-decoration-line-through' : ''}">${note.title}</span>
    <span>
      <button class="btn btn-small btn-${note.completed ? 'warning' : 'success'}" data-index="${index}" data-type="toggle">&check;</button>
      <button class="btn btn-small btn-danger" data-type="remove" data-index="${index}">&times;</button>
      <button class="btn btn-small btn-primary" data-type="edit" data-index="${index}">Edit</button>
    </span>
  `;

  return `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      ${note.editing ? editingTemplate : viewTemplate}
    </li>
  `;
  }
}

const todoApp = new TodoApp();
