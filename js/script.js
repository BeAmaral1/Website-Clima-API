const apiKey = "380c2cfa733831b16b43c5d8017d28b1";
const apiCountryURL = "https://countryflagsapi.com/png/";
const apiUnsplash = "https://source.unsplash.com/1600x900/?";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const umidityElement = document.querySelector("#umidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");

const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");

const suggestionContainer = document.querySelector("#suggestions");
const suggestionButtons = document.querySelectorAll("#suggestions button");

// Loader
const toggleLoader = () => {
  loader.classList.toggle("hide");
};

const getWeatherData = async (city) => {
  toggleLoader();

  try {
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

    const res = await fetch(apiWeatherURL);
    const data = await res.json();

    toggleLoader();

    return data;
  } catch (error) {
    toggleLoader();
    showErrorMessage();
    console.error("Erro ao buscar dados do tempo:", error);
  }
};

// Tratamento de erro
const showErrorMessage = () => {
  errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
  errorMessageContainer.classList.add("hide");
  weatherContainer.classList.add("hide");

  suggestionContainer.classList.add("hide");
};

const showWeatherData = async (city) => {
  hideInformation();

  const data = await getWeatherData(city);

  if (!data || data.cod === "404") {
    showErrorMessage();
    return;
  }

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  countryElement.setAttribute("src", `https://flagcdn.com/w320/${data.sys.country.toLowerCase()}.png`);
  umidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;

  // Change bg image
  const backgroundUrl = `${apiUnsplash}${city}`;
  console.log("URL da imagem de fundo:", backgroundUrl); // Verifique a URL gerada

  // Testar se a URL retorna uma imagem antes de definir o background
  try {
    const img = new Image();
    img.src = backgroundUrl;

    img.onload = () => {
      document.body.style.backgroundImage = `url("${backgroundUrl}")`;
    };

    img.onerror = () => {
      console.error("Erro ao carregar a imagem de fundo.");
    };
  } catch (error) {
    console.error("Erro ao definir a imagem de fundo:", error);
  }

  weatherContainer.classList.remove("hide");
};

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const city = cityInput.value;

  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;

    showWeatherData(city);
  }
});

// Sugestões
if (suggestionButtons.length > 0) {
  suggestionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const city = btn.getAttribute("id");

      showWeatherData(city);
    });
  });
}
