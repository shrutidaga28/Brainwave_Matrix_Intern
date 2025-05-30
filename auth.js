function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || {};
}

function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }

  const users = getUsers();
  if (users[email]) {
    alert("User already exists. Please login.");
    return;
  }

  users[email] = password;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", email); // set session

  alert("Signup successful!");
  window.location.href = "index.html"; // redirect to planner
}

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const users = getUsers();
  if (users[email] && users[email] === password) {
    localStorage.setItem("loggedInUser", email);
    window.location.href = "index.html"; // redirect to planner
  } else {
    alert("Invalid email or password.");
  }
}

