// const apiUrl1 = `http://localhost:3000`;
const apiUrl = "http://54.234.242.153:3000"

const form = document.getElementById("expenseForm");
const submitButton = document.getElementById("submitButton");
const expanseList = document.getElementById("expenseList");

const prevExpensePageButton = document.getElementById("prevExpensePageButton");
const nextExpensePageButton = document.getElementById("nextExpensePageButton");
const currentPageSpan = document.getElementById("currentExpensePage");
const token = localStorage.getItem("token");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

let isUpdating = false;

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("isPremium");
  window.location.href = `${apiUrl1}/api/welcome`;
};
document.getElementById("logoutBtn").addEventListener("click", logout);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const expense = {
    name: formData.get("name"),
    quantity: formData.get("quantity"),
    amount: formData.get("amount"),
  };

  try {
    if (isUpdating) {
      const expanseId = formData.get("expenseId");
      const response = await fetch(`${apiUrl1}/expenses/${expanseId}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(expense),
      });
      if (response.ok) {
        isUpdating = false;
        form.reset();
        fetchExpenseList();
        submitButton.innerHTML = "Submit";
      } else {
        console.log("error updating expense", response.statusText);
      }
    } else {
      const response = await fetch(`${apiUrl1}/expenses`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      form.reset();
      fetchExpenseList();
    }
  } catch (err) {
    console.log("Error Occured while adding expanse :", err);
  }
});

let currentPage=1;

async function fetchExpenseList(page = 1) {
  try {
    const response = await fetch(`${apiUrl1}/expenses/paginated?page=${page}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const expenses = data.expenses;

    expanseList.innerHTML = "";

    expenses.forEach((expanse) => {
      const expenseItem = document.createElement("div");
      expenseItem.innerHTML = `
        <div>
          <span>Name: ${expanse.name} </span>
          <span>Quantity: ${expanse.quantity} </span>
          <span>Amount: ${expanse.amount} </span>
          <button data-expense-id="${expanse.id}" class="update-button">Update</button>
          <button onclick="deleteExpanse(${expanse.id})" >Delete</button>
        </div>
      `;
      expanseList.appendChild(expenseItem);
    });
    updatePagination(data);
  } catch (err) {
    console.log("Error Occurred while fetching data", err);
  }
}

prevExpensePageButton.addEventListener("click", () => {
  if(currentPage > 1){
    currentPage--;
    fetchExpenseList(currentPage);
  }
});

nextExpensePageButton.addEventListener("click", () =>{
  currentPage++;
  fetchExpenseList(currentPage);
})

function updatePagination(data) {
  if (data.totalPages >= 1) {
    prevExpensePageButton.disabled = currentPage === 1;
    nextExpensePageButton.disabled = currentPage === data.totalPages;

    currentPageSpan.innerText = `Page ${currentPage} of ${data.totalPages}`;
  } else {
    currentPageSpan.innerText = `Page 1 of 1`;
  }
}

expanseList.addEventListener("click", async (e) => {
  if (e.target && e.target.matches("button.update-button")) {
    const expenseId = e.target.getAttribute("data-expense-id");
    try {
      const response = await fetch(`${apiUrl}/api/expenses/${expenseId}`, {
        method: "GET",
        headers: headers,
      });

      if (response.ok) {
        const expenseItem = await response.json();

        form.querySelector("#name").value = expenseItem.name;
        form.querySelector("#quantity").value = expenseItem.quantity;
        form.querySelector("#amount").value = expenseItem.amount;
        form.querySelector("#expenseId").value = expenseItem.id;

        submitButton.innerText = "Update";
        isUpdating = true;
      } else {
        console.error("error fetching expense details:", response);
      }
    } catch (error) {
      console.error("error fetching expense details:", error);
    }
  }
});

function deleteExpanse(expanseId) {
  fetch(`${apiUrl1}/expenses/${expanseId}`, {
    method: "DELETE",
    headers: headers,
  })
    .then((res) => {
      if (res.ok) {
        fetchExpenseList();
      } else {
        console.log("error occured while deleting expanse", res.statusText);
      }
    })
    .catch((err) => {
      console.error("error occured while delting expanse", err);
    });
}
document.addEventListener("DOMContentLoaded", function () {
  fetchExpenseList(currentPage);
});