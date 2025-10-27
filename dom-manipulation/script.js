let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function addQuote(newQuote) {
  if (newQuote.trim() !== "") {
    quotes.push(newQuote.trim());
    saveQuotes();
    displayQuote(newQuote);
  }
}

function addQuoteFromInput() {
  const input = document.getElementById('quoteInput');
  addQuote(input.value);
  input.value = "";
}

function showRandomQuote() {
  if (quotes.length === 0) {
    alert("No quotes available.");
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  displayQuote(quote);
}

function displayQuote(quote) {
  document.getElementById('quoteDisplay').textContent = quote;
  sessionStorage.setItem('lastViewedQuote', quote);
}

function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch (err) {
      alert('Error reading file: ' + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

window.onload = function () {
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastQuote) {
    displayQuote(lastQuote);
  }
};