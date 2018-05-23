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
  let titleForm = document.getElementById('titleForm');
  titleForm.addEventListener('submit', function(e) {
    let titleInput = document.getElementById('titleInput').value;
    e.preventDefault();
    getTitle(titleInput);
  });
}

searchForTitle();
