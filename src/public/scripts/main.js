function main() {
  fetch('api/todos')
    .then(res => res.json())
    .then(console.log);
}

function getAllUsers() {
  fetch('api/users')
    .then(res => res.json())
    .then(console.log);
}

function postTodo() {
  // x-www-form-urlencoded
  const formData = new FormData();
  const title = document.getElementById('title');
  const content = document.getElementById('content');
  formData.append("title", title.value);
  formData.append('content', content.value);


  const postOptions = {
    method: 'POST',
    body: formData,
    // MUCH IMPORTANCE!
    credentials: 'include'
  }

  fetch('api/entries', postOptions)
    .then(res => res.json())
}


function login() {
  const formData = new FormData();
  formData.append('username', 'goran');
  formData.append('password', 'bunneltan');
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

const form = document.getElementById('newTodo');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
});

const addTodoButton = document.getElementById('addTodo');
addTodoButton.addEventListener('click', postTodo);