import { useEffect, useState } from 'react'
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

const WeatherDetails = ({icon , temp, city, country, lat, long, humidity, wind, message}) => {

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

const search = async () => {

  setLoading(true);
 let url =`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

try{

  let res = await fetch(url);
  let data = await res.json();
    //  console.log(data);

  if(data.cod === "404") {
    console.error("City not found");
    setCityNotFound(true);
    setLoading(false);
    return;
  }
   
  setHumidity(data.main.humidity);
  setWind(data.wind.speed);
  setTemp(Math.floor(data.main.temp));
  setCity(data.name);
  setCountry(data.sys.country);
  setLat(data.coord.lat);
  setLong(data.coord.lon);
  const weatherIcon =data.weather[0].icon;
  setIcon(weatherIconMap[weatherIcon] || sunIcon);
  setCityNotFound(false);

   
  let message = "";

if (weatherIcon === "09d" ||weatherIcon === "09n" || weatherIcon ==="10d" || weatherIcon === "10n"){
  message = "Take an umbrella ☔";
} else if (weatherIcon === "13d"  || weatherIcon === "13n" ) {
  message = "It's snowing ❄️ Stay warm!";
} else if (weatherIcon === "01d"|| weatherIcon === "01n" ) {
  message = "It's sunny outside ☀️";
} else if (weatherIcon === "02d" || weatherIcon === "02n" ) {
  message = "It's cloudy today ☁️";
} else if (weatherIcon === "03d" || weatherIcon === "03n" || weatherIcon === "04d" || weatherIcon === "04n" ) {
  message = "Light drizzle outside ☔ ";
} else {
  message = "Have a great day!";
}

setMessage(message);


} catch(error){

  console.error("An error occured :", error.message);
  setError(" An error occurred while fetching weather data.");

} finally{

  setLoading(false);
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
        <div className='search-icon' onClick={search}>
          <img src={searchIcon} alt="search" className="bg-img" />
        </div>
       </div>
       </div>
       
         {!loading && !cityNotFound && <WeatherDetails  icon={icon} temp={temp} city={city}  country={country} message={message} lat={lat} long={long}
          humidity={humidity}  wind={wind} />}

       {loading && <div className='loading-msg'>Loading...</div>}
        {error && <div className='error-msg'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>City not found</div>}
       
          <p className='copyright'>Designed by <span>Jasmine</span></p>
       
      </div>
    </>
  );
};

export default App ;


