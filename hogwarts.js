"use-strict";
window.addEventListener("DOMContentLoaded", start);
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

let allStudents = [];
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  house: "",
};
function start() {
  fetch(url)
    .then((response) => response.json())
    .then((allStudentData) => allStudentData.forEach(prepareObjects));
}
function prepareObjects(studentObject) {
  let fullname = studentObject.fullname.trim();
  let newFullname = capitalization(fullname);

  const student = Object.create(Student);
  let middle = newFullname.substring(newFullname.indexOf(" ") + 1, newFullname.lastIndexOf(" "));
  student.firstName = newFullname.substring(0, newFullname.indexOf(" "));
  student.lastName = newFullname.substring(newFullname.lastIndexOf(" "));

  if (middle.charAt(0) === '"') {
    student.nickName = middle;
  } else {
    student.middleName = middle;
  }

  // const array1 = [{ name: "Klaus" }, { name: "Blaus" }, { name: "Mlaus" }];

  // const isLargeNumber = (element) => element.name === "Blaus";
  // const isNamAppearingInTheRestArr = (elm) => elm.lastName === "Potter";
  // if (arr.findIndex(isNamAppearingInTheRestArr) !== -1) {
  //   console.log("we are here looking for the same name");
  // }
  // if (allStudents.slice(i))
  student.image = getImage(newFullname);
  // student.lastName.toLowerCase() + "_" + student.firstName.charAt(0).toLowerCase() + ".png";
  // if (student.lastName.includes("-")) {
  //   student.lastName.substring(student.lastName.indexOf("-") + 1);
  // } else {
  //   console.log("fix name");
  // }

  let newHouse = capitalization(studentObject.house.trim());
  student.house = newHouse;
  // console.log("student object", student.firstName);
  allStudents.push(student);

  displayList();
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

function displayList() {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
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
  clone.querySelector("[data-field=house]").textContent = alumni.house;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
  //   console.table(alumni);
}
