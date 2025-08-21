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

  // Define custom element class
  class WeatherCard extends HTMLElement {
    connectedCallback() {
      ensureCss();
      // Build the card markup
      this.innerHTML = ''
        + '<div class="wx-card">'
        + '<div class="wx-header"><div class="wx-city">Washington, D.C.</div></div>'
        + '<div class="wx-temp-row">'
        + '<div><div class="wx-temp">23\u00b0C</div><div class="wx-condition">Few clouds</div></div>'
        + '<img class="wx-icon" src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png" alt="Few clouds">'
        + '</div>'
        + '<div class="wx-forecast">'
        + '<div class="wx-row"><div class="wx-day">Friday</div><div class="wx-small"><img src="https://cdn-icons-png.flaticon.com/512/1163/1163634.png" alt="Few clouds" width="18" height="18">Few clouds</div><div class="wx-high">31\u00b0C</div></div>'
        + '<div class="wx-row"><div class="wx-day">Saturday</div><div class="wx-small"><img src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png" alt="Few clouds" width="18" height="18">Few clouds</div><div class="wx-high">30\u00b0C</div></div>'
        + '<div class="wx-row"><div class="wx-day">Sunday</div><div class="wx-small"><img src="https://cdn-icons-png.flaticon.com/512/1163/1163623.png" alt="Few clouds" width="18" height="18">Few clouds</div><div class="wx-high">29\u00b0C</div></div>'
        + '</div>'
        + '</div>';
    }
  }

  // Register custom element if not already defined
  if (!customElements.get('weather-card')) {
    customElements.define('weather-card', WeatherCard);
  }

  // Factory function used by Staffbase to mount the widget
  function factory(el) {
    var card = document.createElement('weather-card');
    el.appendChild(card);
  }

  // Define the block definition used by Staffbase
  var blockDefinition = {
    name: 'weather-card',
    factory: function(context) {
      return factory;
    },
    attributes: {}
  };

  // Define the external block definition with metadata
  var externalBlockDefinition = {
    name: 'Weather Card',
    translations: {
      en: {
        title: 'Weather Card',
        description: 'Displays a static weather card with forecast.'
      }
    },
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/869/869869.png'
  };

  if (window.defineBlock) {
    window.defineBlock(blockDefinition, externalBlockDefinition);
  } else {
    // Render automatically if not in Staffbase environment
    var container = document.currentScript && document.currentScript.parentElement ? document.currentScript.parentElement : document.body;
    factory(container);
  }
})();
