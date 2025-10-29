// Wait until DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initial quotes
  const quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Motivation" },
    { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
    { text: "Learning never exhausts the mind.", category: "Education" },
  ];

  // Select elements
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteButton = document.getElementById("newQuote");
  const categorySelect = document.getElementById("categorySelect");
  const formContainer = document.getElementById("formContainer");

  /**
   * Function to show a random quote
   */
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

  /**
   * Function to add a new quote
   */
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");

    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (!text || !category) {
      alert("Please enter both quote text and category.");
      return;
    }

    quotes.push({ text, category });

    // Update categories dropdown dynamically
    if (![...categorySelect.options].some(opt => opt.value.toLowerCase() === category.toLowerCase())) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    }

    newQuoteText.value = "";
    newQuoteCategory.value = "";

    alert("New quote added successfully!");
  }

  /**
   * Function to dynamically create the Add Quote form
   */
  function createAddQuoteForm() {
    const formTitle = document.createElement("h2");
    formTitle.textContent = "Add a New Quote";

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = "newQuoteText";
    textInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.id = "newQuoteCategory";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.id = "addQuoteBtn";
    addButton.addEventListener("click", addQuote);

    // Append all to the container
    formContainer.appendChild(formTitle);
    formContainer.appendChild(textInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
  }

  /**
   * Function to initialize category dropdown
   */
  function initializeCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }

  // Initialize everything
  createAddQuoteForm();
  initializeCategories();
  showRandomQuote();

  // Event listeners
  newQuoteButton.addEventListener("click", showRandomQuote);
  categorySelect.addEventListener("change", showRandomQuote);
});
