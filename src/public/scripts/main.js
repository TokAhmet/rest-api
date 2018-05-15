let allEntries = [];
let allComments = [];

function main() {
  fetch('api/facebook')
    .then(res => res.json())
    .then(console.log);
}

function getAllUsers() {
  fetch('api/users')
    .then(res => res.json())
    .then(console.log);
}

function getTitle(titleInput) {
  let entryOutput = document.getElementById('entryOutput');
  entryOutput.innerHTML = "";
  fetch('api/entries/title/' + titleInput)
    .then(res => res.json())
    .then(function(data) {
      createEntry(data);
    })
}

function searchForTitle() {
  let titleForm = document.getElementById('titleSearch');
  titleForm.addEventListener('submit', function(e) {
    let titleInput = document.getElementById('titleInput').value;
    e.preventDefault();
    getTitle(titleInput);
  });
}

searchForTitle();

function getComments() {
  fetch("api/comments")
    .then(res => res.json())
    .then(function(data) {

      allComments = data;
      console.log(allComments);

    });
}

getComments();

function postComment(entryID, commentContent) {
  // x-www-form-urlencoded
  const formData = new FormData();

  formData.append('entryID', entryID);
  formData.append("content", commentContent);

  const postOptions = {
    method: 'POST',
    body: formData,
    // MUCH IMPORTANCE!
    credentials: 'include'
  }

  fetch('api/comments', postOptions)
    .then(res => res.json())
    .then(console.log);
}

function removeComment(commentID) {
  fetch("api/comments/" + commentID, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(console.log);
}

function getAllEntries() {
  fetch("api/entries")
    .then(res => res.json())
    .then(function(data) {
      createEntry(data);
    })
    .then(console.log);
}

getAllEntries();

function updateEntry(entry) {
  let editDiv = document.createElement("div");
  editDiv.className = "modal";
  let editForm = document.createElement("form");

  let titleInput = document.createElement("input");
  titleInput.setAttribute('type', "text");
  titleInput.name = "title";
  titleInput.value = entry.title;
  editForm.appendChild(titleInput);

  let contentInput = document.createElement("textarea");
  contentInput.name = "content";
  contentInput.value = entry.content;
  editForm.appendChild(contentInput);

  let editButton = document.createElement("button");
  editButton.innerHTML = "Edit";
  editButton.addEventListener('submit', function(e) {
    e.preventDefault();
    const body = `content=${contentInput.value}&title=${titleInput.value}`;
    editEntry(entry.entryID, body);
    const modal = document.getElementsByClassName("modal")[0];
    modal.style.display = "none";
    location.reload();
  });

  let modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  editDiv.appendChild(modalContent);

  let modalBody = document.createElement("div");
  modalBody.className = "modal-body";
  modalContent.appendChild(modalBody);
  modalBody.appendChild(editForm);

  let modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";
  modalFooter.appendChild(editButton);
  modalContent.appendChild(modalFooter)

  document.body.appendChild(editDiv);

}

function postEntry() {
  // x-www-form-urlencoded
  const formData = new FormData();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  formData.append("title", title);
  formData.append('content', content);

  const postOptions = {
    method: 'POST',
    body: formData,
    // MUCH IMPORTANCE!
    credentials: 'include'
  }

  fetch('api/entries', postOptions)
    .then(res => res.json())
    .then(console.log);
}

function editEntry(entryID, body) {
  const postOptions = {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body,
    // MUCH IMPORTANCE!
    credentials: 'include'
  }

  fetch('api/entries/' + entryID, postOptions)
    .then(res => res.json())
    .then(console.log);
}

function removeEntry(entryID) {
  fetch("api/entries/" + entryID, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(console.log);
}

function createEntry(data) {
  let entryOutput = document.getElementById('entryOutput');

  allEntries = data;

  return data.data.forEach(obj => {
    let entryDiv = document.createElement("div");
    entryDiv.classList.add("text-center");
    entryDiv.id = obj.entryID;

    let entryTitle = document.createElement("h3");
    entryTitle.innerHTML = obj.title;
    entryDiv.appendChild(entryTitle);

    let entryContent = document.createElement("p");
    entryContent.innerHTML = obj.content;
    entryDiv.appendChild(entryContent);

    let deleteEntryButton = document.createElement("button");
    deleteEntryButton.innerHTML = "Delete";
    deleteEntryButton.addEventListener('click', function(e) {
      removeEntry(obj.entryID);
      console.log(obj.entryID);
      location.reload();
    });

    entryDiv.appendChild(deleteEntryButton);

    let updateButton = document.createElement("button");
    updateButton.innerHTML = "Edit";
    updateButton.addEventListener('click', function(e) {
      const editID = this.parentElement.id;
      const entry = allEntries.data.find(filterEntry => filterEntry.entryID === editID);
      updateEntry(entry);
      const modal = document.getElementsByClassName("modal")[0];
      modal.style.display = "block";
      console.log(entry);

    });

    entryDiv.appendChild(updateButton);

    let commentDiv = document.createElement("div");
    let commentTextarea = document.createElement("textarea");
    commentDiv.appendChild(commentTextarea);

    let addCommentButton = document.createElement("button");
    addCommentButton.innerHTML = "Add Comment";

    addCommentButton.addEventListener('click', function(e) {
      const entryID = this.parentElement.parentElement.id;
      postComment(entryID, commentTextarea.value);
      location.reload();
    });

    commentDiv.appendChild(addCommentButton);

    allComments.data.forEach(comment => {
      if (comment.entryID === obj.entryID) {

        let outputComment = document.createElement("div");
        outputComment.classList.add("text-center");
        let commentContent = document.createElement("p");
        commentContent.innerHTML = comment.content;

        let deleteCommentButton = document.createElement("button");
        deleteCommentButton.innerHTML = "Delete Comment";
        deleteCommentButton.addEventListener('click', function(e) {
          removeComment(comment.commentID);
          location.reload();
        });

        outputComment.appendChild(commentContent);
        outputComment.appendChild(deleteCommentButton);
        commentDiv.appendChild(outputComment);

      }
    });

    entryDiv.appendChild(commentDiv);
    entryOutput.appendChild(entryDiv);

  });

}

const entryForm = document.getElementById('entryForm');
entryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  postEntry();
  entryForm.reset();
  location.reload();
});
