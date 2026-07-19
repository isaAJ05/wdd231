const currentTemp = document.querySelector("#current-temp");
const weatherIcon = document.querySelector("#weather-icon"); 
const captionDesc = document.querySelector("#current-desc");

const myKey = "6c5aa4ac22c2ca89e974d989956ba6dc";
const myLat = "10.96854";
const myLong = "-74.78132";
const url2 = `https://api.openweathermap.org/data/2.5/weather/?lat=${myLat}&lon=${myLong}&units=metric&lang=en&appid=${myKey}`;
async function apiFetch() {
  try {
    const response = await fetch(url2);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // testing only
      displayResults(data); 
    } else {
        throw Error(await response.text());
    }
  } catch (error) {
      console.log(error);
  }
}
apiFetch();

function displayResults(data) {
  currentTemp.innerHTML = `${data.main.temp}&deg;C`;
  const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  let desc = data.weather[0].description;
  weatherIcon.setAttribute('src', iconsrc);
  weatherIcon.setAttribute('alt', desc);
  captionDesc.innerHTML = `${desc}`;
}