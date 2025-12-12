import { useEffect, useState} from 'react'
import './App.css'
import PropTypes from "prop-types";


// images
import searchIcon from "./assets/search.png";
import cloudIcon from "./assets/clouds.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/heavy-rain.png";
import snowIcon from "./assets/snow.png";
import windIcon from "./assets/wind.png";
import humidityIcon from "./assets/humidity.png";
import hotIcon from "./assets/hot.png";
import sunIcon from "./assets/sun.png";
import bgIcon from "./assets/bg-1.jpg";

const WeatherDetails = ({icon , temp, city, country, lat, long, humidity, wind, message, forecast}) => {

return(
   <>
   <div>
     <div className="image">
       <img src={icon} alt="Image"  className='icons'/>
     </div>
     <div className='main-data'>
       <div className='temp'>{temp}℃</div>
       <div className='location'>{city}</div>
       <div className='country'>{country}</div>
       <p className='message'>{message}</p>
     </div>
    
     <div className='cord'>
       <div>
         <span className='lat'>Latitude</span>
         <span>{lat}</span>
       </div>
       <div>
         <span className='long'>Longitude</span>
         <span>{long}</span>
       </div>
     </div>
  
   <div className='data-container'>
     <div className='element'>
       <img src={humidityIcon} alt="Humidity"  className='icon'/>
       <div className='data'>
         <div className='humidity-percent'>{humidity}%</div>
         <div className='text'>Humidity</div>
       </div>
      </div>
     <div className='element'>
       <img src={windIcon} alt="Wind"  className="icon"/>
       <div className='data'>
         <div className='wind-percent'>{wind} km/h</div>
         <div className='text'>Wind Speed</div>
       </div>
      </div>
    </div>
   </div>
 </>
 );
};

WeatherDetails.propTypes ={
   icon:PropTypes.string.isRequired,
    temp:PropTypes.number.isRequired,
     city:PropTypes.string.isRequired,
      country:PropTypes.string.isRequired,
      humidity:PropTypes.number.isRequired,
       lat:PropTypes.number.isRequired,
        long:PropTypes.number.isRequired,
         wind:PropTypes.number.isRequired,

};

function App() {

 let api_key = "e52eab48a792821c4a53c74a1707bfeb";
 const [text,setText] = useState ("Chennai");
  const [icon, setIcon] = useState (sunIcon);
   const [temp, setTemp] = useState (0);
    const [city, setCity] = useState ("");
    const [country, setCountry] = useState ("");
     const [lat, setLat] = useState ("0");
      const [long, setLong] = useState ("0");
       const [humidity, setHumidity] = useState ("0");
        const [wind, setWind] = useState ("0");
        const [cityNotFound, setCityNotFound] = useState (false);
        const [loading,setLoading] = useState (false);
        const [error,setError] = useState(null);
        const [message, setMessage] = useState("");
        const[forecast, setForecast] = useState([]);

       

const weatherIconMap = {

  "01d" : sunIcon,
  "01n" : sunIcon,
  "02d" : cloudIcon,
  "02n" : cloudIcon,
  "03d" : drizzleIcon,
  "03n" : drizzleIcon,
  "04d" : drizzleIcon,
  "04n" : drizzleIcon,
  "09d" : rainIcon,
  "09n" : rainIcon,
  "10d" : rainIcon,
  "10n" : rainIcon,
  "13d" : snowIcon,
  "13n" : snowIcon,

};  

/*Open Meteo Api*/ 
const search = async () => {
  try {
    setLoading(true);
    setCityNotFound(false);

    //  Get location from city name
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${text}`;
    const geoRes = await fetch(geoURL);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      setCityNotFound(true);
      setLoading(false);
      setForecast([]);
      return;
    }

    const location = geoData.results[0];

    setCity(location.name);
    setCountry(location.country);
    setLat(location.latitude);
    setLong(location.longitude);

    //  Get Current Weather
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&hourly=relativehumidity_2m,wind_speed_10m`;

    const weatherRes = await fetch(weatherURL);
    const weatherData = await weatherRes.json();

    const current = weatherData.current_weather;

    setTemp(Math.floor(current.temperature));
    setWind(current.windspeed);
    setHumidity(weatherData.hourly.relativehumidity_2m[0]);

    // Weather Message
    if (current.weathercode === 51 || current.weathercode === 61) {
      setMessage("Take an umbrella ☔");
    } else if (current.weathercode === 71) {
      setMessage("It's snowing ❄️ Stay warm!");
    } else if (current.weathercode === 0) {
      setMessage("It's sunny outside ☀️");
    } else if (current.weathercode === 2) {
      setMessage("It's cloudy today ☁️");
    } else {
      setMessage("Have a great day!");
    }

    // set icons
    if (current.weathercode === 0) setIcon(sunIcon);
    else if (current.weathercode === 2) setIcon(cloudIcon);
    else if (current.weathercode === 61) setIcon(rainIcon);
    else if (current.weathercode === 71) setIcon(snowIcon);
    else setIcon(cloudIcon);

  
    fetchForecast(location.latitude, location.longitude);

  } catch (error) {
    console.log(error);
    setError("Error fetching weather");
  } finally {
    setLoading(false);
  }
};

  // Fetch Forecast
    const fetchForecast = async (lat, long) => {
  try {
    const forecastURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

    const res = await fetch(forecastURL);
    const data = await res.json();

    const final = data.daily.time.map((date, i) => ({
      date,
      temp: Math.floor(data.daily.temperature_2m_max[i]),
      code: data.daily.weathercode[i],
    }));

    // Only 5 days
    setForecast(final.slice(0, 5));
  } catch (err) {
    console.log("Forecast error:", err);
  }
};


const handleCity = (e) =>{
  setText(e.target.value);
};
const handleKeyDown = (e) =>{
  if(e.key === "Enter"){
  search();
  }
};

useEffect(function(){
  search();
},[]);


  return (
    <>
      <div className='container'>
       <div className='input-box'>
       <div className='input-container'>
        <input type='text' className='cityInput' placeholder='Search City'onChange={handleCity} value={text} onKeyDown={handleKeyDown}/>
        <div className='search-icon'  onClick={search}>
          <img src={searchIcon} alt="search" className="bg-img" />
        </div>
       </div>

       
       </div>
       
         {!loading && !cityNotFound && <WeatherDetails  icon={icon} temp={temp} city={city}  country={country} message={message} lat={lat} long={long}
          humidity={humidity}  wind={wind}  forecast={forecast}/>}

       {loading && <div className='loading-msg'>Loading...</div>}
        {error && <div className='error-msg'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>City not found</div>}

        {forecast.length > 0 && ( <h5 className='fc-heading'>See Five Days Forecast</h5>)}

        <div className='forecast-container'>
          
          {forecast.map((day, index) => (
          <div key={index} className="forecast-card">
           
            <h5>{new Date(day.date).toLocaleDateString()}</h5>

            <img src={
               day.code === 0 ? sunIcon :
               day.code === 2 ? cloudIcon :
               day.code === 61 ? rainIcon :
               day.code === 71 ? snowIcon :
              cloudIcon
             }/>

           <p className='forecast-temp'>{day.temp}°C</p>
          
         </div>
        ))}
      
     </div>
       
          <p className='copyright'>Designed by <span>Jasmine</span></p>
       
    </div>
    
    </>
  );
};

export default App ;


