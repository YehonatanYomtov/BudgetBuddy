const registerForm = document.getElementById("register-form");
const responseDisplay = document.getElementById("response-display");

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
  const confirmPassword = e.target.confirmPassword.value;

  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
  const numberPattern = /[0-9]/;

  const containsSpecialChar = specialCharPattern.test(password);
  const containsNumber = numberPattern.test(password);

  if (!containsSpecialChar || !containsNumber) {
    responseDisplay.innerHTML = `Password must contain a number and special character <br /> (e.g: # | @ $ etc.).`;
    return;
  }

  if (!username || !email || !password) {
    //* Can place in a util function
    responseDisplay.innerHTML = "All fields are required.";
    return;
  }

  //* Can place in a util function
  if (password !== confirmPassword) {
    responseDisplay.innerHTML =
      "Password and Password-Confirmation don't match.";
    e.target.password.value = "";
    e.target.confirmPassword.value = "";
    return;
  }

  //* Can place in a util function
  if (password.length < 6) {
    responseDisplay.innerHTML = "Password must be at least 6 characters long.";
    e.target.password.value = "";
    e.target.confirmPassword.value = "";
    return;
  }

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

  document.querySelectorAll("input").forEach((input) => (input.value = ""));
});
