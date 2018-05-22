let allEntries = [];
let allComments = [];

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
		let cardDiv = document.createElement('div');
		cardDiv.classList.add('card');
		cardDiv.classList.add('mt-md-5');

		let entryDiv = document.createElement('div');
		entryDiv.classList.add('card-body');
		
		let entryTitle = document.createElement('h3');
		entryTitle.classList.add('card-title');
		entryDiv.id = entry.entryID;
		entryTitle.innerHTML = entry.title;
		entryDiv.appendChild(entryTitle);
		
		let entryContent = document.createElement('p');
		entryContent.classList.add('card-text');
		entryContent.innerHTML = entry.content;
		entryDiv.appendChild(entryContent);

		const loggedInUser = await getOneUser();

		if (loggedInUser.data.userID === entry.createdBy || loggedInUser.data.admin == 1) {
			let entryDeleteButton = document.createElement('button');
			entryDeleteButton.innerHTML = 'Delete';
			entryDeleteButton.classList.add('btn');
			entryDeleteButton.classList.add('btn-danger');
			entryDeleteButton.addEventListener('click', function (e) {
				removeEntry(entry.entryID);
				location.reload();
			})
			entryDiv.appendChild(entryDeleteButton);
			
			let entryEditButton = document.createElement('button');
			entryEditButton.innerHTML = 'Edit';
			entryEditButton.classList.add('btn');
			entryEditButton.classList.add('btn-primary');
			entryEditButton.addEventListener('click', function (e) {
				const editID = this.parentElement.id;
				const entry = allEntries.data.find(filterEntry => filterEntry.entryID === editID);
				createEditForm(entry);
				const modal = document.getElementsByClassName("modal")[0];
				modal.style.display = "block";
				window.onclick = function(e) {
					if (e.target == modal){
						modal.style.display = "none";
					}
				}
			})
			entryDiv.appendChild(entryEditButton);
		}
		
		const likeResponse = await getAllLikes(entry.entryID);

		if (likeResponse.data){
			let removeLikeButton = document.createElement('button');
			removeLikeButton.innerHTML = "Remove like";
			removeLikeButton.classList.add('btn');
			removeLikeButton.classList.add('btn-warning');
			removeLikeButton.addEventListener('click', (e) => {
				removeLike(entry.entryID);
			})
			entryDiv.appendChild(removeLikeButton);
		}
		else{
			let likeButton = document.createElement('button');
			likeButton.innerHTML = "Like";
			likeButton.classList.add('btn');
			likeButton.classList.add('btn-success');
			likeButton.addEventListener('click', (e) => {
				postLike(entry.entryID);
			})
			entryDiv.appendChild(likeButton);
		}
		
		let commentDiv = document.createElement('div');
		commentDiv.classList.add('card-body');
		let commentTextarea = document.createElement('textarea');
		commentTextarea.classList.add('form-control');
		commentDiv.appendChild(commentTextarea);
		
		let addCommentButton = document.createElement('button');
		addCommentButton.innerHTML = "Add Comment";
		addCommentButton.classList.add('btn');
		addCommentButton.classList.add('btn-primary');
		addCommentButton.classList.add('mt-md-2');

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
					deleteCommentButton.classList.add('btn');
					deleteCommentButton.classList.add('btn-danger');
					deleteCommentButton.addEventListener('click', (e) => {
						removeComment(comment.commentID);
						location.reload();
					})
					
					postedCommentDiv.appendChild(deleteCommentButton);
				}
				
				commentDiv.appendChild(postedCommentDiv);
			}
		});
		

		cardDiv.appendChild(entryDiv);
		cardDiv.appendChild(commentDiv);		
		entryOutput.appendChild(cardDiv);
	});
}

function createEditForm(entry){
	let modal = document.querySelector('#editModal');

	let titleInput = modal.querySelector('#title');
	titleInput.name = "title";
	titleInput.value = entry.title;
		
	let contentInput = modal.querySelector('#content');

	contentInput.name = "content";
	contentInput.value = entry.content;

	let closeBtn = modal.querySelector('#closeBtn');
	closeBtn.addEventListener('click', function(e) {
		modal.style.display = "none";
	})

	let formButton = modal.querySelector('#updateBtn');
	formButton.addEventListener('click', function(e) {
		const body = `content=${contentInput.value}&title=${titleInput.value}`;
		editEntry(entry.entryID, body);
		location.reload();
	})
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