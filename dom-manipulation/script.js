// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
  // Initial quotes array
  const quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Motivation" },
    { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
    { text: "Learning never exhausts the mind.", category: "Education" },
  ];

  // Select DOM elements
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteButton = document.getElementById("newQuote");
  const addQuoteBtn = document.getElementById("addQuoteBtn");
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");
  const categorySelect = document.getElementById("categorySelect");

  // Function: show a random quote
  function showRandomQuote() {
    const selectedCategory = categorySelect.value;
    let filteredQuotes = quotes;

    if (selectedCategory !== "all") {
      filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (filteredQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes found for this category.";
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>- ${quote.category}</small>`;
  }

  // Function: Add new quote
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (!text || !category) {
      alert("Please enter both quote text and category.");
      return;
    }

    // Add to quotes array
    quotes.push({ text, category });

    // Update category dropdown dynamically
    if (![...categorySelect.options].some(opt => opt.value.toLowerCase() === category.toLowerCase())) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    }

    // Clear input fields
    newQuoteText.value = "";
    newQuoteCategory.value = "";

    alert("New quote added successfully!");
  }

  // Event listeners
  newQuoteButton.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
  categorySelect.addEventListener("change", showRandomQuote);

  // Initialize default display and category dropdown
  function initializeCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }

  // Run initial setup
  initializeCategories();
  showRandomQuote();
});
