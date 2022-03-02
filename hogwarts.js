"use-strict";
window.addEventListener("DOMContentLoaded", start);
const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const urlBlood = "https://petlatkea.dk/2021/hogwarts/families.json";
let halfBlood = [];
let pureBlood = [];
let allStudents = [];
let filteredArray;
let expelledStudents = [];
let activeStudents = [];
let allPrefects = [];
let allSquadMembers = [];
let isHacked = false;
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
  blood: "",
  squad: false,
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
        console.log("i am empty", expelledStudents);
      } else if (this.dataset.filter === "enrolled") {
        displayList(activeStudents);
        console.log("i am active", activeStudents);
      }
    });
  });

  // click filter prefect
  document.querySelector("[data-filter=prefects]").addEventListener("click", function () {
    displayList(allPrefects);
  });

  // click filter squad
  document.querySelector("[data-filter=squad]").addEventListener("click", function () {
    displayList(allSquadMembers);
  });

  // click sort for evrything
  const sortBtns = document.querySelectorAll("[data-action=sort]");
  sortBtns.forEach((sortBtn) => {
    sortBtn.addEventListener("click", function () {
      if (settings.isSortDir === true) {
        settings.isSortDir = false;
        // sortBtn.style.color = "orange";
        // sortBtn.textContent = "👇" + this.dataset.sort;

        console.log("its false");
        sortList(filteredArray, this.dataset.sort, "asc");
      } else {
        settings.isSortDir = true;
        // sortBtn.style.color = "red";
        // sortBtn.textContent = "👆" + this.dataset.sort;
        console.log("its true");
        sortList(filteredArray, this.dataset.sort, "desc");
      }

      // sortList(filteredArray, this.dataset.sort);
    });
  });
  loadJson1();
}

async function loadJson1() {
  const resp = await fetch(urlBlood);
  const data = await resp.json();
  console.log("1");
  halfBlood = data.half;
  pureBlood = data.pure;

  loadJson2();
}

async function loadJson2() {
  const resp = await fetch(url);
  const data = await resp.json();
  console.log("2");
  prepareObjects(data);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);

  buildList();
}

function prepareObject(studentObject) {
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

function buildList() {
  const currentList = activeStudents;
  displayList(currentList);
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
  displayNumberOfStudentsInHouse();
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
  clone.querySelector("[data-field=blood]").textContent = alumni.blood;

  // BLOOD STATUS
  if (isHacked === true) {
    // hackSquad(alumni);
    getRandomBloodStatus(alumni);
  } else {
    defineBloodStatus(alumni);
  }

  // EXPELL STATUS
  if (alumni.expelled) {
    clone.querySelector("[data-field=status]").textContent = "EXPELLED";
    clone.querySelector("[data-field=status]").style.color = "#E73D5C";
    clone.querySelector("[data-field=status]").style.backgroundColor = "#FCEAEE";
  } else {
    clone.querySelector("[data-field=status]").textContent = "active";
    clone.querySelector("[data-field=status]").style.color = "#3ECD78";
    clone.querySelector("[data-field=status]").style.backgroundColor = "#F3FCF7";
  }
  //display prefect
  clone.querySelector("[data-field=prefect]").dataset.prefect = alumni.prefect;
  document.querySelector("[data-filter=prefects]").textContent = "📛Prefects" + `(${allPrefects.length})`;

  // display squad
  clone.querySelector("[data-field=squad]").dataset.squad = alumni.squad;
  document.querySelector("[data-filter=squad]").textContent = "🎖️Inquisitorial Squad" + `(${allSquadMembers.length})`;
  if (alumni.isHacked === true) {
    clone.querySelector("[data-field=blood]").style.backgroundColor = "orange";
  }
  // student click
  let studentBtn = clone.querySelectorAll("td.showPopup");
  studentBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      showPopUp(alumni);
      // btn.style.backgroundColor = "yellow";
    });
  });
  // prefect click
  clone.querySelector("[data-field=prefect]").addEventListener("click", function () {
    prefectClick(alumni);
  });
  // Inquisitorial squad click
  clone.querySelector("[data-field=squad]").addEventListener("click", function () {
    squadClick(alumni);
  });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function tryToMakePrefect(selectedStudent) {
  // take all the students and filter them by every student where student.prefect is true
  const prefects = activeStudents.filter((student) => student.prefect);
  const other = prefects.filter((student) => student.house === selectedStudent.house);
  const numberOfOthers = other.length;

  if (selectedStudent.prefect === false) {
    if (numberOfOthers >= 2) {
      console.log("you can have only 2 prefects from 1 house", other);
      removePrefectAorB(other[0], other[1]);
      //  Display number of prefects
      document.querySelector("[data-filter=prefects]").textContent = "📛Prefects" + `(${allPrefects.length})`;
    } else {
      makePrefect(selectedStudent);
    }
    console.log("other student is", other);
  }

  function removePrefectAorB(prefectA, prefectB) {
    console.log("remove prefectA or prefectB");
    document.querySelector("#onlytwoprefects").classList.remove("hidden");
    document.querySelector("#onlytwoprefects [data-action=remove1]").addEventListener("click", clickRemoveA);
    document.querySelector("#onlytwoprefects [data-action=remove2]").addEventListener("click", clickRemoveB);

    // show names on buttons
    document.querySelector("#onlytwoprefects .student1").textContent = prefectA.firstName + " " + prefectA.lastName;
    document.querySelector("#onlytwoprefects .student2").textContent = prefectB.firstName + " " + prefectB.lastName;

    function closeDialog() {
      document.querySelector("#onlytwoprefects").classList.add("hidden");
      // its good practice to remove event listener if u dont need it anymore
      document.querySelector("#onlytwoprefects [data-action=remove1]").removeEventListener("click", clickRemoveA);
      document.querySelector("#onlytwoprefects [data-action=remove2]").removeEventListener("click", clickRemoveB);
    }

    function clickRemoveA() {
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }

    function clickRemoveB() {
      removePrefect(prefectB);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
    // prefects.length--;
    const index = allPrefects.indexOf(prefectStudent);
    allPrefects.splice(index, 1);
    buildList();
  }
  function makePrefect(student) {
    student.prefect = true;
    allPrefects.push(student);
    buildList();
    document.querySelector("[data-filter=prefects]").textContent = "📛Prefects" + `(${allPrefects.length})`;
  }
}

// filtering house
function filterList(house) {
  let list = activeStudents.filter(isStudentHouse);
  function isStudentHouse(student) {
    if (student.house === house) {
      return true;
    } else {
      return false;
    }
  }

  if (list.length === 0) {
    list = activeStudents;
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

// number of student in each house
function displayNumberOfStudentsInHouse() {
  // About interface || number of students in each house
  const gryffindor = activeStudents.filter((student) => student.house === "Gryffindor");
  document.querySelector("[data-filter=Gryffindor]").textContent = "🦁Gryffindor" + `(${gryffindor.length})`;

  const hufflepuff = activeStudents.filter((student) => student.house === "Hufflepuff");
  document.querySelector("[data-filter=Hufflepuff]").textContent = "🦡Hufflepuff" + `(${hufflepuff.length})`;
  const ravenclaw = activeStudents.filter((student) => student.house === "Ravenclaw");
  document.querySelector("[data-filter=Ravenclaw]").textContent = "🦅Ravenclaw" + `(${ravenclaw.length})`;
  const slytherin = activeStudents.filter((student) => student.house === "Slytherin");
  document.querySelector("[data-filter=Slytherin]").textContent = "🐍Slytherin" + `(${slytherin.length})`;
  //  Display number of students active, expelled and all students
  document.querySelector("[data-filter=enrolled]").textContent = "✅Enrolled Students" + `(${activeStudents.length})`;
  document.querySelector("[data-filter=expelled]").textContent = "❌Expelled Students" + `(${expelledStudents.length})`;
  document.querySelector("[data-filter=all]").textContent = "🎓All Students" + `(${allStudents.length})`;
}

function searchFunction() {
  const input = document.querySelector("#searchInput");
  const searchStr = input.value.toUpperCase();
  const searchedStudents = activeStudents.filter((student) => {
    return student.firstName.toUpperCase().includes(searchStr) || student.lastName.toUpperCase().includes(searchStr);
  });
  displayList(searchedStudents);
}

function showPopUp(student) {
  document.querySelector("#studentPopUp").classList.remove("hidden");
  document.querySelector("#studentPopUp [data-action=remove]").disabled = false;
  document.querySelector("#studentPopUp [data-action=remove]").style.color = "black";
  document.querySelector("#studentPopUp .closebutton").addEventListener("click", function () {
    closePopUp();
  });
  document.querySelector("#studentPopUp h2").textContent = student.firstName + " " + student.middleName + " " + student.nickName + " " + student.lastName;
  // document.querySelector("#studentPopUp .lastname").textContent = student.lastName;
  // document.querySelector("#studentPopUp .middlename").textContent = student.middleName;
  // document.querySelector("#studentPopUp .nickname").textContent = student.nickName;
  document.querySelector("#studentPopUp .image").src = `images/${student.image}`;
  document.querySelector("#studentPopUp .house").textContent = student.house;
  document.querySelector("#studentPopUp .prefect").textContent = student.prefect;
  document.querySelector("#studentPopUp .blood").textContent = student.blood;
  document.querySelector("#studentPopUp .status").textContent = student.expelled;

  // document.querySelector("#studentPopUp .characteristics").textContent = student.firstName;
  // show names on buttonsblack
  document.querySelector("#studentPopUp [data-action=remove]").textContent = "Expell: " + student.firstName + " " + student.lastName;
  document.querySelector("#studentPopUp [data-action=remove]").addEventListener("click", function () {
    expellStudent(student);
  });
  // specify color for the house
  if (student.house === "Gryffindor") {
    document.querySelector("#studentPopUp .house").textContent = "🦁" + student.house;
    document.querySelector("#studentPopUp .color1").style.backgroundColor = "#BB0000";
    document.querySelector("#studentPopUp .color2").style.backgroundColor = "#FFD700";
  } else if (student.house === "Hufflepuff") {
    document.querySelector("#studentPopUp .house").textContent = "🦡" + student.house;
    document.querySelector("#studentPopUp .color1").style.backgroundColor = "rgb(27, 27, 27)";
    document.querySelector("#studentPopUp .color2").style.backgroundColor = "yellow";
  } else if (student.house === "Ravenclaw") {
    document.querySelector("#studentPopUp .house").textContent = "🦅" + student.house;
    document.querySelector("#studentPopUp .color1").style.backgroundColor = "#065A79";
    document.querySelector("#studentPopUp .color2").style.backgroundColor = "#F5BE14";
  } else if (student.house === "Slytherin") {
    document.querySelector("#studentPopUp .house").textContent = "🐍" + student.house;
    document.querySelector("#studentPopUp .color1").style.backgroundColor = "rgb(13 157 101)";
    document.querySelector("#studentPopUp .color2").style.backgroundColor = "#E6E6E6";
  }

  // display student status on pop up
  if (student.expelled === false) {
    document.querySelector("#studentPopUp .status").textContent = "ACTIVE ";
    document.querySelector("#studentPopUp .status").style.color = "#3ECD78";
  }
  // display prefect on pop up only if student is prefect
  if (student.prefect) {
    document.querySelector("#studentPopUp .prefect").textContent = "📛Prefect";
  } else {
    document.querySelector("#studentPopUp .prefect").textContent = "Not a prefect";
  }
  // display squad on pop up only if student is prefect
  if (student.squad) {
    document.querySelector("#studentPopUp .squad").textContent = "🎖️Squad member";
  } else {
    document.querySelector("#studentPopUp .squad").textContent = "Not a Squad member";
  }
}
function closePopUp() {
  document.querySelector("#studentPopUp").classList.add("hidden");
  // document.querySelector("#studentPopUp [data-action=remove]").textContent = "Expell: " + student.firstName + " " + student.lastName;
  document.querySelector("#studentPopUp [data-action=remove]").style.backgroundColor = "orange";
}

function expellStudent(expelledStudent) {
  if (expelledStudent.isHacker === true) {
    document.querySelector("#hackerMessage").classList.remove("hidden");
    setTimeout(removeHackerMessage, 3000);
    expelledStudent.expelled = false;
  } else {
    // removeHackerMessage();
    document.querySelector("#studentPopUp .status").textContent = "EXPELLED";
    document.querySelector("#studentPopUp .status").style.color = "#E73D5C";
    document.querySelector("#studentPopUp [data-action=remove]").disabled = true;
    document.querySelector("#studentPopUp [data-action=remove]").style.backgroundColor = "red";
    document.querySelector("#studentPopUp [data-action=remove]").style.color = "white";
    document.querySelector("#studentPopUp [data-action=remove]").innerHTML = "EXPELLED!!!";
    setTimeout(function () {
      waitAndRemove(expelledStudent);
    }, 3000);
    expelledStudent.expelled = true;
  }

  buildList();
  document.querySelector(".showPopup").classList.add("glow");
}

// prefect
function prefectClick(alumni) {
  if (alumni.prefect === true) {
    alumni.prefect = false;
    const index = allPrefects.indexOf(alumni);
    allPrefects.splice(index, 1);
    document.querySelector("[data-filter=prefects]").textContent = "📛Prefects" + `(${allPrefects.length})`;

    console.log("make false");
  } else {
    tryToMakePrefect(alumni);
    console.log("make true");
  }

  buildList();
}

// blood

function defineBloodStatus(alumni) {
  // Former pure-bloods will get completely random blood-status, whereas half- and muggle-bloods will be listed as pure-blood.
  // If you can randomly modify the former pure - bloods on every redisplay(sort or filter) of the list, the better!

  // if (alumni.blood === "pure blood") {
  //   console.log("you should be RANDOM blood");
  //   getRandomBloodStatus(alumni);
  //   console.log("random", alumni);
  // } else if (alumni.blood === "half blood" || alumni.blood === "muggle") {
  //   alumni.blood = "pure blood";
  //   console.log("you should be PURE blood");
  //   console.log("pure", alumni);
  //   return alumni;
  // }

  // ORIGINAL FUNCTION

  if (halfBlood.includes(alumni.lastName)) {
    alumni.blood = "half blood";
    // if (isHacked === true) {
    //   alumni.blood = "pure blood";
    // }
  } else if (pureBlood.includes(alumni.lastName)) {
    alumni.blood = "pure blood";
    // if (isHacked === true) {
    //   getRandomBloodStatus(alumni);
    // }
  } else {
    alumni.blood = "muggle";
    // if (isHacked === true) {
    //   alumni.blood = "pure blood";
    // console.log("blood is", alumni.blood);
    // console.log("blood object is", alumni);
    // }
  }
}

function getRandomBloodStatus(alumni) {
  if (alumni.blood === "pure blood") {
    let p = "pure blood";
    let h = "half blood";
    let m = "muggle";
    let hackedBloodStatus = [p, h, m];
    let randomNumber = Math.floor(Math.random() * 3);
    alumni.blood = hackedBloodStatus[randomNumber];
    console.log(alumni.blood);
  } else if (alumni.blood === "half blood" || alumni.blood === "muggle") {
    alumni.blood = "pure blood";
  }
}

// squad close message popup
function closeMessage() {
  document.querySelector("#squad").classList.add("hidden");
  document.querySelector("#squad").removeEventListener("click", closeMessage);
}

// squad function
function squadClick(alumni) {
  if (isHacked === true) {
    hackSquad(alumni);
    buildList();
  }

  // IF NOT HACKED THE ORIGINAL SQUAD FUNCTION is below ONLY WRAPPED IN ELSE STATEMENT{}
  else if (isHacked === false) {
    if (alumni.blood === "pure blood" || alumni.house === "Slytherin") {
      if (alumni.squad === true) {
        removeSquadMember(alumni);
      } else {
        makeSquadMember(alumni);
      }
    } else {
      console.log("not a pure blood student");
      document.querySelector("#squad").classList.remove("hidden");
      document.querySelector("#squad").addEventListener("click", closeMessage);
    }
  }
}
function makeSquadMember(alumni) {
  alumni.squad = true;
  allSquadMembers.push(alumni);
  buildList();
}
function removeSquadMember(alumni) {
  alumni.squad = false;
  const index = allSquadMembers.indexOf(alumni);
  allSquadMembers.splice(index, 1);
  document.querySelector("[data-filter=squad]").textContent = "Squad" + `(${allSquadMembers.length})`;
  buildList();
}

function hackSquad(alumni) {
  if (alumni.squad === false) {
    console.log("hacker mode squad TRUE");
    makeSquadMember(alumni);
    setTimeout(function () {
      removeSquadMember(alumni);
    }, 3000);
  } else if (isHacked === false) {
    removeSquadMember(alumni);
  }
}
// HACKING
// task1 create objectMe and then add it to array and build list and make hacker impossible to be expelled DONE
// task3 system is hacked = true ... big global flag so we know system is hacked
// task 3 continue.. if the hack is on than add the timer which removes the inq squad property from the object
// task 2 mess up blood status in the loop by some rules
function hackTheSystem() {
  isHacked = true;
  const hacker = Object.create(Student);
  hacker.firstName = "Zuzana";
  hacker.nickName = "Zuz";
  hacker.lastName = "Chudinova";
  hacker.image = "zuz.png";
  hacker.gender = "girl";
  hacker.house = "KEA";
  hacker.expelled = false;
  hacker.prefect = false;
  hacker.blood = "pure blood";
  hacker.squad = false;
  hacker.isHacker = true;
  console.log("hacker", hacker);
  activeStudents.unshift(hacker);
  console.log("hacked list", activeStudents);
  document.querySelector("#hackerAnimation").classList.remove("hidden");
  document.querySelector("#hackerMusic").play();
  document.querySelector("table").style.backgroundColor = "black";
  document.querySelector("table").style.color = "white";
  document.querySelector("button[data-filter=all]").classList.add("hidden");
  setTimeout(removeAnimation, 3000);
  buildList();
}

function removeAnimation() {
  document.querySelector("#hackerAnimation").classList.add("hidden");
}

function removeHackerMessage() {
  document.querySelector("#hackerMessage").classList.add("hidden");
}

function waitAndRemove(expelledStudent) {
  let index = activeStudents.indexOf(expelledStudent);
  if (index > -1) {
    activeStudents.splice(index, 1);
    expelledStudents.push(expelledStudent);
  }
  buildList();
}
document.querySelector("#hacker").addEventListener("click", hackTheSystem);
