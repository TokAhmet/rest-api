function logout() {
    fetch('/logout', { credentials: 'include' })
    .then(res => res.json())
    .then(console.log);
}

const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
    location.reload();
});