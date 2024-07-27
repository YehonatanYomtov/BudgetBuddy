function checkAllInputsIfFilled(btnId) {
  const inputs = document.querySelectorAll("input");
  const submitBtn = document.getElementById(btnId);
  console.log("In The CHECKER");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const allFilled = Array.from(inputs).every(
        (input) => input.value.trim() !== ""
      );
      submitBtn.disabled = !allFilled;
    });
  });
}

module.exports = {
  checkAllInputsIfFilled,
};
