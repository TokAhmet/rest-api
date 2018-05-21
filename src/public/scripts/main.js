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

function getOneUser() {
  return fetch("api/user", {
      credentials: 'include'
    })
    .then(res => res.json())
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

  return data.data.forEach(async obj => {
    let entryDiv = document.createElement("div");
    entryDiv.classList.add("text-center");
    entryDiv.classList.add("form-group");
    entryDiv.classList.add("entryDiv");
    entryDiv.id = obj.entryID;

    let entryTitle = document.createElement("h3");
    entryTitle.innerHTML = "Title: " + obj.title;
    entryDiv.appendChild(entryTitle);

    let entryContent = document.createElement("p");
    entryContent.innerHTML = "Content: " + obj.content;
    entryDiv.appendChild(entryContent);

    const loggedInUser = await getOneUser();
    console.log(loggedInUser.data.userID);

    if (loggedInUser.data.userID === obj.createdBy || loggedInUser.data.admin === "1") {

      let updateButton = document.createElement("button");
      updateButton.innerHTML = "Edit";
      updateButton.classList.add("btn");
      updateButton.classList.add("btn-warning");
      updateButton.addEventListener('click', function(e) {
        const editID = this.parentElement.id;
        const entry = allEntries.data.find(filterEntry => filterEntry.entryID === editID);
        updateEntry(entry);
        const modal = document.getElementsByClassName("modal")[0];
        modal.style.display = "block";
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }
        console.log(entry);

      });

      entryDiv.appendChild(updateButton);

      let deleteEntryButton = document.createElement("button");
      deleteEntryButton.innerHTML = "Delete";
      deleteEntryButton.classList.add("btn");
      deleteEntryButton.classList.add("btn-danger");
      deleteEntryButton.addEventListener('click', function(e) {
        removeEntry(obj.entryID);
        console.log(obj.entryID);
        location.reload();

      });

      entryDiv.appendChild(deleteEntryButton);
    }

    const likeResponse = await getLikes(obj.entryID);
    console.log(likeResponse.data);

    if (likeResponse.data) {
      let removeLikeButton = document.createElement("button");
      removeLikeButton.innerHTML = "Remove Like";
      removeLikeButton.classList.add("btn");
      removeLikeButton.classList.add("btn-danger");
      removeLikeButton.addEventListener('click', (e) => {
        removeLike(obj.entryID);
      });

      entryDiv.appendChild(removeLikeButton);
    } else {
      let likeButton = document.createElement("button");
      likeButton.innerHTML = "Like";
      likeButton.classList.add("btn");
      likeButton.classList.add("btn-primary");
      likeButton.addEventListener('click', (e) => {
        postLike(obj.entryID);
      });

      entryDiv.appendChild(likeButton);
    }

    let commentDiv = document.createElement("div");
    let commentTextarea = document.createElement("textarea");
    commentTextarea.placeholder = "Write your Comment";
    commentDiv.appendChild(commentTextarea);

    let addCommentButton = document.createElement("button");
    addCommentButton.classList.add("btn");
    addCommentButton.classList.add("btn-success");
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
        outputComment.classList.add("commentDiv");
        let commentContent = document.createElement("p");
        commentContent.innerHTML = comment.content;
        outputComment.appendChild(commentContent);

        if (loggedInUser.data.userID === comment.createdBy || loggedInUser.data.admin === "1") {
          let deleteCommentButton = document.createElement("button");
          deleteCommentButton.innerHTML = "Delete Comment";
          deleteCommentButton.classList.add("btn");
          deleteCommentButton.classList.add("btn-danger");
          deleteCommentButton.addEventListener('click', function(e) {
            removeComment(comment.commentID);
            location.reload();
          });
          outputComment.appendChild(deleteCommentButton);
        }

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
