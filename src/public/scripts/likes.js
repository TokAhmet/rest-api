function getLikes(entryID) {
  const postOptions = {
    credentials: 'include'
  }

  return fetch('api/likes/' + entryID, postOptions)
    .then(res => res.json());
}

function postLike(entryID) {
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
    .then(console.log);
}

function removeLike(entryID) {
  fetch('api/likes/' + entryID, {
      method: 'DELETE',
      credentials: 'include'
    })
    .then(res => res.json())
    .then(console.log);
}
