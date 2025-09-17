import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "./App.css";

import { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("london");
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(getDate());
  const [loading, setLoading] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("metric");

  // const [dOTW, setDOTW] = useState(null);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const imperialMetricDropdown = [
    { label: "Metric", value: "metric" },
    { label: "Imperial", value: "imperial" },
  ];

  const dayOfWeek = daysOfWeek[new Date().getDay()];

  const API_KEY = "a1b5460f0eecbcb039dd74082cb0855e";

  const fetchWeatherData = async (cityName) => {
    try {
      setLoading(true);
      setError(null);

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${selectedUnit}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=${selectedUnit}`;

      console.log("Fetching:", weatherUrl, forecastUrl);

      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl),
      ]);

      const [weatherData, forecastData] = await Promise.all([
        weatherResponse.json(),
        forecastResponse.json(),
      ]);

      setWeatherData(weatherData);

      const dailyForecast = forecastData.list.filter(
        (_, index) => index % 8 === 0
      );

      setForecast(dailyForecast);
      setCity(cityName);

    } catch (error) {
      console.log(error);
      setError("Sorry, something went wrong fetching weather data.");
    } finally {
      setLoading(false);
    }
  };


  const handleUnitChange = (e) => {
    console.log("Unit changed to:", e.value);
    setSelectedUnit(e.value);
  };

  useEffect(() => {
      fetchWeatherData(city);
  }, []);


  function handleSearch(e) {
    e.preventDefault();
    fetchWeatherData(searchInput);
  }

  const getTemperatureUnit = () => {
    if (selectedUnit === "metric") {
      return "°C";
    } else if (selectedUnit === "imperial") {
      return "°F";
    }
    return "°";
  };

  function getDate() {
    const today = new Date();
    const monthName = today.toLocaleString("gb-GB", { month: "long" });
    const year = today.getFullYear();
    const date = today.getDate();
    return `${date} ${monthName}, ${year}`;
  }

  if (loading) return <div className="wrapper">Loading...</div>;

  return (
    <>
      <nav>
        <section className="flex justify-between py-5">
          <div>
            <img src="./src/assets/logo.svg" alt="Logo" loading="lazy" />
          </div>
          <div>
            <Dropdown
              value={selectedUnit}
              onChange={handleUnitChange}
              options={imperialMetricDropdown}
              optionLabel="label"
              optionValue="value"
              placeholder="Select Units"
              className="w-[150px] custom-dropdown"
            />
          </div>
        </section>
      </nav>

      <header className="flex flex-col justify-center items-center">
        <section>
          <h1 className="font-bold text-5xl text-center">
            How's the sky looking today?
          </h1>
        </section>
        <section className="p-6">
          <form onSubmit={handleSearch} className="search">
            {/* search */}
            <span className="relative">
              <i className="pi pi-search absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for a place..."
                className="bg-gray-400/25 rounded-lg ps-10 pe-4 py-2 md:w-[450px] max-w-[450px] me-4"
              />
            </span>
            <button
              type="submit"
              className="search-btn bg-indigo-500 rounded-lg px-5 py-2 text-center"
            >
              Search
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </section>
      </header>

      <main>
        <section>
          <div className="grid grid-cols-1 gap-4">
            {weatherData && weatherData.main && weatherData.weather && (
              <div className="col-span-2 bg-[url(./src/assets/bg-today-large.svg)] flex justify-between items-center px-4 py-14 rounded-2xl bg-center bg-no-repeat">
                <div>
                  <p className="font-bold text-2xl">{weatherData.name}</p>
                  <p>
                    {dayOfWeek}, {currentDate}
                  </p>
                </div>

                <div className="flex items-center">
                  <img
                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                    alt={weatherData.weather[0].description}
                  />
                  <p className="font-bold text-7xl">
                    {Math.round(weatherData.main.temp)}
                    {getTemperatureUnit()}
                  </p>
                </div>
              </div>
            )}

            {/* Hourly forcast */}
            {/* <div className="row-span-3 bg-gray-400/25 rounded-2xl px-4 pb-3 pt-5 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h2>Hourly forcast</h2>
                  <div className="card flex justify-content-center">
                    <Dropdown
                      value={dOTW}
                      onChange={(e) => setDOTW(e.value)}
                      options={daysOfWeek}
                      optionLabel="name"
                      placeholder={dayOfWeek}
                      defaultValue={dayOfWeek}
                      className="w-full md:w-14rem"
                    />
                  </div>
                </div>
                <div className="p-4 shadow-lg rounded-2xl">
                  <div className="grid grid-cols-1 gap-3 py-2">
                    {forecast.map((hour, index) => (
                      <div
                        key={index}
                        className="bg-gray-400/25 rounded-md flex justify-between items-center py-2 pe-4"
                      >
                        <div className="flex items-center">
                          <img
                            src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                            alt={hour.weather[0].description}
                            className="w-[50px]"
                          />
                          <p className="font-medium">
                            {new Date(hour.dt * 1000).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">
                            {Math.round(hour.main.temp)}°C
                          </p>
                          <p className="text-sm text-white">
                            {hour.weather[0].main}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}

            {/* Feels like, humidity ect */}
            {weatherData && weatherData.main && weatherData.weather && (
              <div className="col-span-2 mt-3">
                <div className="grid grid-cols-4 gap-5 py-2">
                  <div className="bg-gray-400/25 rounded-lg px-3 py-3 flex flex-col space-between gap-3">
                    <p className="font-light">Feels like</p>
                    <p className="text-[20px]">
                      {Math.round(weatherData.main.feels_like)}
                      {getTemperatureUnit()}
                    </p>
                  </div>
                  <div className="bg-gray-400/25 rounded-lg px-3 py-3 flex flex-col space-between gap-3">
                    <p className="font-light">Humidity</p>
                    <p className="text-[20px]">
                      {Math.round(weatherData.main.humidity)}%
                    </p>
                  </div>
                  <div className="bg-gray-400/25 rounded-lg px-3 py-3 flex flex-col space-between gap-3">
                    <p className="font-light">Wind</p>
                    <p className="text-[20px]">
                      {Math.round(weatherData.wind.speed)} mph
                    </p>
                  </div>
                  <div className="bg-gray-400/25 rounded-lg px-3 py-3 flex flex-col space-between gap-3">
                    <p className="font-light">Wind gust</p>
                    <p className="text-[20px]">
                      {(weatherData.weather.main)} mph
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Daily forcast */}
            {forecast.length > 0 && (
              <>
                <div className="col-span-2">
                  <h2 className="">Daily forcast</h2>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-5 py-2">
                    {forecast.map((day, index) => (
                      <div
                        key={index}
                        className="bg-gray-400/25 rounded-lg px-3 py-3 flex md:flex-col justify-between items-center space-between gap-3"
                      >
                        <p>
                          {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </p>
                        <img
                          src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                          alt={day.weather[0].description}
                        />
                        <div className="flex justify-between gap-2">
                          <p>
                            {Math.round(day.main.temp_min)}
                            {getTemperatureUnit()}
                          </p>
                          <p>
                            {Math.round(day.main.temp_max)}
                            {getTemperatureUnit()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
