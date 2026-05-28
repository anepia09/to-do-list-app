const fs = require('fs');
const dataFile = 'todos.json';

function loadTodos() {
  try { return JSON.parse(fs.readFileSync(dataFile, 'utf8')); }
  catch { return []; }
}

function saveTodos() {
  fs.writeFileSync(dataFile, JSON.stringify(todos));
}

let todos = loadTodos();
let nextId = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;

function render() {
  const list = document.getElementById('todo-list');
  const total = todos.length;
  const done = todos.filter(t => t.done).length;
  document.getElementById('total-count').textContent = total;
  document.getElementById('done-count').textContent = done;
  document.getElementById('left-count').textContent = total - done;

  list.innerHTML = '';

  if (!todos.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No tasks yet';
    list.appendChild(empty);
    return;
  }

  todos.forEach(todo => {
    const item = document.createElement('div');
    item.className = 'todo-item' + (todo.done ? ' done' : '');

    const checkBtn = document.createElement('button');
    checkBtn.className = 'check-btn';
    checkBtn.setAttribute('aria-label', todo.done ? 'Uncheck task' : 'Check task');
    checkBtn.textContent = todo.done ? '✓' : '';
    checkBtn.onclick = () => { todo.done = !todo.done; saveTodos(); render(); };

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const delBtn = document.createElement('button');
    delBtn.className = 'del-btn';
    delBtn.setAttribute('aria-label', 'Delete task');
    delBtn.textContent = '✕';
    delBtn.onclick = () => { todos = todos.filter(t => t.id !== todo.id); saveTodos(); render(); };

    item.appendChild(checkBtn);
    item.appendChild(text);
    item.appendChild(delBtn);
    list.appendChild(item);
  });
}

function addTodo() {
  const input = document.getElementById('todo-input');
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: nextId++, text, done: false });
  saveTodos();
  input.value = '';
  render();
}

document.getElementById('add-btn').onclick = addTodo;
document.getElementById('todo-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});
document.getElementById('clear-btn').onclick = () => {
  todos = todos.filter(t => !t.done);
  saveTodos();
  render();
};

render();
