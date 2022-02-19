(function () {
  // HEADER SCROLL
  const headerImage = document.querySelector('[data-scroll-image]');
  const headerMenu = document.querySelector('[data-scroll-menu]');
  const header = document.querySelector('[data-scroll-header]');

  // API
  const city = document.querySelector('[data-city]');
  const temp = document.querySelector('[data-temp]');
  const info = document.querySelector('[data-info]');

  const img = document.querySelector('[data-img]');
  const high = document.querySelector('[data-high]');
  const low = document.querySelector('[data-low]');

  const imgTomorrow = document.querySelector('[data-img-tomorrow]');
  const highTomorrow = document.querySelector('[data-high-tomorrow]');
  const lowTomorrow = document.querySelector('[data-low-tomorrow]');

  const imgDayafter = document.querySelector('[data-img-dayafter]');
  const highDayafter = document.querySelector('[data-high-dayafter]');
  const lowDayafter = document.querySelector('[data-low-dayafter]');

  const wind = document.querySelector('[data-wind]');
  const humidity = document.querySelector('[data-humidity]');
  const localtime = document.querySelector('[data-localtime]');

  const api_key = '7bc4008c593841fd8c883952222401';

  // TIME
  const options = { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };

  // OVERLAY
  const menuBtn = document.querySelector('[data-btn]');
  const overlay = document.querySelector('[data-overlay]');
  const veil = document.querySelector('[data-veil]');
  const closeOverlay = document.querySelector('[data-overlay-close]');
  let showMenu = false;

  const arrow = document.querySelectorAll('[data-arrow]');
  const selected = document.querySelectorAll('[data-select]');
  const sub = document.querySelector('[data-submit]');
  const dropdownSelect = document.querySelectorAll('[data-dropdown-select]');

  const mapPinpoint = document.querySelectorAll('[data-locations]');
  const mapTemp = document.querySelectorAll('[data-cels]');

  // HEADER WEATHER
  const iconPrefix = document.querySelector('[data-icon-prefix]');
  const iconCity = document.querySelector('[data-icon-city]');
  const iconImg = document.querySelector('[data-icon-img]');
  const iconCels = document.querySelector('[data-icon-celsius]');

  // FETCH function
  const start = async (town) => {
    if (town === undefined) {
      town = 'Belgrade';
    }
    try {
      const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${town}&days=3&lang=sr`);
      const data = await res.json();

      const { location, current, forecast } = data;

      city.innerHTML = location.name;
      // Convert to readable date and time
      const date = new Date(location.localtime);
      localtime.innerHTML = date.toLocaleDateString('sr-Latn', options);

      getCurrent(current);
      getForecast(forecast);

    } catch (error) {
      console.error(error);
    }
  }
  // ICON WEATHER CHANGE
  const arrTown = ["Belgrade", "Niš", "Novi Sad"];
  const arrPrefix = ["BG", "NI", "NS"];
  let i = 0;

  const iconChange = async () => {

    try {
      const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${arrTown[i]}&days=3&lang=sr`);
      const data = await res.json();

      const { location, current } = data;

      iconPrefix.innerHTML = arrPrefix[i];
      iconCity.innerHTML = location.name;
      iconImg.src = current.condition.icon;
      iconCels.innerHTML = Math.floor(current.temp_c) + "&deg;";

      i++;
      if (i === 3) {
        i = 0;
      }


    } catch (error) {
      console.error(error);
    }
  };

  // CURRENT WEATHER
  const getCurrent = (current) => {
    temp.innerHTML = Math.floor(current.temp_c) + "&deg;";
    info.innerHTML = current.condition.text;
    wind.innerHTML = current.wind_mph + '&nbsp;m/s';
    humidity.innerHTML = current.humidity + '&#37;';
    img.src = current.condition.icon;
  };

  // GET FORECAST FOR N days
  const getForecast = (forecast) => {
    high.innerHTML = Math.floor(forecast.forecastday[0].day.maxtemp_c) + "&deg;";
    low.innerHTML = Math.floor(forecast.forecastday[0].day.mintemp_c) + "&deg;";

    imgTomorrow.src = forecast.forecastday[1].day.condition.icon;
    highTomorrow.innerHTML = Math.floor(forecast.forecastday[1].day.maxtemp_c) + "&deg;";
    lowTomorrow.innerHTML = Math.floor(forecast.forecastday[1].day.mintemp_c) + "&deg;";

    imgDayafter.src = forecast.forecastday[2].day.condition.icon;
    highDayafter.innerHTML = Math.floor(forecast.forecastday[2].day.maxtemp_c) + "&deg;";
    lowDayafter.innerHTML = Math.floor(forecast.forecastday[2].day.mintemp_c) + "&deg;";
  };

  // GET MAP DATA
  const mapData = async (mapTown) => {
    try {
      const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${mapTown}&days=3&lang=sr`);
      const data = await res.json();

      const { location, current } = data;

      Object.values(mapPinpoint).map(pinpoint => {
        if (pinpoint.dataset.locations === mapTown) {
          pinpoint.innerHTML = location.name;
        }
      });

      Object.values(mapTemp).map(temp => {
        if (mapTown === temp.dataset.cels) {
          temp.innerHTML = Math.floor(current.temp_c) + "&deg;";
        }
      });

    } catch (error) {
      console.error(error);
    }
  }

  mapPinpoint.forEach(pinpoint => {
    const getMapTown = pinpoint.dataset.locations;
    mapData(getMapTown);
  });

  // TOGGLE OVERLAY
  const toggleMenu = () => {
    if (!showMenu) {

      overlay.classList.add('open');
      veil.classList.add('open');
      showMenu = true;

    } else {

      overlay.classList.remove('open');
      veil.classList.remove('open');
      showMenu = false;

    }
  }

  menuBtn.addEventListener('click', toggleMenu);
  closeOverlay.addEventListener('click', toggleMenu);

  // OVERLAY SELECT ARROW
  const changeArrow = (e) => {
    e.stopPropagation();
    const selectedDrop = e.target.getAttribute('data-select');
    arrow.forEach(element => {
      if (selectedDrop === element.dataset.arrow) {
        element.classList.toggle('active');
      } else {
        element.classList.remove('active');
      }
    });
  }
  window.addEventListener('click', (e) => { changeArrow(e) });

  // OVERLAY BUTTON
  veil.addEventListener('click', (e) => {
    const getClicked = e.target.getAttribute('data-select');
    if (getClicked) {
      sub.addEventListener('click', () => {
        overlay.classList.remove('open');
        veil.classList.remove('open');
        showMenu = false;
        const selectedValue = e.target.value;
        selectedValue === '' ? start('Belgrade') : start(selectedValue);
      });
    }
  });

  // ON DROPDOWN 
  dropdownSelect.forEach(drop => {
    drop.addEventListener('change', () => {
      const val = drop.options[drop.selectedIndex].value;
      (val === '') ? start('Belgrade') : start(val);
    });
  });


  // CHANGE HEADER ON SCROLL
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 0) {
      headerImage.classList.add('logo-wrapp-img--scroll');
      headerMenu.classList.add('header-menu--scroll');
      header.classList.add('header--scroll');
    } else {
      headerImage.classList.remove('logo-wrapp-img--scroll');
      headerMenu.classList.remove('header-menu--scroll');
      header.classList.remove('header--scroll');
    }
  })

  iconChange();
  setInterval(iconChange, 5000);
  start();
}());