const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=suwon&appid=f55c09d0b1408ce92879c593b5d914ea&units=metric&lang=kr";

async function getweather() {
    const response = await fetch(apiUrl)

    const data = await response.json();

    console.log(data);

    const {
        name: country, // 도시 위치 이름
        main: { temp, humidity }, // 기온(절대 온도), 습도
        weather: [{ id, main }], // 날씨 상태, 구름
        wind: {speed} // 풍속
    } = data

        document.getElementById("city").textContent = `도시: ${country}`;
        document.getElementById("temperature").textContent = `온도: ${temp}°C`;
        document.getElementById("humidity").textContent = `습도: ${humidity}%`;
        document.getElementById("weather-main").textContent = `날씨 상태: ${id}`;
        document.getElementById("wind-speed").textContent = `풍속: ${speed} m/s`;

}
getweather()