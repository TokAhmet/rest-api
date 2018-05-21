let allEntries = [];
let allComments = [];

function main(){
	fetch('api/facebook')
	.then(res => res.json())
	.then(console.log);
}

function getAllLikes(entryID){
	const postOptions = {
		method: 'GET',
		credentials: 'include'
	}
	
	return fetch('api/likes/' + entryID, postOptions) 
	.then(res => res.json());
}


function removeLike(entryID) {
	fetch('api/likes/' + entryID,{
		method: 'DELETE',
		credentials: 'include'
	})
	.then(res => res.json())
	.then(console.log);
}

function postLike(entryID) {
	// x-www-form-urlencoded
	const formData = new FormData();
	formData.append('entryID', entryID);
	
	const postOptions = {
		method: 'POST',
		body: formData,
		// MUCH IMPORTANCE!
		credentials: 'include'
	}
	
	fetch('api/likes', postOptions)
	.then(res => res.json())
	.then((newTodo) => {
		document.body.insertAdjacentHTML('beforeend', newTodo.data.content);
	});
}

function searchByTitle(title){
	let entryOutput = document.getElementById('entry');
	entryOutput.innerHTML = "";
	fetch('api/entries/title/' + title)
	.then(res => res.json())
	.then(function(entries) {
		createEntry(entries);
	});
}

function searchController(){
	let searchForm = document.getElementById('searchForm');
	searchForm.addEventListener('submit', (e) => {
		e.preventDefault();
		let title = document.getElementById('searchValue').value;
		searchByTitle(title);
	})
}
searchController();

function getAllUsers(){
	fetch('api/users')
	.then(res => res.json())
	.then(console.log);
}

function getOneUser() {
	return fetch('api/user', {
		credentials: 'include'
	})
	.then(res => res.json())
}

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

function createEntry(entries){
	let entryOutput = document.getElementById('entry');
	
	allEntries = entries;
	
	return entries.data.forEach(async entry => {
		let entryDiv = document.createElement('div');
		let entryTitle = document.createElement('h3');
		entryDiv.id = entry.entryID;
		entryTitle.innerHTML = entry.title;
		entryDiv.appendChild(entryTitle);
		
		let entryContent = document.createElement('p');
		entryContent.innerHTML = entry.content;
		entryDiv.appendChild(entryContent);

		const loggedInUser = await getOneUser();

		if (loggedInUser.data.userID === entry.createdBy || loggedInUser.data.admin == 1) {
			let entryDeleteButton = document.createElement('button');
			entryDeleteButton.innerHTML = 'Delete';
			entryDeleteButton.addEventListener('click', function (e) {
				removeEntry(entry.entryID);
				location.reload();
			})
			entryDiv.appendChild(entryDeleteButton);
			
			let entryEditButton = document.createElement('button');
			entryEditButton.innerHTML = 'Edit';
			entryEditButton.addEventListener('click', function (e) {
				const editID = this.parentElement.id;
				const entry = allEntries.data.find(filterEntry => filterEntry.entryID === editID);
				createEditForm(entry);
				const modal = document.getElementsByClassName("modal")[0];
				modal.style.display = "block";
			})
			entryDiv.appendChild(entryEditButton);
		}
		
		const likeResponse = await getAllLikes(entry.entryID);

		if (likeResponse.data){
			let removeLikeButton = document.createElement('button');
			removeLikeButton.innerHTML = "Remove like";
			removeLikeButton.addEventListener('click', (e) => {
				removeLike(entry.entryID);
			})
			entryDiv.appendChild(removeLikeButton);
		}
		else{
			let likeButton = document.createElement('button');
			likeButton.innerHTML = "Like";
			likeButton.addEventListener('click', (e) => {
				postLike(entry.entryID);
			})
			entryDiv.appendChild(likeButton);
		}
		
		let commentDiv = document.createElement('div');
		let commentTextarea = document.createElement('textarea');
		commentDiv.appendChild(commentTextarea);
		
		let addCommentButton = document.createElement('button');
		addCommentButton.innerHTML = "Add Comment";
		addCommentButton.addEventListener('click', function (e) {
			const entryID = this.parentElement.parentElement.id;
			postComment(entryID, commentTextarea.value);
			location.reload();
		});
		commentDiv.appendChild(addCommentButton);
		
		allComments.data.forEach(comment => {
			if (comment.entryID === entry.entryID) {
				let postedCommentDiv = document.createElement('div');
				let commentContent = document.createElement('p');
				commentContent.innerHTML = comment.content;
				postedCommentDiv.appendChild(commentContent);
				
				if(loggedInUser.data.userID === comment.createdBy || loggedInUser.data.admin == 1) {
					let deleteCommentButton = document.createElement('button');
					deleteCommentButton.innerHTML = 'Delete Comment';
					deleteCommentButton.addEventListener('click', (e) => {
						removeComment(comment.commentID);
						location.reload();
					})
					
					postedCommentDiv.appendChild(deleteCommentButton);
				}
				
				commentDiv.appendChild(postedCommentDiv);
			}
		});
		
		entryDiv.appendChild(commentDiv);
		entryOutput.appendChild(entryDiv);
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
		location.reload();
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
		createEntry(entries);
	});
}
getAllEntries();

function postEntry(){
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
	postEntry();
	postForm.reset();
	location.reload();
});