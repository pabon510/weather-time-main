(function() {
  // Add CSS if not already present
  var cssHref = 'https://raw.githubusercontent.com/pabon510/weather-time-main/main/dark-navy-card.css';
  if (!document.querySelector('link[href="' + cssHref + '"]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    document.head.appendChild(link);
  }

  // Create weather card container
  var card = document.createElement('div');
  card.className = 'wx-card';
  card.setAttribute('role', 'group');
  card.setAttribute('aria-label', 'Weather for Washington, D.C.');

  //(function() {
  // Add CSS if not already present
  var cssHref = 'https://raw.githubusercontent.com/pabon510/weather-time-main/main/dark-navy-card.css';
  if (!document.querySelector('link[href="' + cssHref + '"]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    document.head.appendChild(link);
  }

  // Create weather card container
  var card = document.createElement('div');
  card.className = 'wx-card';
  card.setAttribute('role', 'group');
  card.setAttribute('aria-label', 'Weather for Washington, D.C.');

  // Build inner HTML for the card
  card.innerHTML =
    '<div class="wx-header"><div class="wx-city">Washington, D.C.</div></div>' +
    '<div class="wx-temp-row">' +
      '<div>' +
        '<div class="wx-temp">23\u00b0C</div>' +
        '<div class="wx-condition">Few clouds</div>' +
      '</div>' +
      '<img class="wx-icon" src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png" alt="Few clouds">' +
    '</div>' +
    '<div class="wx-forecast">' +
      '<div class="wx-row">' +
        '<div class="wx-day">Friday</div>' +
        '<div class="wx-small"><img src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png" alt="Cloudy" width="18" height="18"> Few clouds</div>' +
        '<div class="wx-high">31\u00b0C</div>' +
      '</div>' +
      '<div class="wx-row">' +
        '<div class="wx-day">Saturday</div>' +
        '<div class="wx-small"><img src="https://cdn-icons-png.flaticon.com/512/1163/1163642.png" alt="Cloudy" width="18" height="18"> Few clouds</div>' +
        '<div class="wx-high">32\u00b0C</div>' +
      '</div>' +
      '<div class="wx-row">' +
        '<div class="wx-day">Sunday</div>' +
        '<div class="wx-small"><img src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png" alt="Cloudy" width="18" height="18"> Few clouds</div>' +
        '<div class="wx-high">31\u00b0C</div>' +
      '</div>' +
    '</div>';

  // Insert the card into the page just before this script tag
  var scriptTag = document.currentScript;
  scriptTag.parentNode.insertBefore(card, scriptTag);
})(); Build inner HTML for the card
  card.innerHTML =
    '<div class="wx-header"><div class="wx-city">Washington, D.C.</div></div>' +
    '<div class="wx-temp-row">' +
      '<div>' +
        '<div class="wx-temp">23\u00b0C</div>' +
        '<div class="wx-condition">Few clouds</div>' +
      '</div>' +
      '<img class="wx-icon" src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png" alt="Few clouds">' +
    '</div>' +
    '<div class="wx-forecast">' +
      '<div class="wx-row">' +
        '<div class="wx-day">Friday</div>' +
        '<div class="wx-small"><img src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png" alt="Cloudy" width="18" height="18"> Few clouds</div>' +
        '<div class="wx-high">31\u00b0C</div>' +
      '</div>' +
      '<div class="wx-row">' +
        '<div class="wx-day">Saturday</div>' +
        '<div class="wx-small"><img src="https://cdn-icons-png.flaticon.com/512/1163/1163642.png" alt="Cloudy" width="18" height="18"> Few clouds</div>' +
        '<div class="wx-high">32\u00b0C</div>' +
      '</div>' +
      '<div class="wx-row">' +
        '<div class="wx-day">Sunday</div>' +
        '<div class="wx-small"><img src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png" alt="Cloudy" width="18" height="18"> Few clouds</div>' +
        '<div class="wx-high">31\u00b0C</div>' +
      '</div>' +
    '</div>';

  // Insert the card into the page just before this script tag
  var scriptTag = document.currentScript;
  scriptTag.parentNode.insertBefore(card, scriptTag);
})();
