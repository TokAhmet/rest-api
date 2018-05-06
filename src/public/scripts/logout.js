function logout() {
  fetch('/logout', { credentials: "include" })
    .then(res => res.json())
    .then(console.log);
}

const userLogout = document.getElementById('navLogout');
userLogout.addEventListener('click', (e) => {
  e.preventDefault();
  logout();
  location.reload();
});
