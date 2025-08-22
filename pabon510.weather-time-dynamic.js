
(function(){
  const css = "/* Dark navy weather card styles */\n.wx-card {\n  font-family: \"Noto Sans\", system-ui, -apple-system, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\n  background: linear-gradient(to bottom right, #00244f 0%, #083468 100%);\n  border-radius: 16px;\n  color: #ffffff;\n  display: inline-block;\n  min-width: 260px;\n  max-width: 320px;\n  padding: 24px;\n}\n.wx-header {\n  margin-bottom: 12px;\n}\n.wx-city {\n  font-size: 1.25rem;\n  font-weight: 600;\n  cursor: pointer;\n}\n.wx-temp-row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 12px;\n}\n.wx-temp {\n  font-size: 3rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.wx-condition {\n  font-size: 0.875rem;\n  opacity: 0.8;\n  margin-top: 4px;\n}\n.wx-date {\n  font-size: 0.875rem;\n  opacity: 0.8;\n  margin-top: 4px;\n}\n.wx-icon {\n  width: 64px;\n  height: 64px;\n  filter: invert(1) brightness(1.2);\n}\n.wx-forecast {\n  margin-top: 12px;\n  font-size: 0.875rem;\n}\n.wx-row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 8px;\n}\n.wx-day {\n  font-weight: 600;\n}\n.wx-small {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  opacity: 0.8;\n}\n.wx-high {\n  font-weight: 600;\n}\n.wx-row svg {\n  width: 18px;\n  height: 18px;\n}\n";
  function ensureCss(){
    if (!document.getElementById('weather-time-dynamic-css')){
      const style = document.createElement('style');
      style.id = 'weather-time-dynamic-css';
      style.textContent = css;
      document.head.appendChild(style);
    }
  }
  function formatDateTime(dtString){
    const dt = new Date(dtString.replace(/-/g,'/')); // some browsers parse ISO incorrectly
    const optionsDate = { month:'short', day:'numeric' };
    const optionsTime = { hour:'numeric', minute:'2-digit' };
    const datePart = dt.toLocaleDateString('en-US', optionsDate);
    const timePart = dt.toLocaleTimeString('en-US', optionsTime);
    return {date: datePart, time: timePart};
  }
  const WeatherTimeFactory = (BaseClass, h) => {
    return class extends BaseClass {
      constructor() {
        super();
        this.container = null;
        this.city = null;
        this.apiKey = null;
      }
      getInitialCity() {
        const attrCity = this.getAttribute('city');
        if (attrCity && attrCity.trim()) return attrCity.trim();
        return 'New York';
      }
      fetchWeather(city) {
        const keyAttr = this.getAttribute('apikey');
        const apiKey = keyAttr || (typeof window !== 'undefined' ? window.weatherApiKey : '') || '';
        this.apiKey = apiKey;
        this.city = city;
        if (!apiKey) {
          console.error('Weather API key missing');
          this.renderError('Missing API key');
          return;
        }
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=4&aqi=no&alerts=no`;
        fetch(url).then(res => res.json()).then(data => {
          this.renderWeather(data);
        }).catch(err => {
          console.error(err);
          this.renderError('Failed to fetch weather data');
        });
      }
      renderError(msg) {
        ensureCss();
        if (this.container) {
          this.container.innerHTML = `<div class="wx-card"><div>${msg}</div></div>`;
        }
      }
      renderWeather(data) {
        ensureCss();
        if (!this.container) return;
        const locationName = data.location ? data.location.name : this.city;
        const localtime = data.location ? data.location.localtime : new Date().toISOString();
        const dtParts = formatDateTime(localtime);
        const current = data.current;
        const forecastList = data.forecast ? data.forecast.forecastday : [];
        const currentTempF = current ? Math.round(current.temp_f) : '';
        const condition = current && current.condition ? current.condition.text : '';
        let forecastHtml = '';
        for (let i=0; i<forecastList.length; i++) {
          const day = forecastList[i];
          const date = new Date(day.date.replace(/-/g,'/'));
          const dayName = date.toLocaleDateString('en-US', { weekday:'long' });
          const icon = day.day.condition.icon; // url to icon
          const conditionText = day.day.condition.text;
          const highF = Math.round(day.day.maxtemp_f);
          forecastHtml += `<div class="wx-row"><div class="wx-day">${dayName}</div><div class="wx-small" aria-label="${conditionText}"><img src="${icon}" alt="${conditionText}" width="18" height="18"/> ${conditionText}</div><div class="wx-high">${highF}°F</div></div>`;
        }
        // Build the card markup without date/time. We intentionally omit the wx-date element to avoid showing the date and time.
        const html = `<div class="wx-card" role="group" aria-label="Weather for ${locationName}"><div class="wx-header"><div class="wx-city">${locationName}</div></div><div class="wx-temp-row"><div><div class="wx-temp">${currentTempF}°F</div><div class="wx-condition">${condition}</div></div><img class="wx-icon" src="${current && current.condition ? current.condition.icon : ''}" alt="${condition}"/></div><div class="wx-forecast" aria-label="4 day forecast">${forecastHtml}</div></div>`;
        this.container.innerHTML = html;
        // Remove filter on large weather icon so it retains original colors.
        const bigIcon = this.container.querySelector('.wx-icon');
        if (bigIcon) bigIcon.style.filter = 'none';
        const cityDiv = this.container.querySelector('.wx-city');
        if (cityDiv) {
          cityDiv.addEventListener('click', () => {
            const newCity = prompt('Enter city name:', this.city || '');
            if (newCity && newCity.trim()) {
              this.fetchWeather(newCity.trim());
            }
          });
        }
      }
      renderBlock(el) {
        this.container = el;
        const initialCity = this.getInitialCity();
        this.fetchWeather(initialCity);
      }
    };
  };
  const blockDefinition = {
    // Use a unique block name so this custom widget doesn't collide with other
    // installed widgets that may use the default "weather-time" name. The
    // Staffbase Studio uses the block name as a key to determine whether
    // a bundle is already installed, so giving it a unique name ensures
    // it can be installed alongside others without conflict.
    name: 'andrew-weather-time',
    factory: WeatherTimeFactory,
    attributes: ['city','allowcityoverride','mobileview','usenewimages','apikey'],
    blockLevel: 'block',
    configurationSchema: {"properties": {"city": {"type": "string", "title": "City", "default": "{{user.profile.location}}"}, "allowcityoverride": {"type": "boolean", "title": "Allow city override?", "default": true}, "mobileview": {"type": "boolean", "title": "Mobile view", "default": false}, "usenewimages": {"type": "boolean", "title": "Use new images?", "default": false, "description": "Use the new weather icons instead of the old ones."}, "apikey": {"type": "string", "title": "Weather API Key", "default": "", "description": "Your weatherapi.com API key"}}, "required": ["city"]},
    uiSchema: {"city": {"ui:help": "Enter the city name, or use {{user.profile.location}} to pull from the user."}, "allowcityoverride": {"ui:help": "If checked, a small button in the widget will let the user override the city."}, "mobileview": {"ui:help": "Hide the date and time to simplify the widget for mobile."}, "usenewimages": {"ui:help": "Use the new weather icons instead of the old ones. This will be the default in the future."}, "apikey": {"ui:help": "Enter your WeatherAPI API key."}},
    // Update the label shown in Studio to reflect the custom version. This is
    // optional but helps distinguish it from other similar widgets.
    label: 'Weather Time (Andrew)',
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTE2IiBoZWlnaHQ9IjEwNTciIHZpZXdCb3g9IjAgMCA5MTYgMTA1NyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wIDM1MS42NzRDMCAxNTcuMjczIDE1Ny4wOTkgMC4xNzM1MjMgMzUxLjUgMC4xNzM1MjNDNTQ1LjkwMSAwLjE3MzUyMyA3MDMgMTU3LjI3MyA3MDMgMzUxLjY3NEM3MDMgMzY2LjI1MyA3MDIuMTE2IDM4MC42MjMgNzAwLjQgMzk0LjczMkg2NDEuNDQ5QzY0My41MyAzODAuNjc1IDY0NC42MDggMzY2LjI5NyA2NDQuNjA4IDM1MS42NzRDNjQ0LjYwOCAxOTAuMTI3IDUxMy4wNDcgNTguNTY1NiAzNTEuNSA1OC41NjU2QzE4OS45NTMgNTguNTY1NiA1OC4zOTIgMTkwLjEyNyA1OC4zOTIgMzUxLjY3NEM1OC4zOTIgNDQ1LjM3NiAxMDIuNjU0IDUyOC45OSAxNzEuMzU2IDU4Mi42OTNWNjUzLjY5OUM2OC42NTUzIDU5Mi4zOTkgMCA0ODAuMTg3IDAgMzUxLjY3NFoiIGZpbGw9IiM0NjRCNEYiLz4KPHBhdGggZD0iTTQxNy4zNTMgMzIxLjY4OEgzODEuNDg2VjE4NC4xMDFDMzgxLjQ4NiAxNjcuNjAyIDM2OCAxNTQuMTE2IDM1MS41MDEgMTU0LjExNkMzMzUuMDAyIDE1NC4xMTYgMzIxLjUxNiAxNjcuNjAyIDMyMS41MTYgMTg0LjEwMVYzNTEuNjc0QzMyMS41MTYgMzY4LjE3MyAzMzUuMDAyIDM4MS42NTkgMzUxLjUwMSAzODEuNjU5SDQxNy4zNTNDNDMzLjg1MiAzODEuNjU5IDQ0Ny4zMzggMzY4LjE3MyA0NDcuMzM4IDM1MS42NzRDNDQ3LjMzOCAzMzUuMTc1IDQzMy43MDkgMzIxLjY4OCA0MTcuMzUzIDMyMS42ODhaIiBmaWxsPSIjNDY0QjRGIi8+CjxwYXRoIGQ9Ik00NjYuMjg3IDQzMy43NkM0NjYuMjg3IDQxNi42MTkgNDgwLjE4MiA0MDIuNzI0IDQ5Ny4zMjMgNDAyLjcyNEM1MTQuNDY0IDQwMi43MjQgNTI4LjM1OSA0MTYuNjE5IDUyOC4zNTkgNDMzLjc2VjQ2NC43OTZDNTI4LjM1OSA0ODEuOTM3IDUxNC40NjQgNDk1LjgzMiA0OTcuMzIzIDQ5NS44MzJDNDgwLjE4MiA0OTUuODMyIDQ2Ni4yODcgNDgxLjkzNyA0NjYuMjg3IDQ2NC43OTZWNDMzLjc2WiIgZmlsbD0iIzQ2NEI0RiIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTYzNi42NzEgNjIxLjgzOEM2MDguMzYgNTg0LjE0MiA1NjMuMjgxIDU1OS43NTggNTEyLjUwOSA1NTkuNzU4QzQyNi44MDYgNTU5Ljc1OCAzNTcuMzI5IDYyOS4yMzUgMzU3LjMyOSA3MTQuOTM3QzM1Ny4zMjkgNzI1Ljg0IDM1OC40NTQgNzM2LjQ4MiAzNjAuNTkzIDc0Ni43NDlDMzQ5LjY0IDc1MS4xIDMzOS40ODQgNzU2LjQ2MyAzMzAuMTUyIDc2Mi43NzZDMjg5LjU3MyA3OTAuMjI0IDI2OC44NDkgODMyLjczNyAyNjQuOTIzIDg3NS43NjhDMjU3LjI3IDk1OS42NTUgMzE0LjQ3OSAxMDU2LjMzIDQyNC44OTYgMTA1Ni4zM0g3NzcuOTQ3QzgyMS40NjggMTA1Ni4zMyA4NTYuNzQ3IDEwNDIuNjcgODgxLjE3NSAxMDE4Ljc0QzkwNS40MzMgOTk0Ljk4NiA5MTYuNTQ0IDk2My40NDEgOTE1Ljk1NCA5MzIuNDcxQzkxNC45MjcgODc4LjcxMyA4NzguNzkyIDgyNi4yMzUgODE1Ljk1NiA4MTEuMDIxQzgyNC44MTQgNzMxLjM1MiA3NjkuMjQxIDY2MC44MjIgNzAxLjU4IDYzNC4wOTdDNjgxLjI1MSA2MjYuMDY3IDY1OS4yMDkgNjIxLjYxNSA2MzYuNjcxIDYyMS44MzhaTTU2Ni4wNTggNjM4Ljk2NkM1NTAuOTE5IDYyOC4yNzggNTMyLjQ0NiA2MjEuOTk5IDUxMi41MDkgNjIxLjk5OUM0NjEuMTggNjIxLjk5OSA0MTkuNTcgNjYzLjYwOSA0MTkuNTcgNzE0LjkzN0M0MTkuNTcgNzIxLjM5OCA0MjAuMjI5IDcyNy43MDUgNDIxLjQ4NCA3MzMuNzk0QzQzOC4wNjggNzMyLjgxMyA0NTUuNzg4IDczMy41MjcgNDc0LjU5NiA3MzYuMDZDNDk4LjUyMSA2ODkuMDc0IDUzMC4wNzIgNjU2Ljk4NiA1NjYuMDU4IDYzOC45NjZaTTUyMi4zNjMgNzgwLjQwN0M1NDMuNzM3IDczMC4zNCA1NzEuNTgzIDcwNC4zMzggNTk3Ljg5MiA2OTIuNTUxQzYyNC4yODUgNjgwLjcyOSA2NTIuNzU3IDY4MS41NTEgNjc4Ljc3OCA2OTEuODI5QzczMy4yMjcgNzEzLjMzNiA3NjcuNDgxIDc3MC41NSA3NDkuOTU5IDgyMy42OUM3NDIuNzI3IDg0NS42MjMgNzU4LjgxOSA4NjguMDQ5IDc4MS41MDMgODY4Ljc2QzgzMC4yOTIgODcwLjI5IDg1My4zMTQgOTAzLjM1IDg1My44OTIgOTMzLjY1NkM4NTQuMTg3IDk0OS4wNTkgODQ4LjczMyA5NjMuNjM0IDgzNy43NDQgOTc0LjM5N0M4MjYuOTIxIDk4NC45OTkgODA4LjI2OSA5OTQuMjYgNzc3Ljk0NyA5OTQuMjZINDI0Ljg5NkMzNTkuMzg0IDk5NC4yNiAzMjEuNTg4IDkzNy44NTUgMzI2LjczOCA4ODEuNDA3QzMyOS4yMTMgODU0LjI3MyAzNDEuODQzIDgyOS44MDcgMzY0LjkyOSA4MTQuMTlDMzg4LjA1NyA3OTguNTQ4IDQyNS45NjcgNzg4Ljk0OCA0ODQuMTA4IDgwMC41NjVDNDk5Ljg3NCA4MDMuNzE1IDUxNS45NzIgNzk1LjM3OSA1MjIuMzYzIDc4MC40MDdaIiBmaWxsPSIjNDY0QjRGIi8+CjxwYXRoIGQ9Ik0yMTcuOTk5IDY4Mi4wNDZDMjE3Ljk5OSA2OTkuMTg3IDIzMS44OTQgNzEzLjA4MiAyNDkuMDM1IDcxMy4wODJIMjgwLjA3MUMyOTcuMjExIDcxMy4wODIgMzExLjEwNyA2OTkuMTg3IDMxMS4xMDcgNjgyLjA0NkMzMTEuMTA3IDY2NC45MDcgMjk3LjIxMSA2NTEuMDExIDI4MC4wNzEgNjUxLjAxMUgyNDkuMDM1QzIzMS44OTQgNjUxLjAxMSAyMTcuOTk5IDY2NC45MDcgMjE3Ljk5OSA2ODIuMDQ2WiIgZmlsbD0iIzQ2NEI0RiIvPgo8cGF0aCBkPSJNMjk5LjgxMiA1MjguNDMxQzI4Ny42OTIgNTE2LjMxMSAyODcuNjkyIDQ5Ni42NiAyOTkuODEyIDQ4NC41NEMzMTEuOTMyIDQ3Mi40MTkgMzMxLjU4MyA0NzIuNDE5IDM0My43MDMgNDg0LjU0TDM2NS42NDkgNTA2LjQ4NUMzNzcuNzY5IDUxOC42MDYgMzc3Ljc2OSA1MzguMjU3IDM2NS42NDkgNTUwLjM3N0MzNTMuNTI5IDU2Mi40OTcgMzMzLjg3OCA1NjIuNDk3IDMyMS43NTggNTUwLjM3N0wyOTkuODEyIDUyOC40MzFaIiBmaWxsPSIjNDY0QjRGIi8+CjxwYXRoIGQ9Ik02MjguOTk2IDUwNi40NzhDNjE2Ljg3NiA1MTguNTk4IDYxNi44NzYgNTM4LjI1IDYyOC45OTYgNTUwLjM3QzY0MS4xMTkgNTYyLjQ5IDY2MC43NjcgNTYyLjQ5IDY3Mi44OSA1NTAuMzdMNjk0LjgzNiA1MjguNDI0QzcwNi45NTUgNTE2LjMwNCA3MDYuOTU1IDQ5Ni42NTMgNjk0LjgzNiA0ODQuNTMzQzY4Mi43MTMgNDcyLjQxMiA2NjMuMDY0IDQ3Mi40MTIgNjUwLjk0NCA0ODQuNTMzTDYyOC45OTYgNTA2LjQ3OFoiIGZpbGw9IiM0NjRCNEYiLz4KPC9zdmc+Cg=="
  };
  const externalDefinition = { blockDefinition: blockDefinition, author: '', version: '1.0.2' };
  if (window.defineBlock){
    window.defineBlock(externalDefinition);
  } else {
    // outside Staffbase, just use default city and API key from global window
    ensureCss();
    const city = 'New York';
    const apiKey = window.weatherApiKey || '';
    const container = document.createElement('div');
    document.body.appendChild(container);
    // mimic widget instance
    const widget = new (class {
      constructor() { this.container = container; }
      fetchWeather(city) {
        if (!apiKey) { container.innerHTML = '<div class="wx-card">Missing API key</div>'; return; }
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=4&aqi=no&alerts=no`;
        fetch(url).then(res => res.json()).then(data => {
          const currentTempF = Math.round(data.current.temp_f);
          const condition = data.current.condition.text;
          const localtime = data.location.localtime;
          const dtParts = formatDateTime(localtime);
          let forecastHtml = '';
          data.forecast.forecastday.forEach(day => {
            const date = new Date(day.date.replace(/-/g,'/'));
            const dayName = date.toLocaleDateString('en-US', { weekday:'long' });
            const highF = Math.round(day.day.maxtemp_f);
            forecastHtml += `<div class=\"wx-row\"><div class=\"wx-day\">${dayName}</div><div class=\"wx-small\"><img src=\"${day.day.condition.icon}\" alt=\"${day.day.condition.text}\" width=\"18\" height=\"18\"/> ${day.day.condition.text}</div><div class=\"wx-high\">${highF}°F</div></div>`;
          });
          // Build fallback markup without date/time. Omit the wx-date element entirely to avoid showing the date and time.
          container.innerHTML = `<div class=\"wx-card\"><div class=\"wx-header\"><div class=\"wx-city\">${data.location.name}</div></div><div class=\"wx-temp-row\"><div><div class=\"wx-temp\">${currentTempF}°F</div><div class=\"wx-condition\">${condition}</div></div><img class=\"wx-icon\" src=\"${data.current.condition.icon}\" alt=\"${condition}\"/></div><div class=\"wx-forecast\">${forecastHtml}</div></div>`;
          // Remove filter on the large icon for fallback rendering.
          const iconEl = container.querySelector('.wx-icon');
          if (iconEl) iconEl.style.filter = 'none';
        }).catch(err => { container.innerHTML = '<div class="wx-card">Error</div>'; });
      }
    })();
    widget.fetchWeather(city);
  }
})();
