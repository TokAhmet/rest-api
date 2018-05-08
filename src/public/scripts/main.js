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


function getAllEntries() {
  let entryOutput = document.getElementById('entryOutput');
  fetch("api/entries")
    .then(res => res.json())
    .then(function(data) {
      return data.data.forEach(obj => {
        let entryDiv = document.createElement("div");
        entryDiv.classList.add("text-center");

        let entryTitle = document.createElement("h3");
        entryTitle.innerHTML = obj.title;
        entryDiv.appendChild(entryTitle);

        let entryContent = document.createElement("p");
        entryContent.innerHTML = obj.content;
        entryDiv.appendChild(entryContent);

        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.addEventListener('click', function(e) {
            e.preventDefault()
            removeEntry(obj.entryID);
            location.reload();
        });
        entryDiv.appendChild(deleteButton);

        entryOutput.appendChild(entryDiv);
      });
    })
    .then(console.log);
}

getAllEntries();


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
}


function removeEntry(entryID) {
  fetch("removeEntry/" + entryID,{
     method: "DELETE"})
    .then(res => res.json())
    .then(console.log);
}

const entryForm = document.getElementById('entryForm');
entryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  postEntry();
  entryForm.reset();
  location.reload();
});



// const form = document.getElementById('newTodo');
// form.addEventListener('submit', function(e) {
//   e.preventDefault();
//   const formData = new FormData(this);
// });
//
