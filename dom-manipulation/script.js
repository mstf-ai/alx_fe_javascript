// === Default Quotes Array ===
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "The best way to get started is to quit talking and begin doing.", category: "Motivation", updatedAt: Date.now() },
  { id: 2, text: "Don’t let yesterday take up too much of today.", category: "Inspiration", updatedAt: Date.now() },
  { id: 3, text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Success", updatedAt: Date.now() }
];

// === DOM Elements ===
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteBtn = document.getElementById("newQuote");
const syncStatus = document.getElementById("syncStatus");

// === Show Random Quote ===
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;

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

  const newQuote = { id: Date.now(), text, category, updatedAt: Date.now() };
  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  populateCategories();
  showRandomQuote();
  notifySyncNeeded();
}

// === Populate Categories ===
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const lastFilter = localStorage.getItem("lastFilter");
  if (lastFilter) categoryFilter.value = lastFilter;
}

// === Filter Quotes ===
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("lastFilter", selected);
  showRandomQuote();
}

// === Export Quotes ===
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

// === Import Quotes ===
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = mergeQuotes(quotes, importedQuotes);
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        alert("Quotes imported and synced!");
      }
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
}

// === Conflict Resolution (merge strategy) ===
function mergeQuotes(local, server) {
  const merged = [...local];
  for (const sQuote of server) {
    const existing = merged.find(q => q.id === sQuote.id);
    if (!existing) {
      merged.push(sQuote); // new from server
    } else if (sQuote.updatedAt > existing.updatedAt) {
      // conflict → server wins
      const index = merged.indexOf(existing);
      merged[index] = sQuote;
    }
  }
  return merged;
}

// === Simulate Sync with Server ===
async function syncWithServer() {
  syncStatus.textContent = "Syncing with server...";

  try {
    // Simulated server data fetch (using placeholder API)
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverData = await response.json();

    // Convert fake posts to quotes
    const serverQuotes = serverData.map(p => ({
      id: p.id,
      text: p.title,
      category: "Server",
      updatedAt: Date.now()
    }));

    // Merge local & server
    quotes = mergeQuotes(quotes, serverQuotes);

    // Save merged version
    localStorage.setItem("quotes", JSON.stringify(quotes));

    populateCategories();
    showRandomQuote();

    syncStatus.textContent = "✅ Synced successfully!";
  } catch (error) {
    syncStatus.textContent = "⚠️ Failed to sync (offline mode).";
  }
}

// === Notify that sync is needed ===
function notifySyncNeeded() {
  syncStatus.textContent = "Changes detected — syncing soon...";
}

// === Initialize ===
newQuoteBtn.addEventListener("click", showRandomQuote);

window.onload = () => {
  populateCategories();
  showRandomQuote();

  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    const q = JSON.parse(lastQuote);
    quoteDisplay.textContent = `"${q.text}" — (${q.category})`;
  }

  syncWithServer(); // Initial sync
  setInterval(syncWithServer, 30000); // Sync every 30 seconds
};
