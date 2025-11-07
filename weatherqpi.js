const apiUrl="https://api.openweathermap.org/data/2.5/weather?q=suwon&appid=f55c09d0b1408ce92879c593b5d914ea"

async function getweather() {
    const response = await fetch(apiUrl)

    const data = await response.json();

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: {speed}
    } = data

    console.log(country)
    console.log(temp)
    console.log(humidity)
    console.log(id)
    console.log(main)
    console.log(speed)
    console.log(data)

}

getweather()