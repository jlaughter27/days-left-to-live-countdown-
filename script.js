// Main application logic for Live Transformed Countdown PWA
// Calculates days left to live, updates time remaining in the current day,
// displays family members' days left, rotates motivational quotes and
// Bible verses, and uses text‑to‑speech to speak the quote every five minutes.

// User's birth date and assumed lifespan (in years)
const USER_BIRTH_DATE = new Date('1993-03-29T00:00:00');
const LIFESPAN_YEARS = 80;
// Millisecond constants for conversions
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

// Define family members and their birthdays. These values are used to
// calculate each person's days remaining given the same lifespan as
// the main user. Feel free to modify or extend this list.
const FAMILY = {
  Tiffanie: new Date('1995-03-04T00:00:00'),
  Jocelynn: new Date('2017-07-19T00:00:00'),
  Emberly: new Date('2019-12-21T00:00:00'),
  Rylee: new Date('2023-06-23T00:00:00'),
};

// A curated list of at least 50 motivational quotes and Bible verses. Each
// entry has a `text` property and an `author` for attribution. Quotes
// repeat in order when the list is exhausted.
const QUOTES = [
  { text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.', author: 'John 3:16' },
  { text: 'I can do all things through Christ who strengthens me.', author: 'Philippians 4:13' },
  { text: 'Trust in the Lord with all your heart and lean not on your own understanding.', author: 'Proverbs 3:5' },
  { text: 'In all your ways acknowledge Him, and He will make straight your paths.', author: 'Proverbs 3:6' },
  { text: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me.', author: 'Psalm 23:4' },
  { text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you a hope and a future.', author: 'Jeremiah 29:11' },
  { text: 'Be strong and courageous. Do not be afraid; do not be discouraged.', author: 'Joshua 1:9' },
  { text: 'You are the light of the world. A town built on a hill cannot be hidden.', author: 'Matthew 5:14' },
  { text: 'Do to others as you would have them do to you.', author: 'Luke 6:31' },
  { text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.', author: '1 Corinthians 13:4' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' },
  { text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' },
  { text: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu' },
  { text: 'Whether you think you can or you think you can\'t, you\'re right.', author: 'Henry Ford' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Everything you’ve ever wanted is on the other side of fear.', author: 'George Addair' },
  { text: 'Our greatest glory is not in never falling, but in rising every time we fall.', author: 'Confucius' },
  { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
  { text: 'Hardships often prepare ordinary people for an extraordinary destiny.', author: 'C.S. Lewis' },
  { text: 'Today I will do what others won’t, so tomorrow I can do what others can’t.', author: 'Jerry Rice' },
  { text: 'You miss 100% of the shots you don\'t take.', author: 'Wayne Gretzky' },
  { text: 'The pain you feel today will be the strength you feel tomorrow.', author: 'Unknown' },
  { text: 'Discipline equals freedom.', author: 'Jocko Willink' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
  { text: 'Don’t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
  { text: 'Do not pray for an easy life, pray for the strength to endure a difficult one.', author: 'Bruce Lee' },
  { text: 'The most effective way to do it, is to do it.', author: 'Amelia Earhart' },
  { text: 'What we think, we become.', author: 'Buddha' },
  { text: 'If you want to change the world, start off by making your bed.', author: 'William H. McRaven' },
  { text: 'Don’t count the days, make the days count.', author: 'Muhammad Ali' },
  { text: 'Success usually comes to those who are too busy to be looking for it.', author: 'Henry David Thoreau' },
  { text: 'The Lord is my shepherd; I shall not want.', author: 'Psalm 23:1' },
  { text: 'Rejoice always, pray without ceasing, give thanks in all circumstances.', author: '1 Thessalonians 5:16-18' },
  { text: 'Cast all your anxiety on him because he cares for you.', author: '1 Peter 5:7' },
  { text: 'Seek first his kingdom and his righteousness, and all these things will be given to you as well.', author: 'Matthew 6:33' },
  { text: 'Whatever you do, work at it with all your heart, as working for the Lord.', author: 'Colossians 3:23' },
  { text: 'Let all that you do be done in love.', author: '1 Corinthians 16:14' },
  { text: 'Blessed are the peacemakers, for they shall be called children of God.', author: 'Matthew 5:9' },
  { text: 'He gives power to the faint, and to him who has no might he increases strength.', author: 'Isaiah 40:29' },
  { text: 'I have fought the good fight, I have finished the race, I have kept the faith.', author: '2 Timothy 4:7' },
  { text: 'Courage is not the absence of fear, but the triumph over it.', author: 'Nelson Mandela' },
  { text: 'To live is the rarest thing in the world. Most people just exist.', author: 'Oscar Wilde' },
  { text: 'Make each day your masterpiece.', author: 'John Wooden' },
  { text: 'If you’re going through hell, keep going.', author: 'Winston Churchill' },
  { text: 'To leave the world a bit better… to know even one life has breathed easier because you have lived. This is to have succeeded.', author: 'Ralph Waldo Emerson' },
  { text: 'The Lord is my strength and my shield; my heart trusts in him.', author: 'Psalm 28:7' },
  { text: 'Be still, and know that I am God.', author: 'Psalm 46:10' },
  { text: 'For nothing will be impossible with God.', author: 'Luke 1:37' },
];

// State to track last values for pulses
let lastSecond = null;
let lastMinute = null;
let lastHour = null;
let lastDay = null;
let lastQuoteIndex = -1;

// Helper to compute days between two dates
function daysBetween(date1, date2) {
  return Math.floor((date2 - date1) / MS_PER_DAY);
}

// Update the main countdown values and UI elements. Called every second.
function updateCountdown() {
  const now = new Date();
  // Compute death date for user
  const deathDate = new Date(USER_BIRTH_DATE);
  deathDate.setFullYear(deathDate.getFullYear() + LIFESPAN_YEARS);
  // Days remaining
  const daysLeft = daysBetween(now, deathDate);
  const daysEl = document.getElementById('daysLeft');
  daysEl.textContent = daysLeft < 0 ? '0' : daysLeft.toLocaleString();
  // Detect day change for pulse
  if (daysLeft !== lastDay) {
    lastDay = daysLeft;
    daysEl.classList.add('pulse');
    setTimeout(() => daysEl.classList.remove('pulse'), 500);
  }
  // Compute time remaining in current day
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  let diffMs = endOfDay - now;
  const hours = Math.floor(diffMs / MS_PER_HOUR);
  diffMs -= hours * MS_PER_HOUR;
  const minutes = Math.floor(diffMs / MS_PER_MINUTE);
  diffMs -= minutes * MS_PER_MINUTE;
  const seconds = Math.floor(diffMs / MS_PER_SECOND);
  // Update UI
  const hrsEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');
  hrsEl.textContent = String(hours).padStart(2, '0');
  minsEl.textContent = String(minutes).padStart(2, '0');
  secsEl.textContent = String(seconds).padStart(2, '0');
  // Trigger pulses for seconds, minutes and hours when they change
  if (seconds !== lastSecond) {
    lastSecond = seconds;
    secsEl.classList.add('pulse');
    setTimeout(() => secsEl.classList.remove('pulse'), 300);
  }
  if (minutes !== lastMinute) {
    lastMinute = minutes;
    minsEl.classList.add('pulse');
    secsEl.classList.add('pulse');
    setTimeout(() => {
      minsEl.classList.remove('pulse');
      secsEl.classList.remove('pulse');
    }, 300);
  }
  if (hours !== lastHour) {
    lastHour = hours;
    hrsEl.classList.add('pulse');
    minsEl.classList.add('pulse');
    secsEl.classList.add('pulse');
    setTimeout(() => {
      hrsEl.classList.remove('pulse');
      minsEl.classList.remove('pulse');
      secsEl.classList.remove('pulse');
    }, 300);
    // New hour means show quote and speak it
    updateQuote();
  }
  // Update percent of life completed (clamped between 0 and 100)
  const totalLifeMs = LIFESPAN_YEARS * 365.25 * MS_PER_DAY;
  const elapsedMs = now - USER_BIRTH_DATE;
  let percent = (elapsedMs / totalLifeMs) * 100;
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;
  const percentEl = document.getElementById('percent');
  percentEl.textContent = `${percent.toFixed(2)}% of life completed`;
  // Update local time
  document.getElementById('clock').textContent = now.toLocaleTimeString();
  // Update family days left
  for (const name in FAMILY) {
    const dob = FAMILY[name];
    const death = new Date(dob);
    death.setFullYear(death.getFullYear() + LIFESPAN_YEARS);
    const remaining = daysBetween(now, death);
    const id = name.toLowerCase();
    const el = document.getElementById(id);
    if (el) {
      el.textContent = `${name}: ${remaining < 0 ? 0 : remaining} days left`;
    }
  }
}

// Function to update the displayed quote every five minutes and speak it
function updateQuote() {
  const now = new Date();
  // Choose a quote based on the minute index divided by 5 to rotate every five minutes
  const index = Math.floor(now.getTime() / (MS_PER_MINUTE * 5)) % QUOTES.length;
  if (index === lastQuoteIndex) return;
  lastQuoteIndex = index;
  const quote = QUOTES[index];
  const quoteEl = document.getElementById('quote');
  const authorEl = document.getElementById('author');
  quoteEl.textContent = `“${quote.text}”`;
  authorEl.textContent = quote.author ? `— ${quote.author}` : '';
  // Speak the quote using the SpeechSynthesis API if available
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(`${quote.text} ${quote.author ? '— ' + quote.author : ''}`);
    // Use a slightly slower rate for better comprehension
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  }
}

// Initial call and schedule updates every second
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  updateQuote();
  setInterval(updateCountdown, 1000);
  // Extra interval to ensure quote updates if user leaves the page open across hours
  setInterval(updateQuote, MS_PER_MINUTE * 5);
});