function login() {
    const formData = new FormData();
    const usernameInput = document.getElementById('loginUsername').value;
    const passwordInput = document.getElementById('loginPassword').value;

    formData.append('username', usernameInput);
    formData.append('password', passwordInput);
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
    location.reload();
});