// === Default Quotes Array ===
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Success" }
];

// === DOM Elements ===
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteBtn = document.getElementById("newQuote");

// === Display Random Quote ===
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes in this category yet.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;

  // Save last viewed quote in session storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// === Add New Quote ===
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);

  // Save to local storage
  localStorage.setItem("quotes", JSON.stringify(quotes));

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  populateCategories();
  showRandomQuote();
}

// === Populate Categories Dropdown ===
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const lastFilter = localStorage.getItem("lastFilter");
  if (lastFilter) categoryFilter.value = lastFilter;
}

// === Filter Quotes ===
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("lastFilter", selected);
  showRandomQuote();
}

// === Export Quotes to JSON File ===
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// === Import Quotes from JSON File ===
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = [...quotes, ...importedQuotes];
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading file. Please upload a valid JSON file.");
    }
  };
  reader.readAsText(file);
}

// === Event Listeners ===
newQuoteBtn.addEventListener("click", showRandomQuote);

// === Initialize App ===
window.onload = function () {
  populateCategories();
  showRandomQuote();

  // Restore last viewed quote if exists
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    const parsed = JSON.parse(lastQuote);
    quoteDisplay.textContent = `"${parsed.text}" — (${parsed.category})`;
  }
};
