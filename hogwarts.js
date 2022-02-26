"use-strict";
window.addEventListener("DOMContentLoaded", start);
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

let allStudents = [];
let filteredArray;
let expelledStudents = [];
let activeStudents = [];
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  gender: "",
  house: "",
  expelled: false,
  prefect: false,
};

const settings = {
  isSortDir: false,
};
function start() {
  // click filter house of student
  const filterHouseBtns = document.querySelectorAll("[data-action=filterHouse]");
  filterHouseBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterList(this.dataset.filter);
      console.log("this dataset filter is", this.dataset.filter);
    });
  });

  // click filter status of student
  const filterStudentBtns = document.querySelectorAll("[data-action=filterStudent]");
  filterStudentBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      if (this.dataset.filter === "all") {
        displayList(allStudents);
        console.log("this dataset filter is", this.dataset.filter);
      } else if (this.dataset.filter === "expelled") {
        displayList(expelledStudents);
        // displayList(filterExpelledList(expelledStudents));
        console.log("i am empty", expelledStudents);
      }
    });
  });

  // click sort for evrything
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

  allStudents.push(student);
  activeStudents.push(student);
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
  }

  if (lastName.includes("-")) {
    lastName = lastName.substring(lastName.indexOf("-") + 1);
    urlImage = lastName + "_" + firstName.charAt(0) + ".png";
    return urlImage;
  } else {
    return urlImage;
  }
}

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
  // clone.querySelector("[data-field=status]").textContent = alumni.expelled;
  if (alumni.expelled) {
    clone.querySelector("[data-field=status]").textContent = "expelled";
  } else {
    clone.querySelector("[data-field=status]").textContent = "active";
  }
  //display prefect
  // clone.querySelector("[data-field=prefect]").dataset.prefect = alumni.prefect;
  // if (alumni.prefect) {
  //   clone.querySelector("[data-field=prefect]").textContent = "t";
  // } else {
  //   clone.querySelector("[data-field=prefect]").textContent = "f";
  // }
  // student click
  let studentBtn = clone.querySelectorAll("td.popup");
  studentBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      showPopUp(alumni);
      btn.style.backgroundColor = "yellow";
    });
  });
  // prefect click
  clone.querySelector("[data-field=prefect]").addEventListener("click", prefectClick);
  function prefectClick() {
    if (alumni.prefect === true) {
      alumni.prefect = false;
    } else {
      // alumni.prefect = true;
      tryToMakeWinner(alumni);
    }
    buildList();
  }
  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
  //   console.table(alumni);
}

function tryToMakeWinner(selectedStudent) {
  // take all the students and filter them by every student where student.prefect is true
  const prefects = allStudents.filter((student) => student.prefect);
  const numberOfPrefects = prefects.length;
  const other = prefects.filter((student) => student.house === selectedStudent.house).shift();
  console.log("other is ", other);
  if (other !== undefined) {
    console.log("There can be only one prefect of gender");
    removeOtherStudent(other);
  } else if (numberOfPrefects >= 8) {
    console.log("There can only be two prefects!");
    removePrefectAorB(prefects[0], prefects[1]);
  } else {
    makePrefect(selectedStudent);
  }

  function removeOtherStudent(otherStudent) {
    console.log("remove other student");
    document.querySelector("#onlyonekind").classList.remove("hidden");
    document.querySelector("#onlyonekind .closeButton").addEventListener("click", closeDialog);
    document.querySelector("#onlyonekind [data-action=remove1]").addEventListener("click", clickRemoveOther);
    document.querySelector("#onlyonekind [data-action=remove1]").addEventListener("click", clickRemoveOther);
    // show names on buttons
    document.querySelector("#onlyonekind .student1").textContent = otherStudent.firstName + ", " + otherStudent.lastName;

    function closeDialog() {
      document.querySelector("#onlyonekind").classList.add("hidden");
      // its good practice to remove event listener if u dont need it anymore
      document.querySelector("#onlyonekind .closeButton").removeEventListener("click", closeDialog);
      document.querySelector("#onlyonekind [data-action=remove1]").removeEventListener("click", clickRemoveOther);
    }

    function clickRemoveOther() {
      removePrefect(otherStudent);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removePrefectAorB() {
    console.log("remove prefectA or prefectB");
    document.querySelector("#onlytwoprefect").classList.remove("hidden");
    document.querySelector("#onlytwoprefect .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#onlytwoprefect [data-action=remove1]").addEventListener("click", clickRemoveA);
    document.querySelector("#onlytwoprefect [data-action=remove2]").addEventListener("click", clickRemoveB);

    // show names on buttons
    document.querySelector("#onlytwoprefect .prefect1").textContent = prefectA.firstName + ", " + prefectA.lastName;
    document.querySelector("#onlytwoprefect .prefect2").textContent = prefectB.firstName + ", " + prefectA.lastName;
  }

  function closeDialog() {
    document.querySelector("#onlytwoprefects").classList.add("hidden");
    // its good practice to remove event listener if u dont need it anymore
    document.querySelector("#onlytwoprefects .closeButton").removeEventListener("click", closeDialog);
    document.querySelector("#onlytwoprefects [data-action=remove1]").removeEventListener("click", clickRemoveA);
    document.querySelector("#onlytwoprefects [data-action=remove2]").removeEventListener("click", clickRemoveB);
  }

  function clickRemoveA() {
    removeWinner(winnerA);
    makeWinner(selectedAnimal);
    buildList();
    closeDialog();
  }

  function clickRemoveB() {
    removePrefect(prefectB);
    makePrefect(selectedStudent);
    buildList();
    closeDialog();
  }

  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }
  function makePrefect(student) {
    student.prefect = true;
  }
}

// filtering house
function filterList(house) {
  let list = allStudents.filter(isStudentHouse);
  function isStudentHouse(student) {
    if (student.house === house) {
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
  document.querySelector("#studentPopUp [data-action=remove]").disabled = false;
  document.querySelector("#studentPopUp [data-action=remove]").style.color = "black";
  document.querySelector("#studentPopUp .closebutton").addEventListener("click", function () {
    closePopUp();
  });
  document.querySelector("#studentPopUp .firstname").textContent = student.firstName;
  document.querySelector("#studentPopUp .lastname").textContent = student.lastName;
  document.querySelector("#studentPopUp .middlename").textContent = student.middleName;
  document.querySelector("#studentPopUp .nickname").textContent = student.nickName;
  document.querySelector("#studentPopUp .image img").src = `images/${student.image}`;
  document.querySelector("#studentPopUp .house").textContent = student.house;
  document.querySelector("#studentPopUp .prefect").textContent = student.prefect;
  document.querySelector("#studentPopUp .blood").textContent = student.firstName;
  document.querySelector("#studentPopUp .characteristics").textContent = student.firstName;
  // show names on buttons
  document.querySelector("#studentPopUp [data-action=remove]").textContent = "Expell: " + student.firstName + " " + student.lastName;
  document.querySelector("#studentPopUp [data-action=remove]").addEventListener("click", function () {
    expellStudent(student);
  });
}
function closePopUp() {
  document.querySelector("#studentPopUp").classList.add("hidden");
  // console.log("student:", student.firstName);
  // document.querySelector("#studentPopUp [data-action=remove]").textContent = "Expell: " + student.firstName + " " + student.lastName;
  document.querySelector("#studentPopUp [data-action=remove]").style.backgroundColor = "orange";
}

function expellStudent(expelledStudent) {
  expelledStudent.expelled = true;
  document.querySelector("#studentPopUp [data-action=remove]").disabled = true;
  document.querySelector("#studentPopUp [data-action=remove]").style.backgroundColor = "red";
  document.querySelector("#studentPopUp [data-action=remove]").style.color = "white";
  // alert(`${expelledStudent.firstName} has been expelled!`);
  document.querySelector("#studentPopUp [data-action=remove]").innerHTML = "EXPELLED!!!";
  // let expelled = (expelledStudent.expelled = true);

  let index = activeStudents.indexOf(expelledStudent);
  if (index > -1) {
    allStudents.splice(index, 1);
    activeStudents.splice(index, 1);
    expelledStudents.push(expelledStudent);
  }

  console.log(activeStudents);
  buildList();

  // let expelledStudents = allStudents.splice(index, 1);
  // console.log("allstudents length: ", allStudents.length);
  // console.log("new expelled Student: ", expelledStudents);

  // doesnt work adds random ammount of people to new list after expelling more than 1 student
  // newList.push(expelledStudents);

  // console.log("what is this: ", newList);
  // newList = allStudents.filter((student) => student.expelled);
  // console.log("new List is ", newList);
  // const otherList = allStudents.filter((student) => student.expelled === true);

  // console.log("expelled student is ", expelled);

  // buildList();
  // displayExpelledStudents(newList);
  // document.querySelector("[data-filter=expelled]").addEventListener("click", displayExpelledStudents);
  // function displayExpelledStudents() {
  //   allStudents.filter(buildList(newList));
  // }
}

function filterExpelledList(isExpelled) {
  console.log("is expelled?", isExpelled);
  allStudents.forEach((student) => console.log(student.expelled == isExpelled));
  let filteredList = allStudents.filter((student) => String(student.expelled) == isExpelled);
  console.log("filtered list", filteredList);
  return filteredList;
}

function buildList() {
  const currentList = allStudents;
  displayList(currentList);
}
