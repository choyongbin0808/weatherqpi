const API_KEY = "f55c09d0b1408ce92879c593b5d914ea";

document.getElementById("searchicon").addEventListener("click", async function (e) {
    e.preventDefault();

    const cityInput = document.getElementById("searchip").value.trim();
    if (!cityInput) {
        alert("도시 이름을 입력해주세요!");
        return;
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${API_KEY}&units=metric&lang=kr`;
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error("도시 정보를 불러올 수 없습니다.");
    const weatherData = await weatherRes.json();

    const {
        name: country,
        coord: { lat, lon },
        main: { temp, humidity },
        weather: [{ id }],
        wind: { speed },
        sys: { sunrise, sunset }
    } = weatherData;

    const formatTime = t => {
        const d = new Date(t * 1000);
        return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    };

    let weatherText = "";
    if (id >= 200 && id < 300) weatherText = "천둥번개";
    else if (id >= 300 && id < 600) weatherText = "비";
    else if (id >= 600 && id < 700) weatherText = "눈";
    else if (id >= 700 && id < 800) weatherText = "안개";
    else if (id === 800) weatherText = "맑음";
    else if (id > 800) weatherText = "구름 많음";

    document.getElementById("city").textContent = country;
    document.getElementById("temperature").textContent = `${Math.round(temp)}°`;
    document.getElementById("weather-main").textContent = weatherText;
    document.getElementById("humidity").textContent = `습도 : ${humidity}%`;
    document.getElementById("wind-speed").textContent = `풍속 : ${Math.round(speed)} m/s`;
    document.getElementById("sunrise").innerHTML = `<i class="fa-solid fa-sun" style="color: #fff; font-size: 40px;"></i><br>일출: ${formatTime(sunrise)}`;
    document.getElementById("sunset").innerHTML = `<i class="fa-solid fa-moon" style="color: #fff; font-size: 40px;"></i><br>일몰: ${formatTime(sunset)}`;

    document.querySelector(".subcon").style.display = "none";
    document.querySelector(".container").style.display = "block";

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    const next24Hours = forecastData.list.slice(0, 8);
    document.getElementById("hourlyContainer").innerHTML = next24Hours.map(item => {
        const t = new Date(item.dt * 1000);
        return `
            <div class="hour-item">
                <span class="hour-time">${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}</span>
                <span class="hour-temp">${Math.round(item.main.temp)}°</span>
            </div>
        `;
    }).join("");

    const today = new Date();
    const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const todayIndex = today.getDay();
    const dailyList = [];
    const seenDates = new Set();

    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.getDate();
        if (date.getHours() === 12 && !seenDates.has(day)) {
            seenDates.add(day);
            dailyList.push({
                date,
                temp_min: Math.round(item.main.temp_min),
                temp_max: Math.round(item.main.temp_max),
                weatherId: item.weather[0].id
            });
        }
    });

    const getWeatherIconAndLevel = id => {
        if (id >= 200 && id < 300) return { icon: "⛈️", level: "3레벨" };
        if (id >= 300 && id < 600) return { icon: "🌧️", level: "2레벨" };
        if (id >= 600 && id < 700) return { icon: "❄️", level: "2레벨" };
        if (id >= 700 && id < 800) return { icon: "🌫️", level: "1레벨" };
        if (id === 800) return { icon: "☀️", level: "1레벨" };
        if (id > 800) return { icon: "☁️", level: "2레벨" };
        return { icon: "🌈", level: "1레벨" };
    };

    const next5Days = dailyList.slice(0, 5);
    document.getElementById("dailyContainer").innerHTML = next5Days.map((item, i) => {
        const dayName = dayNames[(todayIndex + i) % 7];
        const { icon, level } = getWeatherIconAndLevel(item.weatherId);
        return `
            <div class="daily-item">
                <span class="daily-day">${dayName}</span>
                <span class="daily-icon">${icon}</span>
                <span class="daily-level">${level}</span>
                <span class="daily-temp">${item.temp_min}° / ${item.temp_max}°</span>
            </div>
        `;
    }).join("");
});
