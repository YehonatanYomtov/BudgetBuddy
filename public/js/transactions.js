document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("dateOption").addEventListener("change", function () {
    let dateInput = document.getElementById("transactionDate");
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
    if (this.value === "today") {
      dateInput.style.display = "none";
    } else if (this.value === "choose") {
      dateInput.style.display = "block";
    }
  });
  document.getElementById("dateOption").dispatchEvent(new Event("change"));

  document
    .getElementById("addTransactionBtn")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const amountElement = document.getElementById("transactionAmount");
      const addTransactionErrorElement = document.getElementById(
        "addTransactionError"
      );

      //Error handling - amount input is not a valid number
      if (!/^\d+(\.\d+)?$/.test(amountElement.value)) {
        addTransactionErrorElement.innerText = "Amount must be a valid number";
        addTransactionErrorElement.style.display = "block";
        return;
      } else {
        addTransactionErrorElement.style.display = "none";
      }

      const amountValue = parseFloat(amountElement.value);

      //Fetch conversion rate and submit the form data
      fetch("/api/get-api-key")
        .then((response) => response.json())
        .then((data) => {
          const apiKey = data.apiKey;
          const baseCurrency = document.getElementById("currencySelect").value;
          const targetCurrency = "ILS";

          const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${baseCurrency}/${targetCurrency}`;
          return axios.get(url);
        })
        .then((response) => response.data.conversion_rate)
        .then((conversion_rate) => {
          const conversionRate = parseFloat(conversion_rate);

          //error handling - cannot get conversion rate from the API
          if (isNaN(conversionRate)) {
            addTransactionErrorElement.innerText =
              "Error getting conversion rate from the API, please try again later.";
            addTransactionErrorElement.style.display = "block";
            return;
          } else {
            addTransactionErrorElement.style.display = "none";
          }

          const totalTransactionAmount = (conversionRate * amountValue).toFixed(
            2
          );

          //create a formData object manually and append form data to the database
          const formData = {
            user_id: document.querySelector('input[name="user_id"]').value,
            amount: totalTransactionAmount,
            description: document.getElementById("transactionDescription")
              .value,
            transaction_date: document.getElementById("transactionDate").value,
            category_id: document.getElementById("transactionCategory").value,
            type: document.getElementById("transactionType").value,
          };
          return fetch("/transactions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            addTransactionErrorElement.style.display = "none";

            const newTransaction = data.transaction[0];
            const transactionsList =
              document.getElementById("transactionsList");
            const transactionRow = document.createElement("tr");
            transactionRow.id = `transaction-${newTransaction.id}`;
            transactionRow.innerHTML = `
                    <td>${newTransaction.amount}</td>
                    <td>${newTransaction.description}</td>
                    <td>${newTransaction.transaction_date}</td>
                    <td>${newTransaction.category_name}</td>
                    <td class="${newTransaction.type} === 'income' ? 'income' : 'expense' %>">${newTransaction.type}</td>
                    <td>
                        <button class="delete-btn" data-id="${newTransaction.id}" user-id="${newTransaction.user_id}">x</button>
                    </td>
                `;
            transactionsList.insertBefore(
              transactionRow,
              transactionsList.firstChild
            );
          } else {
            addTransactionErrorElement.innerText =
              "Transaction addition failed.";
            addTransactionErrorElement.style.display = "block";
          }
          document.getElementById("transactionAmount").value = "";
          document.getElementById("transactionDescription").value = "";
        })
        .catch((error) => {
          console.error("Error adding transaction:", error);
        });
    });

  // Event delegation for delete buttons
  document
    .getElementById("transactionsList")
    .addEventListener("click", async function (event) {
      if (event.target.classList.contains("delete-btn")) {
        const transactionId = event.target.getAttribute("data-id");

        try {
          const response = await axios.post(
            `/transactions/delete/${transactionId}`
          );
          if (response.data.success) {
            document.getElementById(`transaction-${transactionId}`).remove();
          }
        } catch (err) {
          console.error("Error deleting transaction:", err);
        }
      }
    });
});
