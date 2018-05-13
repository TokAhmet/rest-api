let allEntries = [];
let allComments = [];
let test;

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

function getLimit() {
	fetch('api/entries/limit/' + test)
	.then(res => res.json())
	.then(console.log);
}

getLimit();

function removeEntry(entryID) {
	fetch('api/entries/' + entryID,
	{method: 'DELETE'})
	.then(res => res.json())
	.then(console.log);
}

function removeComment(entryID) {
	fetch('api/comments/' + entryID,
		{ method: 'DELETE' })
		.then(res => res.json())
		.then(console.log);
}

function editEntry(entryID, body) {
	const postOptions = {
		method: 'PATCH',
		headers: {
			"Content-Type" : "application/x-www-form-urlencoded"
		},
		body: body,
		// MUCH IMPORTANCE!
		credentials: 'include'
	}

	fetch('api/entries/' + entryID, postOptions)
		.then(res => res.json())
		.then((newTodo) => {
			console.log(newTodo)
		});
}

function createEditForm(entry){
	let formDiv = document.createElement('div');
	let editForm = document.createElement('form');
	let titleDiv = document.createElement('div');
	let titleInput = document.createElement('input');

	formDiv.classList.add('modal')
	editForm.classList.add('modal-content')
	titleInput.setAttribute('type', 'text');
	titleInput.name = "title";
	titleInput.value = entry.title;
	titleDiv.appendChild(titleInput);
	editForm.appendChild(titleDiv);

	let contentDiv = document.createElement('div');
	let contentInput = document.createElement('textarea');
	contentInput.name = "content";
	contentInput.value = entry.content;
	contentDiv.appendChild(contentInput);
	editForm.appendChild(contentDiv);

	let formButton = document.createElement('input');
	formButton.type = "submit";
	formButton.innerHTML = "Update";
	editForm.addEventListener('submit', function(e) {
		e.preventDefault();
		const body = `content=${contentInput.value}&title=${titleInput.value}`;
		editEntry(entry.entryID, body);
	})
	editForm.appendChild(formButton);
	formDiv.appendChild(editForm);
	document.body.appendChild(formDiv);
}

function postComment(entryID, commentContent) {
	// x-www-form-urlencoded
	const formData = new FormData();
	formData.append('entryID', entryID);
	formData.append('content', commentContent);

	const postOptions = {
		method: 'POST',
		body: formData,
		// MUCH IMPORTANCE!
		credentials: 'include'
	}

	fetch('api/comments', postOptions)
		.then(res => res.json())
		.then((newTodo) => {
			document.body.insertAdjacentHTML('beforeend', newTodo.data.content);
		});
}

function getAllComments() {
	fetch('api/comments')
	.then(res => res.json())
	.then(function (comments) {
		allComments = comments;
	})
}

getAllComments();

function getAllEntries() {
	let entryOutput = document.getElementById('entry');
	fetch('api/entries')
	.then(res => res.json())
	.then(function (entries) {
		allEntries = entries;

		return entries.data.forEach(entry => {
			let entryDiv = document.createElement('div');
			let entryTitle = document.createElement('h3');
			entryDiv.id = entry.entryID;
			entryTitle.innerHTML = entry.title;
			entryDiv.appendChild(entryTitle);
			
			let entryContent = document.createElement('p');
			entryContent.innerHTML = entry.content;
			entryDiv.appendChild(entryContent);
			
			let entryDeleteButton = document.createElement('button');
			entryDeleteButton.innerHTML = 'Delete';
			entryDeleteButton.addEventListener('click', function(e) {
				removeEntry(entry.entryID);
				location.reload();
			})
			entryDiv.appendChild(entryDeleteButton);

			let entryEditButton = document.createElement('button');
			entryEditButton.innerHTML = 'Edit';
			entryEditButton.addEventListener('click', function(e) {
				const editID = this.parentElement.id;
				const entry = allEntries.data.find(filterEntry => filterEntry.entryID === editID);
				createEditForm(entry);
				const modal = document.getElementsByClassName("modal")[0];
				modal.style.display = "block";
				console.log(entry);
			})
			entryDiv.appendChild(entryEditButton);			

			let commentDiv = document.createElement('div');
			let commentTextarea = document.createElement('textarea');
			commentDiv.appendChild(commentTextarea);
			
			let addCommentButton = document.createElement('button');
			addCommentButton.innerHTML = "Add Comment";
			addCommentButton.addEventListener('click', function(e) {
				const entryID = this.parentElement.parentElement.id;
				postComment(entryID, commentTextarea.value);
				location.reload();
			});
			commentDiv.appendChild(addCommentButton);

			allComments.data.forEach(comment => {
				if(comment.entryID === entry.entryID) {
					let postedCommentDiv = document.createElement('div');
					let commentContent = document.createElement('p');
					commentContent.innerHTML = comment.content;
					
					let deleteCommentButton = document.createElement('button');
					deleteCommentButton.innerHTML = 'Delete Comment';
					deleteCommentButton.addEventListener('click', (e) => {
						removeComment(comment.commentID);
						location.reload();
					})
					
					postedCommentDiv.appendChild(commentContent);
					postedCommentDiv.appendChild(deleteCommentButton);
					commentDiv.appendChild(postedCommentDiv);
				}
			})

			entryDiv.appendChild(commentDiv);			
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