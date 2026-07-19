const currentTemp = document.querySelector("#current-temp");
const weatherIcon = document.querySelector("#weather-icon"); 
const captionDesc = document.querySelector("figcaption"); 

const myKey = "";
const myLat = "49.7602869991973";
const myLong = "6.6462879584165";
const url = `https://api.openweathermap.org/data/2.5/weather/?lat=${myLat}&lon=${myLong}&units=metric&lang=en&appid=${myKey}`;
async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // testing only
      displayResults(data); // uncomment when ready
    } else {
        throw Error(await response.text());
    }
  } catch (error) {
      console.log(error);
  }
}
apiFetch();

function displayResults(data) {
  currentTemp.innerHTML = `${data.main.temp}&deg;F`;
  const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  let desc = data.weather[0].description;
  weatherIcon.setAttribute('src', iconsrc);
  weatherIcon.setAttribute('alt', desc);
  captionDesc.textContent = `${desc}`;
}