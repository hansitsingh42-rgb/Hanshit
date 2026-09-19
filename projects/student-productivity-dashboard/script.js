const $ = (selector) => document.querySelector(selector);
const list = $('#taskList');
const SESSION_SECONDS = 25 * 60;
let timerId = null;
let remaining = SESSION_SECONDS;

function readTasks() {
  try {
    const stored = JSON.parse(localStorage.getItem('studentTasks') || '[]');
    return Array.isArray(stored)
      ? stored.filter((task) => task && typeof task.text === 'string').map((task) => ({
          text: task.text,
          done: Boolean(task.done)
        }))
      : [];
  } catch {
    return [];
  }
}

function readStudySeconds() {
  const value = Number(localStorage.getItem('studySeconds') || '0');
  return Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

let tasks = readTasks();
let studySeconds = readStudySeconds();

function save() {
  try {
    localStorage.setItem('studentTasks', JSON.stringify(tasks));
  } catch {
    // The dashboard continues to work for the current session if storage is unavailable.
  }
}

function saveStudyTime() {
  try {
    localStorage.setItem('studySeconds', String(studySeconds));
  } catch {
    // Keep the in-memory counter running when persistent storage is unavailable.
  }
}

function render() {
  list.replaceChildren();
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `task ${task.done ? 'done' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `Complete task: ${task.text}`);

    const label = document.createElement('label');
    label.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete';
    deleteButton.setAttribute('aria-label', `Delete task: ${task.text}`);
    deleteButton.textContent = '×';

    checkbox.onchange = () => {
      tasks[index].done = checkbox.checked;
      save();
      render();
    };
    deleteButton.onclick = () => {
      tasks.splice(index, 1);
      save();
      render();
    };

    li.append(checkbox, label, deleteButton);
    list.appendChild(li);
  });

  const done = tasks.filter((task) => task.done).length;
  $('#taskCount').textContent = `${done}/${tasks.length}`;
  $('#progress').textContent = tasks.length ? `${Math.round((done / tasks.length) * 100)}%` : '0%';
}

$('#taskForm').onsubmit = (event) => {
  event.preventDefault();
  const input = $('#taskInput');
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  input.value = '';
  save();
  render();
};

$('#clearBtn').onclick = () => {
  tasks = tasks.filter((task) => !task.done);
  save();
  render();
};

function formatStudyTime(total) {
  const hours = String(Math.floor(total / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const seconds = String(total % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function showTimer() {
  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
  const seconds = String(remaining % 60).padStart(2, '0');
  $('#timer').textContent = `${minutes}:${seconds}`;
  $('#studyTime').textContent = formatStudyTime(studySeconds);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startTimer() {
  if (timerId !== null) return;
  if (remaining <= 0) remaining = SESSION_SECONDS;

  timerId = setInterval(() => {
    remaining -= 1;
    studySeconds += 1;
    saveStudyTime();
    showTimer();

    if (remaining <= 0) {
      remaining = 0;
      stopTimer();
      alert('Focus session complete! Take a short break.');
    }
  }, 1000);
}

$('#startBtn').onclick = startTimer;
$('#resetBtn').onclick = () => {
  stopTimer();
  remaining = SESSION_SECONDS;
  showTimer();
};

$('#themeBtn').onclick = () => {
  document.body.classList.toggle('light');
  const theme = document.body.classList.contains('light') ? 'light' : 'dark';
  $('#themeBtn').textContent = theme === 'light' ? '☀' : '☾';
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Theme still works for the current session.
  }
};

try {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    $('#themeBtn').textContent = '☀';
  }
} catch {
  // Use the default dark theme when storage is unavailable.
}

render();
showTimer();
