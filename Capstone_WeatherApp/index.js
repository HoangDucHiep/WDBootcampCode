import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import geoip from "geoip-lite";

const app = express();
const port = 3000;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);

    let lat, lon;

    if (geo && geo.ll) {
        [lat, lon] = geo.ll;
        console.log(lat, lon);
    } else {
        // Default to a specific location (e.g., New York City)
        [lat, lon] = [20.4463, 106.3366];
    }

    try {
        const location = await axios.get(`https://us1.locationiq.com/v1/reverse?key=pk.2251dba5b86f98988006c1670f0d3fab&lat=${lat}&lon=${lon}&format=json`);
        const city = removeVietnameseTones(location.data.address.city);
        const weatherData = await getWeather(city);

        res.render("index.ejs", { weatherData: weatherData, isDaytime: isDaytime(weatherData.location.localtime)});
    } catch (error) {
        console.error('Error:', error);
        res.render("index.ejs", { weatherData: null });
    }
});


app.post("/search", async (req, res) => {
    const city = req.body.search;
    const weatherData = await getWeather(city);
    console.log(weatherData);
    console.log(isDaytime(weatherData.location.localtime));
    res.render("index.ejs", { weatherData: weatherData, isDaytime: isDaytime(weatherData.location.localtime)});
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

/* helper function */

async function getWeather(city) {
    const path = `http://api.weatherapi.com/v1/forecast.json?key=164343e69daa4bfd97c80131241707&q=${city}&days=7`;
    try {
        const response = await axios.get(path);
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(
        /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
        " "
    );
    return str;
}

function isDaytime(timeString) {
    // Chuyển đổi chuỗi thành đối tượng Date
    const time = new Date(timeString);

    // Lấy giờ từ đối tượng Date
    const hour = time.getHours();
    console.log("hour: " + hour);

    // Quy ước: 6:00 sáng đến 6:00 tối là ban ngày
    return hour >= 6 && hour < 18;
}
