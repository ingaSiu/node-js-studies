const content = document.querySelector('#content');
const ageCol = document.querySelector('#age-col');
const filterBtns = document.querySelectorAll('.filter-btn');

let petsData = [];
//paimti duomenis ne tik is request, bet ir kitur kode

const filterPets = () => {
  return petsData.filter((pet) => {
    for (let i = 0; i < filterBtns.length; i++) {
      if (
        filterBtns[i].classList.contains('clicked') &&
        filterBtns[i].value === pet.type.toLowerCase()
      ) {
        return true;
      }
    }
    return false;
  });
};

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('clicked')) {
      btn.classList.remove('clicked');
    } else {
      btn.classList.add('clicked');
    }
    renderAll(filterPets());
  });
});

ageCol.addEventListener('click', () => {
  if (ageCol.textContent === 'Age (Asc)') {
    getPets('dsc');
  } else {
    getPets('asc');
  }
});

const renderOne = (pet) => {
  const row = document.createElement('tr');
  const nameCol = document.createElement('td');
  const typeCol = document.createElement('td');
  const ageCol = document.createElement('td');

  nameCol.textContent = pet.name;
  row.append(nameCol);

  typeCol.textContent = pet.type;
  row.append(typeCol);

  ageCol.textContent = pet.age;
  row.append(ageCol);

  content.append(row);
};

const renderAll = (pets) => {
  content.innerHTML = '';
  pets.forEach((pet) => {
    renderOne(pet);
  });
};
const getPets = (sortBy) => {
  fetch('http://localhost:3000/pets?sort=' + sortBy, {
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
    .then((pets) => {
      console.log(pets);
      if (pets) {
        if (sortBy === 'dsc') {
          ageCol.textContent = 'Age (Dsc)';
        } else {
          ageCol.textContent = 'Age (Asc)';
        }
        petsData = pets;
        renderAll(filterPets());
      }
    });
};

getPets('asc');
