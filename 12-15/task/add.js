const form = document.querySelector('#form-pet');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = event.target.elements.name.value;
  const type = event.target.elements.type.value;
  const age = event.target.elements.age.value;

  fetch('http://localhost:3000/pets', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      type: type,
      age: age,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        //some error handling
      }
    })
    .then((result) => {
      if (result) {
        event.target.elements.name.value = '';
        event.target.elements.age.value = '';
        event.target.elements.type.value = 'cat';
        //TODO po irasymo, kad langeliai issiclearintu
        console.log(result);
      }
    });
});
