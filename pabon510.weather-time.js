(function() {
  // Ensure CSS is loaded once
  var cssHref = 'https://raw.githubusercontent.com/pabon510/weather-time-main/main/dark-navy-card.css';
  function ensureCss() {
    if (!document.querySelector('link[href="' + cssHref + '"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssHref;
      document.head.appendChild(link);
    }
  }

  // Define a custom element for the weather widget
  class WeatherTime extends HTMLElement {
    connectedCallback() {
      ensureCss();
      // Set static markup for demo; in a real widget, dynamic data would be injected here
      this.innerHTML =
        '<div class="wx-card">'
        + '<div class="wx-header"><div class="wx-city">Washington, D.C.</div></div>'
        + '<div class="wx-temp-row">'
        +   '<div>'
        +     '<div class="wx-temp">23\u00b0C</div>'
        +     '<div class="wx-condition">Few clouds</div>'
        +   '</div>'
        +   '<img class="wx-icon" src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png" alt="Few clouds">'
        + '</div>'
        + '<div class="wx-forecast">'
        +   '<div class="wx-row"><div class="wx-day">Friday</div><div class="wx-small"><img src="https://cdn-icons-png.flaticon.com/512/1163/1163661.png" alt="Few clouds" width="18" height="18">Few clouds</div><div class="wx-high">31\u00b0C</div></div>'
        +   '<div class="wx-row"><div class="wx-day">Saturday</div><div class="wx-small"><img src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png" alt="Few clouds" width="18" height="18">Few clouds</div><div class="wx-high">30\u00b0C</div></div>'
        +   '<div class="wx-row"><div class="wx-day">Sunday</div><div class="wx-small"><img src="https://cdn-icons-png.flaticon.com/512/1163/1163661.png" alt="Few clouds" width="18" height="18">Few clouds</div><div class="wx-high">22\u00b0C</div></div>'
        + '</div>'
        + '</div>';
    }
  }

  // Register the custom element if not already defined
  if (!customElements.get('weather-time')) {
    customElements.define('weather-time', WeatherTime);
  }

  // Factory function used by Staffbase to instantiate the widget
  function factory(context) {
    var card = document.createElement('weather-time');
    return card;
  }

  // Define the block definition according to Staffbase specification
  var blockDefinition = {
    name: 'weather-time',
    factory: factory,
    attributes: [],
    label: 'Weather Time',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/869/869869.png'
  };

  // External block definition with metadata
  var externalBlockDefinition = {
    blockDefinition: blockDefinition,
    author: 'pabon510',
    version: '1.0.1'
  };

  // Register the widget with Staffbase when loaded on the platform
  if (window.defineBlock) {
    window.defineBlock(externalBlockDefinition);
  } else {
    // If not in Staffbase, automatically insert into the page for demo purposes
    var container = document.currentScript && document.currentScript.parentElement ? document.currentScript.parentElement : document.body;
    container.appendChild(factory());
  }
})();
