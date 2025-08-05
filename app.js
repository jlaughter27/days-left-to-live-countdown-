const lifespanYears = 80;
const birthdates = {
  josh: new Date('1993-03-29'),
  tiffanie: new Date('1995-03-04'),
  jocelynn: new Date('2017-07-19'),
  emberly: new Date('2019-12-21'),
  rylee: new Date('2023-06-23')
};

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

let quoteIndex = 0;
function updateQuote() {
  const quote = quotes[quoteIndex % quotes.length];
  document.getElementById("quote").textContent = `“${quote.text}”`;
  document.getElementById("quoteAuthor").textContent = `— ${quote.author}`;
  speak(quote.text);
  quoteIndex++;
}
setInterval(updateQuote, 5 * 60 * 1000);
updateQuote();

function calculateDaysLeft(birthday) {
  const end = new Date(birthday);
  end.setFullYear(end.getFullYear() + lifespanYears);
  const now = new Date();
  return Math.max(0, Math.floor((end - now) / (1000 * 60 * 60 * 24)));
}

function updateDisplay() {
  const now = new Date();
  const joshDays = calculateDaysLeft(birthdates.josh);
  document.getElementById("daysLeft").textContent = joshDays.toLocaleString();
  const percent = 100 - (joshDays / (lifespanYears * 365.25)) * 100;
  document.getElementById("percent").textContent = `${percent.toFixed(2)}% of life completed`;
  document.getElementById("timeRemaining").textContent =
    `${String(23 - now.getHours()).padStart(2, '0')}:${String(59 - now.getMinutes()).padStart(2, '0')}:${String(59 - now.getSeconds()).padStart(2, '0')}`;
  document.getElementById("localTime").textContent =
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const families = ["tiffanie", "jocelynn", "emberly", "rylee"];
  let html = "";
  for (const name of families) {
    const daysLeft = calculateDaysLeft(birthdates[name]);
    html += `${name.charAt(0).toUpperCase() + name.slice(1)}: ${daysLeft} days left<br>`;
  }
  document.getElementById("familyCountdowns").innerHTML = html;
}
setInterval(updateDisplay, 1000);
updateDisplay();
