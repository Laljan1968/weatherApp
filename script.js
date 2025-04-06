document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "14401087a6e14a4afbe1a020969ee1aa";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
  const apiUrlByLocation = "https://api.openweathermap.org/data/2.5/weather?lat=";
  const searchInput = document.querySelector(".search input");
  const searchButton = document.querySelector(".search button");
  const locationButton = document.querySelector(".location"); // Select the location button
  const weatherImg = document.querySelector(".weatherimg");
  const cityElement = document.querySelector(".city");
  const tempElement = document.querySelector(".temp");
  const feelElement = document.querySelector(".Feel");
  const humidityElement = document.querySelector(".humidvalue");
  const windElement = document.querySelector(".windvalue");

  async function getWeatherByLocation(latitude, longitude) {
    try {
      const response = await fetch(`${apiUrlByLocation}${latitude}&lon=${longitude}&appid=${apiKey}`);
      const data = await response.json();

      if (data.cod === "404") {
        showError("Location not found");
        return;
      }

      updateWeatherUI(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      showError("Failed to fetch data. Please try again.");
    }
  }

  async function getWeather(city) {
    try {
      const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
      const data = await response.json();

      if (data.cod === "404") {
        showError("City not found");
        return;
      }

      updateWeatherUI(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      showError("Failed to fetch data. Please try again.");
    }
  }

  function updateWeatherUI(data) {
    if (cityElement) cityElement.innerText = data.name;
    if (tempElement) tempElement.innerText = Math.round(data.main.temp) + "°C";
    if (feelElement) feelElement.innerText = Math.round(data.main.feels_like) + "°C";
    if (humidityElement) humidityElement.innerText = data.main.humidity + "%";
    if (windElement) windElement.innerText = Math.round(data.wind.speed) + "km/h";

    changeWeatherImage(data.weather[0].main);
  }

  function changeWeatherImage(weatherCondition) {
    let imgSrc = "default.png";

    switch (weatherCondition) {
      case "Clouds":
        imgSrc = "clouds.png";
        break;
      case "Clear":
        imgSrc = "clear.png";
        break;
      case "Rain":
        imgSrc = "rain.png";
        break;
      case "Mist":
        imgSrc = "mist.png";
        break;
      case "Snow":
        imgSrc = "snow.png";
        break;
      default:
        imgSrc = "default.png";
    }

    if (weatherImg) weatherImg.src = imgSrc;
  }

  function showError(message) {
    if (cityElement) cityElement.innerText = message;
    if (tempElement) tempElement.innerText = '';
    if (feelElement) feelElement.innerText = '';
    if (humidityElement) humidityElement.innerText = '';
    if (windElement) windElement.innerText = '';
    if (weatherImg) weatherImg.src = "error.png";
  }

  function handleWeatherSearch() {
    const city = searchInput.value.trim();
    if (city !== "") {
      getWeather(city);
    } else {
      showError("Please enter a city name.");
    }
  }

  function handleLocationSearch() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          getWeatherByLocation(latitude, longitude);
        },
        () => {
          showError("Unable to retrieve your location.");
        }
      );
    } else {
      showError("Geolocation is not supported by this browser.");
    }
  }

  // Add event listeners only if the elements are available
  if (searchButton) {
    searchButton.addEventListener("click", handleWeatherSearch);
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        handleWeatherSearch();
      }
    });
  }

  if (locationButton) {
    locationButton.addEventListener("click", handleLocationSearch);
  } else {
    console.error("Location button not found in the DOM");
  }
});
// Add this to the end of your script.js file

// Learning Out comes From A Tutorial absed Weather App
// ### Troubleshooting and Learning Outcomes

// 1. **Verify Element Existence Before Manipulation**
//    - **Issue**: The error `Location button not found in the DOM` occurred because the script was trying to interact with a button that wasn’t present in the HTML.
//    - **Solution**: Ensure that all elements you're selecting with `querySelector` or other DOM methods exist in the HTML. Check your HTML for missing elements before trying to manipulate them.
//    - **Learning Outcome**: **DOM Verification**—always check that the elements you're interacting with exist in the DOM. This can be done by inspecting the HTML or adding conditions like `if (element)`.

// 2. **Handle DOM Readiness Properly**
//    - **Issue**: The error `Cannot read properties of null` occurred because the script was trying to manipulate DOM elements before the DOM was fully loaded.
//    - **Solution**: Use `document.addEventListener('DOMContentLoaded', function() {...})` to ensure that the script runs only after the DOM is completely loaded.
//    - **Learning Outcome**: **DOM Readiness**—scripts should either be placed at the end of the body tag or wrapped inside `DOMContentLoaded` to guarantee that all DOM elements are available before manipulating them.

// 3. **Correct API URL Construction**
//    - **Issue**: The weather API URL was built with potential issues, such as missing query parameters or incorrect appending of the API key.
//    - **Solution**: Always double-check the URL construction, and log the full URL to the console or use Postman to test the endpoint before using it in the code.
//    - **Learning Outcome**: **API Request Construction**—ensure the API URL is constructed correctly, with all necessary query parameters, and test it separately to confirm its validity.

// 4. **Attach Event Listeners Safely**
//    - **Issue**: The event listener for the location button was attached without checking if the button existed in the DOM, causing a runtime error.
//    - **Solution**: Always ensure that the element exists in the DOM before attempting to add event listeners. Use a conditional check like `if (button)` before calling `addEventListener`.
//    - **Learning Outcome**: **Safe DOM Manipulation**—before attaching event listeners, ensure the element exists. You can use `if (element)` to confirm its presence.

// 5. **Add Proper Error Handling for Geolocation**
//    - **Issue**: The geolocation feature could fail if the user denies location access or if geolocation is not supported by the browser.
//    - **Solution**: Add error handling to the geolocation call to manage scenarios where the user denies permission or the browser doesn't support geolocation.
//    - **Learning Outcome**: **Geolocation API**—always implement error handling when using features like geolocation. You should account for permission denial or unsupported browsers.

// 6. **Update the UI for Error Feedback**
//    - **Issue**: When errors occurred (e.g., city not found), the UI was not updated with meaningful messages, which left the user unsure of what went wrong.
//    - **Solution**: Create functions to dynamically update the UI with appropriate error messages, such as "City not found" or "Please enable location access."
//    - **Learning Outcome**: **UI Feedback**—always provide users with clear feedback when an error occurs. This improves the user experience and allows users to resolve issues on their own.

// 7. **Check Image Paths and Assets**
//    - **Issue**: Hardcoded image paths (e.g., `"clouds.png"`) might cause broken images if the paths were incorrect or the images were not available in the specified directory.
//    - **Solution**: Double-check the asset paths and ensure that they are correct relative to the project structure. Consider using dynamic paths if necessary.
//    - **Learning Outcome**: **Asset Management**—be mindful of relative paths and ensure that all assets (like images) are correctly linked in the project to avoid broken resources.

// ---

// ### Key Takeaways for Today:

// - **Verify Element Existence**: Before interacting with DOM elements, make sure they exist to avoid errors.
// - **Ensure Script Runs After DOM Loads**: Either place your scripts at the end of the body or use `DOMContentLoaded` to wait until the DOM is ready.
// - **Check API URLs**: Ensure that your API URLs are correctly constructed, and test them separately before integrating.
// - **Safely Attach Event Listeners**: Confirm that the elements exist before attaching event listeners to avoid runtime errors.
// - **Implement Geolocation Error Handling**: Always account for geolocation permission denial or lack of support in browsers.
// - **Provide Error Feedback in the UI**: Update the UI with meaningful error messages so users know what went wrong.
// - **Double-check Image Paths**: Ensure image paths are correct to avoid broken image links.

// ### Actionable Next Steps:
// - **Refactor your code** to use error handling for both geolocation and API calls to make the application more robust.
// - **Test API requests** in isolation using tools like Postman to confirm correct parameters before implementing them in your app.
// - **Implement better UI updates** for handling error states, such as showing error messages when the city is not found or when the user denies location access.