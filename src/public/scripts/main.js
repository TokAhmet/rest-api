function main() {
  fetch('api/facebook')
    .then(res => res.json())
    .then(console.log);
}

function getAllUsers() {
  fetch('api/users')
    .then(res => res.json())
    .then(console.log);
}

function login() {
  const formData = new FormData();
  const loginUsername = document.getElementById('loginUsername').value;
  const loginPassword = document.getElementById('loginPassword').value;
  formData.append('username', loginUsername);
  formData.append('password', loginPassword);
  const postOptions = {
    method: 'POST',
    body: formData,
    // DON'T FORGET
    credentials: 'include'
  }

  fetch('/login', postOptions)
    .then(res => res.json())
    .then(console.log);
}

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login();
  loginForm.reset();
  location.reload();
});

function register() {
  const formData = new FormData();
  const registerUsername = document.getElementById('registerUsername').value;
  const registerPassword = document.getElementById('registerPassword').value;
  formData.append('username', registerUsername);
  formData.append('password', registerPassword);

  const postOptions = {
    method: 'POST',
    body: formData,
    // MUCH IMPORTANCE!
    credentials: 'include'
  }

  fetch('/register', postOptions)
    .then(res => res.json())
    .then(console.log);
}

const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  register();
  registerForm.reset();
});

function postEntry() {
  // x-www-form-urlencoded
  const formData = new FormData();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  formData.append("title", title);
  formData.append('content', content);


  const postOptions = {
    method: 'POST',
    body: formData,
    // MUCH IMPORTANCE!
    credentials: 'include'
  }

  fetch('api/entries', postOptions)
    .then(res => res.json())
}

const entryForm = document.getElementById('entryForm');
entryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  postEntry();
  entryForm.reset();
});

// const form = document.getElementById('newTodo');
// form.addEventListener('submit', function(e) {
//   e.preventDefault();
//   const formData = new FormData(this);
// });
//