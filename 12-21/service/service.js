const membershipForm = document.querySelector('#create-membership');
const cardWrapper = document.querySelector('#membership-cards');
const formWrapper = document.querySelector('.membership-form-wrapper');
formWrapper.style.display = 'none';
const showForm = document.querySelector('#create-new-membership');

let membershipsArr = [];

showForm.addEventListener('click', () => {
  console.log(formWrapper.style);
  console.log(formWrapper.style.display);
  if (formWrapper.style.display === 'none') {
    formWrapper.style.display = 'flex';
  } else {
    formWrapper.style.display = 'none';
  }
});

const renderOne = (membership) => {
  const cardDiv = document.createElement('div');
  cardDiv.setAttribute('class', 'card-div');

  const name = document.createElement('p');
  name.textContent = `${membership.price} ${membership.name}`;

  const description = document.createElement('p');
  description.setAttribute('class', 'description-txt');
  description.textContent = `${membership.description}`;

  const userCount = document.createElement('p');
  userCount.setAttribute('class', 'count-txt');
  userCount.textContent = `Total subscriptions: ${membership.userCount}`;

  const delBtn = document.createElement('button');
  delBtn.setAttribute('class', 'del-btn');
  delBtn.setAttribute('value', membership._id);

  const btnIcon = document.createElement('i');
  btnIcon.setAttribute('class', 'fa-solid fa-trash');
  delBtn.append(btnIcon);

  delBtn.addEventListener('click', (event) => {
    console.log('clicked');

    let isConfirmed = confirm(
      'Users will lose their subscription. Do you really want to delete?',
    );

    if (isConfirmed) {
      fetch(`http://localhost:3000/memberships/${event.target.value}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          if (data && data.deletedCount > 0) {
            membershipsArr = membershipsArr.filter((membership) => {
              return event.target.value !== membership._id;
            });
            renderAll(membershipsArr);
          }
        });
    }
  });

  cardDiv.append(name);
  cardDiv.append(description);
  cardDiv.append(userCount);
  cardDiv.append(delBtn);

  cardWrapper.append(cardDiv);
};

const renderAll = (memeberships) => {
  cardWrapper.innerHTML = '';
  memeberships.forEach((membership) => {
    renderOne(membership);
  });
};

fetch('http://localhost:3000/memberships', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
  .then((memberships) => {
    console.log(memberships);
    if (memberships) {
      membershipsArr = memberships;
      renderAll(membershipsArr);
    }
  });

membershipForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = event.target.elements.name.value;
  const price = event.target.elements.price.value;
  const description = event.target.elements.description.value;

  fetch('http://localhost:3000/memberships', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      price: price,
      description: description,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((result) => {
      if (result) {
        event.target.elements.name.value = '';
        event.target.elements.price.value = '';
        event.target.elements.description.value = '';
        console.log(result);
      }
    });
});
