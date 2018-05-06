function main(){
	fetch('api/facebook')
	.then(res => res.json())
	.then(console.log);
}

function getAllUsers(){
	fetch('api/users')
	.then(res => res.json())
	.then(console.log);
}

function postTodo(){
	// x-www-form-urlencoded
	const formData = new FormData();
	const todoTitle = document.getElementById('title');
	const todoInput = document.getElementById('content');
	formData.append('title', todoTitle.value);
	formData.append('content', todoInput.value);
	
	const postOptions = {
		method: 'POST',
		body: formData,
		// MUCH IMPORTANCE!
		credentials: 'include'
	}
	
	fetch('api/entries', postOptions)
	.then(res => res.json())
	.then((newTodo) => {
		document.body.insertAdjacentHTML('beforeend', newTodo.data.content);
	});
}

function login(){
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

function register(){
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

/* const form = document.getElementById('newTodo');
form.addEventListener('submit', function (e) {
	e.preventDefault();
	const formData = new FormData(this);
}); */

/* const addTodoButton = document.getElementById('addTodo');
addTodoButton.addEventListener('click', postTodo); */