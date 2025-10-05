// ---------------- URLs ----------------
const BACKEND_URL = "https://expense-tracker-gpov.onrender.com"; // Render backend
const FRONTEND_URL = "https://Adityaxletscode.github.io/Expense-tracker"; // GitHub Pages frontend

// ---------------- Login/Signup Elements ----------------
const errorMsg = document.querySelector(".error_message");
const budgetInput = document.querySelector(".budget_input");
const expenseDesc = document.querySelector(".expenses_input");
const expenseAmount = document.querySelector(".expenses_amount");
const tblRecord = document.querySelector(".tbl_data");
const budgetCard = document.querySelector(".budget_card");
const expensesCard = document.querySelector(".expenses_card");
const balanceCard = document.querySelector(".balance_card");
const loginBtn = document.getElementById("loginBtn");

let itemList = [];
let itemId = 0;

// ---------------- Show welcome message if logged in ----------------
window.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  if (username) {
    loginBtn.style.display = "none";

    const welcomeDiv = document.createElement("div");
    welcomeDiv.id = "welcomeMsg";
    welcomeDiv.style.textAlign = "right";
    welcomeDiv.style.margin = "10px";
    welcomeDiv.style.fontWeight = "bold";
    welcomeDiv.textContent = `Welcome, ${username}!`;

    const container = document.querySelector(".container");
    container.parentNode.insertBefore(welcomeDiv, container);
  } else {
    loginBtn.style.display = "block";
  }
});

// ---------------- Redirect to login page ----------------
loginBtn?.addEventListener("click", () => {
  window.location.href = `${FRONTEND_URL}/login/index.html`;
});

// ---------------- Budget & Expense button events ----------------
function btnEvents() {
  const btnBudgetCal = document.querySelector("#btn_budget");
  const btnExpenseCal = document.querySelector("#btn_expenses");

  btnBudgetCal?.addEventListener("click", (e) => {
    e.preventDefault();
    budgetFun();
  });

  btnExpenseCal?.addEventListener("click", (e) => {
    e.preventDefault();
    expensesFun();
  });
}

document.addEventListener("DOMContentLoaded", btnEvents);

// ---------------- Show error messages ----------------
function showError(msg) {
  if (!errorMsg) return;
  errorMsg.innerHTML = msg;
  errorMsg.style.display = "block";
  errorMsg.classList.add("error");

  setTimeout(() => {
    errorMsg.innerHTML = "";
    errorMsg.style.display = "none";
    errorMsg.classList.remove("error");
  }, 2500);
}

// ---------------- Budget calculation ----------------
function budgetFun() {
  const budgetValue = budgetInput.value.trim();

  if (
    budgetValue === "" ||
    isNaN(budgetValue) ||
    parseFloat(budgetValue) <= 0
  ) {
    showError("⚠ Please enter a valid budget amount greater than 0");
  } else {
    budgetCard.textContent = parseFloat(budgetValue);
    showBalance();
    clearInputs();
  }
}

// ---------------- Expenses calculation ----------------
function expensesFun() {
  const desc = expenseDesc.value.trim();
  const amountValue = expenseAmount.value.trim();

  if (desc === "" || amountValue === "" || parseFloat(amountValue) <= 0) {
    showError("⚠ Please enter a valid expense description and amount");
  } else {
    const amount = parseFloat(amountValue);
    const item = { id: itemId++, desc, expenseAmount: amount };
    itemList.push(item);
    renderTable();
    showBalance();
    clearInputs();
  }
}

// ---------------- Render expense table ----------------
function renderTable() {
  tblRecord.innerHTML = "";
  itemList.forEach((item, index) => {
    const li = document.createElement("ul");
    li.classList.add("tbl_tr_content");
    li.innerHTML = `
      <li>${index + 1}</li>
      <li>${item.desc}</li>
      <li><span>₹</span>${item.expenseAmount}</li>
      <li>
        <button type="button" class="btn_edit">Edit</button>
        <button type="button" class="btn_delete">Delete</button>
      </li>
    `;
    tblRecord.appendChild(li);

    li.querySelector(".btn_delete").addEventListener("click", () => {
      const deleteIndex = itemList.findIndex((i) => i.id === item.id);
      if (deleteIndex > -1) {
        itemList.splice(deleteIndex, 1);
        itemList.forEach((i, idx) => (i.id = idx));
        itemId = itemList.length;
        renderTable();
        showBalance();
      }
    });

    li.querySelector(".btn_edit").addEventListener("click", () => {
      expenseDesc.value = item.desc;
      expenseAmount.value = item.expenseAmount;
      const editIndex = itemList.findIndex((i) => i.id === item.id);
      if (editIndex > -1) {
        itemList.splice(editIndex, 1);
        renderTable();
        showBalance();
      }
    });
  });
}

// ---------------- Total expenses calculation ----------------
function totalExpenses() {
  return itemList.length > 0
    ? itemList.reduce((acc, curr) => acc + curr.expenseAmount, 0)
    : 0;
}

// ---------------- Show balance ----------------
function showBalance() {
  const expenses = totalExpenses();
  expensesCard.textContent = expenses;
  const budget = parseFloat(budgetCard.textContent || 0);
  const balance = budget - expenses;
  balanceCard.textContent = balance;
}

// ---------------- Clear input fields ----------------
function clearInputs() {
  setTimeout(() => {
    budgetInput.value = "";
    expenseDesc.value = "";
    expenseAmount.value = "";
  }, 1500);
}
