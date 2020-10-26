class Hospital {
  constructor(full_name, address, phone) {
    //this.id = id;
    this.full_name = full_name;
    this.address = address;
    this.phone = phone;
  }
}

class UI {

  static displayHospitalsToUI() {
    let hospitals = List.getHospitals();
    hospitals.forEach((hospital) => {
      UI.addHospitalToUI(hospital);
    });
  }

  static addHospitalToUI(hospital) {
    let hospitalList = document.querySelector('.table__body');
    let row = document.createElement('tr');

    row.innerHTML = `
                    <td class=\"left\">${hospital.full_name}</td>
                    <td class=\"left\">${hospital.address}</td>
                    <td class=\"left\">${hospital.phone}</td>
                    `;
    row.innerHTML += "<td><img src=\"img/edit.png\" class=\"edit\" alt=\"Edit\" width=\"20px\" height=\"20px\"></td>";
    row.innerHTML += "<td><img src=\"img/delete.png\" class=\"delete\" alt=\"Delete\" width=\"30px\" height=\"20px\"></td>";


    hospitalList.appendChild(row);
  }

  static editHospitalInUI(cell) {

    let row = cell.children;
    document.querySelector('#full_name').value = row[0].innerText;
    document.querySelector('#address').value = row[1].innerText;
    document.querySelector('#phone').value = row[2].innerText;
    document.querySelector('.input-submit').value = 'Edit a hospital';

    cell.classList.add('chosen');
  }

  static removeHospitalFromUI(cell) {
    cell.remove();
  }

  static clearFields() {
    document.querySelector('#full_name').value = "";
    document.querySelector('#address').value = "";
    document.querySelector('#phone').value = "";
  }

}

class List {

  static checkHospital(name) {
    let hospitals = List.getHospitals();
    let unique = true;
    let i = 0;
    while (unique && (i < hospitals.length)) {
      console.log(hospitals[i]);
      if (hospitals[i].full_name.toLowerCase() == name.trim().toLowerCase()) {
        unique = false;
      };
      i++;
    };
    return unique;
  }

  static getHospitals() {
    let hospitals;
    if (localStorage.getItem('hosps') === null) {
      hospitals = [];
    } else {
      hospitals = JSON.parse(localStorage.getItem('hosps'))
    }
    // hospitals.sort(function (a, b) {
    //   if (a.full_name > b.full_name) {
    //     return 1;
    //   }
    //   if (a.full_name < b.full_name) {
    //     return -1;
    //   }
    //   return 0;
    // });
    return hospitals;
  }

  static setHospital(hospital) {
    let hospitals = List.getHospitals();
    hospitals.push(hospital);
    localStorage.setItem('hosps', JSON.stringify(hospitals));
  }

  static editHospital(cell) {
    let hospitals = List.getHospitals();
    hospitals.forEach((hospital, i) => {
      if (hospital.full_name === cell.children[0].innerText) {
        hospitals.splice(i, 1);
      }
    });
    localStorage.setItem('hospitals', JSON.stringify(hospitals))
  }

  static removeHospital(cell) {
    let hospitals = List.getHospitals();
    hospitals.forEach((hospital, i) => {
      if (hospital.full_name === cell.children[0].innerText) {
        hospitals.splice(i, 1);
      }
    });
    localStorage.setItem('hosps', JSON.stringify(hospitals))
  }

  static loadHosps() {
    //fetch('lpu.json')
    fetch('')
      .then((res) => res.json())
      .then((data) => {
        data.forEach((hospital) => {
          if (List.checkHospital(hospital.full_name)) {
            setHospital(hospital)
          }
        });
      })
      .catch((error)=> console.log(error))

  }
}
document.addEventListener('DOMContentLoaded', UI.displayHospitalsToUI());

document.querySelector('.info__form').addEventListener('submit', (e) => {

  e.preventDefault();

  const full_name = document.querySelector('#full_name').value;
  const address = document.querySelector('#address').value;
  const phone = document.querySelector('#phone').value;

  if (full_name === '' || address === '' || phone === '') {
    //alert("Please fill in all fields");
    let msg = document.querySelector('.msg');
    msg.classList.add('error');
    msg.innerHTML = 'Please fill in all fields';
    setTimeout(() => {
      msg.innerHTML = '';
      msg.classList.remove('error');
    }, 3000)

  } else {

    if (List.checkHospital(full_name)) {
      const hospital = new Hospital(full_name, address, phone);
      if (document.querySelector('.input-submit').value === 'Edit a hospital') {

        let chosens = document.querySelector('.table__body').children;

        for (let chosen of chosens) {
          if (chosen.classList.contains('chosen')) {
            UI.removeHospitalFromUI(chosen);
          }
        }
      };
      UI.addHospitalToUI(hospital);
      List.setHospital(hospital);
      UI.clearFields();
    } else {
      let msg = document.querySelector('.msg');
      msg.classList.add('error');
      msg.innerHTML = 'The hospital already exists, edit the old one';
      setTimeout(() => {
        msg.innerHTML = '';
        msg.classList.remove('error');
      }, 5000)
    }
  }
});

document.querySelector('.table__body').addEventListener('click', (e) => {
  if (e.target.classList.contains("edit")) {
    if (document.querySelector('.input-submit').value === 'Edit a hospital') {

      let chosens = document.querySelector('.table__body').children;

      for (let chosen of chosens) {
        if (chosen.classList.contains('chosen')) {
          chosen.classList.remove('chosen');
        }
      }
    };
    UI.editHospitalInUI(e.target.parentNode.parentNode);
    List.editHospital(e.target.parentNode.parentNode);
  } else if (e.target.classList.contains("delete")) {
    UI.removeHospitalFromUI(e.target.parentNode.parentNode);
    List.removeHospital(e.target.parentNode.parentNode);
  }
})

document.querySelector('.load').addEventListener('click', List.loadHosps);
