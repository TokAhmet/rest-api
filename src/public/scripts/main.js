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

function removeEntry(entryID) {
	fetch('removeEntry/' + entryID,
	{method: 'DELETE'})
	.then(res => res.json())
	.then(console.log);
}

function getAllEntries() {
	let entryOutput = document.getElementById('entry');
	fetch('api/entries')
	.then(res => res.json())
	.then(function (entries) {
		return entries.data.forEach(entry => {
			let entryDiv = document.createElement('div');
			let entryTitle = document.createElement('h3');
			entryTitle.innerHTML = entry.title;
			entryDiv.appendChild(entryTitle);

			let entryContent = document.createElement('p');
			entryContent.innerHTML = entry.content;
			entryDiv.appendChild(entryContent);

			let entryButton = document.createElement('button');
			entryButton.innerHTML = 'Delete';
			entryButton.addEventListener('click', (e) => {
				removeEntry(entry.entryID);
				location.reload();
			})
			entryDiv.appendChild(entryButton);

			entryOutput.appendChild(entryDiv);		
		});
	})
	.then(console.log);
}

getAllEntries();

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

const postForm = document.getElementById('postForm');
postForm.addEventListener('submit', (e) => {
	e.preventDefault();
	postTodo();
	postForm.reset();
	location.reload();
});



/* function printToHtml() {
	entries.data.foreach(entry => {
		let entryTitle = document.getElementById('entryTitle');
		entryTitle.innerHTML = entry.title;
		let entryContent = document.getElementById('entryContent');
		entryContent.innerHTML = entry.content;
	});
} */


/* const form = document.getElementById('newTodo');
form.addEventListener('submit', function (e) {
	e.preventDefault();
	const formData = new FormData(this);
}); */

/* const addTodoButton = document.getElementById('addTodo');
addTodoButton.addEventListener('click', postTodo); */