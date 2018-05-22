function getComments() {
  fetch('api/comments')
    .then(res => res.json())
    .then(function(data) {
      allComments = data;
    });
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
    .then(console.log);
}

function removeComment(commentID) {
  fetch('api/comments/' + commentID, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(console.log);
}

getComments();
