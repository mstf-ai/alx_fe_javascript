// script.js
// Dynamic Quote Generator with Local Storage, Session Storage, and JSON Import/Export

document.addEventListener('DOMContentLoaded', function () {
  const LS_KEY = 'quotes';
  const SESSION_LAST = 'lastViewedQuote';

  // Select DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');
  const exportBtn = document.createElement('button');
  exportBtn.textContent = 'Export Quotes';
  exportBtn.id = 'exportBtn';
  document.body.appendChild(exportBtn);

  const importFile = document.createElement('input');
  importFile.type = 'file';
  importFile.id = 'importFile';
  importFile.accept = '.json';
  importFile.onchange = function (event) {
    importFromJsonFile(event);
  };
  document.body.appendChild(importFile);

  const addForm = document.createElement('div');
  addForm.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;
  document.body.appendChild(addForm);

  let quotes = [];

  // ✅ Load quotes from local storage on initialization
  function loadQuotes() {
    const storedQuotes = localStorage.getItem(LS_KEY);
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    } else {
      quotes = [
        { text: 'The best way to predict the future is to create it.', category: 'Inspiration' },
        { text: 'Code is like humor. When you have to explain it, it’s bad.', category: 'Programming' },
      ];
      localStorage.setItem(LS_KEY, JSON.stringify(quotes));
    }
  }

  // ✅ Save quotes to local storage
  function saveQuotes() {
    localStorage.setItem(LS_KEY, JSON.stringify(quotes));
  }

  // ✅ Show random quote and save to session storage
  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.textContent = 'No quotes available.';
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;

    // ✅ Save last viewed quote to session storage
    sessionStorage.setItem(SESSION_LAST, JSON.stringify(quote));
  }

  // ✅ Add quote function
  function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim() || 'General';

    if (!text) {
      alert('Please enter a quote.');
      return;
    }

    quotes.push({ text, category });
    saveQuotes();
    alert('Quote added successfully!');
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  }

  // ✅ Export quotes as JSON file
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ✅ Import quotes from JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }

  // ✅ Attach event listeners
  newQuoteBtn.addEventListener('click', showRandomQuote);
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
  exportBtn.addEventListener('click', exportToJsonFile);

  // ✅ Initialize app
  loadQuotes();

  // Optional: show last viewed quote from session storage
  const lastViewed = sessionStorage.getItem(SESSION_LAST);
  if (lastViewed) {
    const lastQuote = JSON.parse(lastViewed);
    quoteDisplay.textContent = `Last viewed: "${lastQuote.text}" — ${lastQuote.category}`;
  }
});
