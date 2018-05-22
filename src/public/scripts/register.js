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
  window.location.href = "http://localhost:3000/";
});
