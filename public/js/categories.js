// document.addEventListener("DOMContentLoaded", () => {
//   document
//     .getElementById("addCategoryForm")
//     .addEventListener("submit", async (event) => {
//       event.preventDefault();
//       const name = document.getElementById("categoryName").value;

//       await fetch("/categories", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, user_id }),
//       });

//       window.location.reload();
//     });
// });

// const deleteCategory = async (id) => {
//   const user_id = 1; // Replace with the actual user ID

//   await fetch(`/categories/${id}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ user_id }),
//   });

//   window.location.reload();
// };
