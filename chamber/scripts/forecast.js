const forecastContainer = document.querySelector("#forecast");
const forecastHours = "24"; // 24hours
const url3 = `https://api.openweathermap.org/data/2.5/forecast?lat=${myLat}&lon=${myLong}&units=metric&cnt=${forecastHours}&appid=${myKey}`;

async function apiFetch() {
  try {
    const response = await fetch(url3);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // testing only
      displayForecast(data)
    } else {
        throw Error(await response.text());
    }
  } catch (error) {
      console.log(error);
  }
}
apiFetch();

function displayForecast(data) {

    const today = new Date().toDateString();
    const days = [];

    data.list.forEach(item => {
        const date = new Date(item.dt_txt).toDateString();

        if (!days.some(day => day.date === date)) {
            days.push({
                date,
                forecast: item
            });
        }
    });

    const forecast = days.slice(0, 4);

    forecast.forEach((day, index) => {
        const dayof = day.forecast;

        const card = document.createElement("div");
        const date = document.createElement("h3");
        const icon = document.createElement("img");
        const temp = document.createElement("p");
        const description = document.createElement("p");

        const forecastDate = new Date(dayof.dt_txt);

        if (index === 0 && day.date === today) {
            date.textContent = "Today";
        } else {
            date.textContent = forecastDate.toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short"
            });
        }

        icon.src = `https://openweathermap.org/img/wn/${dayof.weather[0].icon}@2x.png`;
        icon.alt = dayof.weather[0].description;

        temp.textContent = `${Math.round(dayof.main.temp)} °C`;
        description.textContent = dayof.weather[0].description;

        card.append(date, icon, temp, description);
        forecastContainer.appendChild(card);
    });
}