// const {
//   checkAllInputsIfFilled,
// } = require("../../utils/checkAllInputsIfFilled.js");

const registerForm = document.getElementById("register-form");
const responseDisplay = document.getElementById("response-display");

// checkAllInputsIfFilled("submit-btn");

//* Can place in a util function
const loadingSpinner = `
<div class="fa-3x">
  <i class="fa-solid fa-cog fa-spin"></i>
</div>
`;

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = e.target.username.value;
  const email = e.target.email.value;
  const password = e.target.password.value;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  };

  try {
    responseDisplay.innerHTML = loadingSpinner;

    const res = await fetch("/register", options);
    if (res.ok) {
      window.location.href = "/";
    } else {
      const data = await res.json();
      responseDisplay.innerText = data.error || "Registration failed";
    }
  } catch (err) {
    console.error(err);
    responseDisplay.innerHTML = `An error occurred ${err.message}`;
  }

  //Check if needed
  //* Can place in a util function
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
});
