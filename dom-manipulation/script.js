// Load quotes from localStorage or set defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const addQuoteButton = document.getElementById("addQuoteBtn");
const exportButton = document.getElementById("exportBtn");
const importButton = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const categoriesList = document.getElementById("categoriesList");

// --- Show Random Quote ---
function showRandomQuote(category = null) {
  let filtered = category ? quotes.filter(q => q.category === category) : quotes;
  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes found in this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];

  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;

  // Save last viewed quote to sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// --- Add Quote ---
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please fill in both fields");
    return;
  }

  quotes.push({ text, category });
  localStorage.setItem("quotes", JSON.stringify(quotes)); // Save to localStorage

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  updateCategories();
  showRandomQuote(category);
  alert("Quote added successfully!");
}

// --- Update Category Buttons ---
function updateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoriesList.innerHTML = "";
  uniqueCategories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => showRandomQuote(cat);
    categoriesList.appendChild(btn);
  });
}

// --- Export Quotes to JSON File ---
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --- Import Quotes from JSON File ---
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) {
    alert("Please select a JSON file first.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        localStorage.setItem("quotes", JSON.stringify(quotes));
        updateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Error reading file: " + err.message);
    }
  };
  reader.readAsText(file);
}

// --- Event Listeners ---
newQuoteButton.addEventListener("click", () => showRandomQuote());
addQuoteButton.addEventListener("click", addQuote);
exportButton.addEventListener("click", exportToJsonFile);
importButton.addEventListener("click", () => importFromJsonFile({ target: importFile }));

// --- Initialization ---
updateCategories();

// Load last viewed quote from sessionStorage (optional)
const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
if (lastQuote) {
  quoteDisplay.innerHTML = `<p>"${lastQuote.text}"</p><small>— ${lastQuote.category}</small>`;
} else {
  showRandomQuote();
}
