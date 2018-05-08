function register() {
    const formData = new FormData();
    const usernameInput = document.getElementById('registerUsername').value;
    const passwordInput = document.getElementById('registerPassword').value;
    formData.append('username', usernameInput);
    formData.append('password', passwordInput);
    const postOptions = {
        method: 'POST',
        body: formData,
        // DON'T FORGET
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