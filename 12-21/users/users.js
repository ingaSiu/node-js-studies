const userRegistration = document.querySelector('#create-user');
const userWrapper = document.querySelector('#user-cards-wrapper');

const showForm = document.querySelector('#show-form');
const formWrapper = document.querySelector('.create-user-wrapper');

const sorting = document.querySelector('#sorting');

let usersArr = [];

showForm.addEventListener('click', () => {
  if (formWrapper.style.display === 'none') {
    formWrapper.style.display = 'flex';
  } else {
    formWrapper.style.display = 'none';
  }
});

const renderSelectOptions = () => {
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
        const select = document.querySelector('#select');
        memberships.forEach((element) => {
          const option = document.createElement('option');
          option.setAttribute('value', element._id);
          option.setAttribute('class', 'option');
          option.textContent = element.name;

          select.append(option);
        });
      }
    });
};

renderSelectOptions();

const renderOne = (user) => {
  const userCard = document.createElement('div');
  userCard.setAttribute('class', 'user-card');

  const fullName = document.createElement('p');
  fullName.setAttribute('class', 'user-name');
  fullName.textContent = `${user.name} ${user.surname}`;

  const email = document.createElement('p');
  email.textContent = `Email Address: `;
  const emailAdd = document.createElement('span');
  emailAdd.textContent = user.email;

  email.append(emailAdd);

  const membership = document.createElement('p');
  membership.textContent = `Membership: `;
  const membershipName = document.createElement('span');
  membershipName.textContent = user.membership;

  membership.append(membershipName);

  userCard.append(fullName);
  userCard.append(email);
  userCard.append(membership);

  userWrapper.append(userCard);
};

const renderAll = (users) => {
  userWrapper.innerHTML = '';
  users.forEach((user) => {
    renderOne(user);
  });
};

sorting.addEventListener('click', () => {
  console.log('clicked on');
  if (sorting.textContent === 'ASC') {
    getUsers('dsc');
  } else {
    getUsers('asc');
  }
});

const getUsers = (sortBy) => {
  fetch('http://localhost:3000/users?sort=' + sortBy, {
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
    .then((users) => {
      console.log(users);
      if (users) {
        if (sortBy === 'dsc') {
          sorting.textContent = 'DSC';
        } else {
          sorting.textContent = 'ASC';
        }
        usersArr = users;
        renderAll(usersArr);
      }
    });
};
getUsers('asc');

userRegistration.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = event.target.elements.name.value;
  const surname = event.target.elements.surname.value;
  const email = event.target.elements.email.value;
  const serviceId = event.target.elements.selection.value;
  fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      surname: surname,
      email: email,
      serviceId: serviceId,
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
        event.target.elements.surname.value = '';
        event.target.elements.email.value = '';
        event.target.elements.selection.value = 'trial';
        if (sorting.textContent === 'ASC') {
          getUsers('asc');
        } else {
          getUsers('dsc');
        }
        console.log(result);
      }
    });
});
