//! Disable submit (login/register) button until all inputs are filled

const registerForm = document.getElementById("register-form");

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
    const res = await fetch("/register", options);
    if (res.ok) {
      window.location.href = "/";
    } else {
      const data = await res.json();
      document.getElementById("response-display").innerText =
        data.error || "Registration failed";
    }
  } catch (err) {
    console.error(err);
    document.getElementById(
      "response-display"
    ).innerText = `An error occurred ${err.message}`;
  }
});
