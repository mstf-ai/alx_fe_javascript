// Initial quotes data
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const addQuoteButton = document.getElementById("addQuoteBtn");
const categoriesList = document.getElementById("categoriesList");

// Function to show a random quote
function showRandomQuote(category = null) {
  let filteredQuotes = category ? quotes.filter(q => q.category === category) : quotes;
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const { text, category: cat } = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${text}"</p><small>— ${cat}</small>`;
}

// Function to add a new quote dynamically
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text: newQuoteText, category: newQuoteCategory });
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  updateCategories();
  showRandomQuote(newQuoteCategory);
  alert("New quote added successfully!");
}

// Function to display unique categories
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

// Event listeners
newQuoteButton.addEventListener("click", () => showRandomQuote());
addQuoteButton.addEventListener("click", addQuote);

// Initialize
updateCategories();
