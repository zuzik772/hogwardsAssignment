"use-strict";
window.addEventListener("DOMContentLoaded", start);
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

let allStudents = [];
let filteredArray;
let newList = [];
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  gender: "",
  house: "",
  isExpelled: false,
};

const settings = {
  isSortDir: false,
};
function start() {
  // filter click
  const filterBtns = document.querySelectorAll("[data-action=filter]");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterList(this.dataset.filter);
      // filterExpelledList("[data-filter=expelled]");
      console.log("this dataset filter is", this.dataset.filter);
    });
  });

  // let listButtons = document.querySelectorAll(".filter");
  // listButtons.forEach((btn) => {
  //   btn.addEventListener("click", function () {
  //     console.log(this.dataset.filter);
  //     if (this.dataset.filter === "all") {
  //       displayList(allStudents);
  //     } else {
  //       displayList(filteringExpelled(this.dataset.filter));
  //     }
  //   });
  // });
  // sort click
  const sortBtns = document.querySelectorAll("[data-action=sort]");
  sortBtns.forEach((sortBtn) => {
    sortBtn.addEventListener("click", function () {
      sortBtn.style.backgroundColor = "yellow";
      if (settings.isSortDir === true) {
        settings.isSortDir = false;
        console.log("its false");
        sortList(filteredArray, this.dataset.sort, "asc");
      } else {
        settings.isSortDir = true;
        console.log("its true");
        sortList(filteredArray, this.dataset.sort, "desc");
      }

      // sortList(filteredArray, this.dataset.sort);
    });
  });

  loadJson();
}

function loadJson() {
  fetch(url)
    .then((response) => response.json())
    .then((allStudentData) => allStudentData.forEach(prepareObjects));
}
function prepareObjects(studentObject) {
  filteredArray = allStudents;
  let fullname = studentObject.fullname.trim();
  let newFullname = capitalization(fullname);

  const student = Object.create(Student);
  let middle = newFullname.substring(newFullname.indexOf(" ") + 1, newFullname.lastIndexOf(" ")).trim();
  student.firstName = newFullname.substring(0, newFullname.indexOf(" ")).trim();
  student.lastName = newFullname.substring(newFullname.lastIndexOf(" ")).trim();

  if (middle.charAt(0) === '"') {
    student.nickName = middle;
  } else {
    student.middleName = middle;
  }

  student.image = getImage(newFullname);

  let newHouse = capitalization(studentObject.house.trim());
  student.house = newHouse;
  let studentGender = studentObject.gender;
  student.gender = studentGender;
  // student.isExpelled = "active";
  // console.log("student object", student.firstName);
  allStudents.push(student);

  displayList(allStudents);
}

function capitalization(fullname) {
  fullname = fullname.toLowerCase();
  let fullnameArray = fullname.split("");
  fullnameArray[0] = fullnameArray[0].toUpperCase();
  for (let i = 0; i <= fullnameArray.length; i++) {
    if (fullnameArray[i] === " " || fullnameArray[i] === "-" || fullnameArray[i] === '"') {
      fullnameArray[i + 1] = fullnameArray[i + 1].charAt(0).toUpperCase();
    }
  }
  //   console.log("do you work?", fullnameArray);
  fullname = fullnameArray.join("");
  return fullname;
}

function getImage(fullname) {
  let firstName = fullname.substring(0, fullname.indexOf(" ")).toLowerCase();
  let lastName = fullname.substring(fullname.lastIndexOf(" ") + 1).toLowerCase();
  let urlImage = lastName + "_" + firstName.charAt(0) + ".png";
  if (firstName === "") {
    urlImage = "empty.png";
  }
  if (lastName === "patil") {
    urlImage = lastName + "_" + firstName + ".png";
    console.log("patil", urlImage);
  }

  if (lastName.includes("-")) {
    lastName = lastName.substring(lastName.indexOf("-") + 1);
    urlImage = lastName + "_" + firstName.charAt(0) + ".png";
    return urlImage;
  } else {
    return urlImage;
  }
}

// function sameLastName(fullname) {
//   let lastName = fullname.substring(fullname.lastIndexOf(" ") + 1);
// //
// }

function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(alumni) {
  // create clone
  const clone = document.querySelector("template#alumni").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = alumni.firstName;
  clone.querySelector("[data-field=lastName]").textContent = alumni.lastName;
  clone.querySelector("[data-field=middleName]").textContent = alumni.middleName;
  clone.querySelector("[data-field=nickName]").textContent = alumni.nickName;
  clone.querySelector("[data-field=image] img").src = `images/${alumni.image}`;
  clone.querySelector("[data-field=gender]").textContent = alumni.gender;
  clone.querySelector("[data-field=house]").textContent = alumni.house;
  clone.querySelector("[data-field=status]").textContent = alumni.isExpelled;
  if (alumni.isExpelled === true) {
    clone.querySelector("[data-field=status]").textContent = "expelled";
  } else {
    clone.querySelector("[data-field=status]").textContent = "active";
  }
  // // remove expelled student
  // if (isExpelled === true) {
  //   console.log("student is expelled this time");
  //   clone.querySelector("[data-field=firstName]").textContent = "";
  //   clone.querySelector("[data-field=lastName]").textContent = "";
  //   clone.querySelector("[data-field=middleName]").textContent = "";
  //   clone.querySelector("[data-field=nickName]").textContent = "";
  //   clone.querySelector("[data-field=image] img").src = "";
  //   clone.querySelector("[data-field=gender]").textContent = "";
  //   clone.querySelector("[data-field=house]").textContent = "";
  // } else {
  //   console.log("student is NOT expelled");
  // }

  // student click
  let studentBtn = clone.querySelectorAll("td");
  studentBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      showPopUp(alumni);
      // btn.style.backgroundColor = "yellow";
    });
  });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
  //   console.table(alumni);
}
// filtering house
function filterList(filter) {
  let list = allStudents.filter(isStudentHouse);
  function isStudentHouse(student) {
    if (student.house === filter) {
      return true;
    } else {
      return false;
    }
  }

  if (list.length === 0) {
    list = allStudents;
  }
  filteredArray = list;
  // console.table(filteredArray);
  displayList(filteredArray);
}
// filter expelled students
// function filterExpelledList(expelled) {
//   let list = allStudents.filter(newList);
//   function isStudentExpelled(student) {
//     if (student.isExpelled === expelled) {
//       return true;
//     } else {
//       return false;
//     }
//   }

//   if (list.length === 0) {
//     list = allStudents;
//   }
//   filteredArray = list;
//   // console.table(filteredArray);
//   buildList();
// }

function filterExpelledList(expelledStatus) {
  console.log(expelledStatus);
  allStudents.forEach((student) => console.log(student.isExpelled == expelledStatus));
  let filteredData = allStudents.filter((student) => String(student.expelled) == expelledStatus);

  const result = words.filter((word) => word.length > 6);
  // if (!filteredData.length) {
  //   filteredData = allStudents;
  // }
  return filteredData;
}

// sorting
function sortList(arr, propertyName, direction) {
  let list = arr.sort(isPropertyName);
  if (direction === "desc") {
    list = list.reverse();
  }
  console.log(list);
  function isPropertyName(studentA, studentB) {
    if (studentA[propertyName] < studentB[propertyName]) {
      return -1;
    } else {
      return 1;
    }
  }

  displayList(list);
}

// search function
function searchFunction() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("list");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function showPopUp(student) {
  document.querySelector("#studentPopUp").classList.remove("hidden");
  document.querySelector("#studentPopUp .closebutton").addEventListener("click", function () {
    closePopUp(student);
  });
  document.querySelector("#studentPopUp .firstname").textContent = student.firstName;
  document.querySelector("#studentPopUp .lastname").textContent = student.lastName;
  document.querySelector("#studentPopUp .middlename").textContent = student.middleName;
  document.querySelector("#studentPopUp .nickname").textContent = student.nickName;
  document.querySelector("#studentPopUp .image img").src = `images/${student.image}`;
  document.querySelector("#studentPopUp .house").textContent = student.house;
  document.querySelector("#studentPopUp .blood").textContent = student.firstName;
  document.querySelector("#studentPopUp .characteristics").textContent = student.firstName;
  // show names on buttons
  document.querySelector("#studentPopUp [data-action=remove]").textContent = "Expell: " + student.firstName + " " + student.lastName;
  document.querySelector("#studentPopUp [data-action=remove]").addEventListener("click", function () {
    expellStudent(student);
  });
}

function closePopUp(student) {
  document.querySelector("#studentPopUp").classList.add("hidden");
  console.log("student:", student);
  document.querySelector("#studentPopUp [data-action=remove]").textContent = "Expell: " + student.firstName + " " + student.lastName;
  document.querySelector("#studentPopUp [data-action=remove]").style.backgroundColor = "orange";

  return buildList(student);
}

function expellStudent(expelledStudent) {
  document.querySelector("#studentPopUp [data-action=remove]").style.backgroundColor = "red";
  // alert(`${expelledStudent.firstName} has been expelled!`);
  document.querySelector("#studentPopUp [data-action=remove]").innerHTML = "EXPELLED!!!";
  let expelled = (expelledStudent.isExpelled = true);

  const index = allStudents.indexOf(expelledStudent);
  let expelledStudents = allStudents.splice(index, 1);
  console.log("allstudents length: ", allStudents.length);
  console.log("new expelled Student: ", expelledStudents);

  newList.push(expelledStudents);

  console.log("what is this: ", newList);

  // buildList(expelledStudents);
  // buildList(expelledStudents);
  // expelled =
  // addStatus(expelled);
  // document.querySelector("#studentPopUp [data-field=status]").textContent = expelledStudent.isExpelled = true;
  // if ((expelledStudent.isExpelled = true)) {
  //   buildList(expelledStudent);

  // }

  // removeStudentFromList(expelled);
  console.log("expelled student is ", expelled);
  // clear the list
  // document.querySelector("#list tbody").innerHTML = "";
  return newList;
}

function buildList() {
  const currentList = allStudents;
  displayList(currentList);
}

// function buildExpelledList(expelledStudent) {
//   if (isExpelled === true) {
//     isExpelled = false;
//   } else {
//     isExpelled = true;
//   }
// }

// function removeStudentFromList(expelledStudent) {
//   let removeStudent = expelledStudent.classList.add("hidden");
//   return removeStudent
// }

// function addStatus(student) {
//   if (student.isExpelled === true) {
//     document.querySelector("#studentPopUp [data-field=status]").textContent = "expelled";
//   } else {
//     document.querySelector("#studentPopUp [data-field=status]").textContent = "active";
//   }
// }
