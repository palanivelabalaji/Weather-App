import './App.css'
import { useEffect, useState } from 'react'
import sunnyIcon from "./assets/clear sunny.png"
import cloudIcon from "./assets/clouds.png"
import drizzleIcon from "./assets/drizzle.png"
import humidityIcon from "./assets/humidity.png"
import rainIcon from "./assets/rain.png"
import snowIcon from "./assets/snow.png"
import windyIcon from "./assets/windy.png"
import searchIcon from "./assets/search.png"
import PropTypes from 'prop-types';
const WeatherDetails=({icon,temp,city,country,lat,log,humidity,wind})=>{
  return (
  <>
  <div className="image">
    <img  src={icon} alt="Image" />
  </div>
  <div className="temp">{temp}°C</div>
  <div className="location">{city}</div>
  <div className="country">{country}</div>
  <div className="cord">
    <div>
      <span className='lat'>latitude</span>
      <span>{lat}</span>
    </div>
    <div>
      <span className='log'>longitude</span>
      <span>{log}</span>
    </div>
  </div>

  <div className="data-container">
    <div className="element">
      <img src={humidityIcon} alt="humidity" className='icon'/>
      <div className="data">
        <div className="humidity-percent">{humidity}%</div>
        <div className="text">Humidity</div>
      </div>
    </div>

    <div className="element">
      <img src={windyIcon} alt="wind" className='icon'/>
      <div className="data">
        <div className="wind-percent">{wind} km/h</div>
        <div className="text">Wind Speed</div>
      </div>
    </div>
  </div>

  </>
  );
}

WeatherDetails.PropTypes = {
  icon: PropTypes.string.isRequired, 
  temp: PropTypes.number.isRequired, 
  city: PropTypes.string.isRequired, 
  country: PropTypes.string.isRequired, 
  humidity: PropTypes.number.isRequired, 
  wind: PropTypes.number.isRequired, 
  lat: PropTypes.number.isRequired, 
  Log: PropTypes.number.isRequired, };
function App() {
  const apikey='7aba7621ba403288614f9ca3cb0d64bf';
  const [icon,setIcon]=new useState(rainIcon);
  const [temp,setTemp]=useState(0);
  const [city,setCity]=useState("Chennai");
  const [country,setCountry]=useState("IN");
  const [lat,setLat]=useState(0);
  const [log,setLog]=useState(0);
  const [humidity,setHumidity]=useState(0)
  const [wind,setWind]=useState(0);
  const [text,setText]=useState("Chennai");
  const [loading,setLoading]=new useState(false);
  const [cityNotFound,setCityNotFound]=useState(false);
  const [error,setError]=useState("");
  const weatherIconMap = {
    "01d": sunnyIcon,
    "01n": sunnyIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
};


  const search=async()=>{
    setLoading(true);
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apikey}&units=Metric`;

    try{
      let res=await fetch(url);
      let data=await res.json();
      if(data.cod=='404')
      {
        setLoading(false);
        setCityNotFound(true);
        return; 
      }
      
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);

      const weatherIconcode=data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconcode] || sunnyIcon);
      cityNotFound(false);
    }
    catch(error){
      console.log("An error occured"+error.message);
      setError("An error occured while fetching weather data");
    }
    finally{
      setLoading(false);
    }
  }

  const handleCity=(e)=>{
    setText(e.target.value);
  };
  const handleKeyDown=(e)=>{
    if(e.key=='Enter')
      search();
  }

  useEffect(function(){
    search();
  },[]);
  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" className="cityInput" onChange={handleCity}
          onKeyDown={handleKeyDown}
          value={text}
          placeholder="Search City"/>
          <div className="search-icon">
            <img src={searchIcon}
            alt="search" onClick={()=>search()} />
            </div>
        </div>


        {loading && <div className="loading-message">Loading...</div>}
        {cityNotFound && <div className="city-not-found">City Not Found</div>}

        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}

        <p className='copyright'>
      Designed by<span>Balaji</span>
    </p>
      </div>
    </>
  )
}

export default App
