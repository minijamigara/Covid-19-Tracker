import React,{useState, useEffect} from 'react';
//import logo from './logo.svg';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
}from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import './App.css';
import { sortData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
const [countries,setCountries] = useState([]);
const [country ,setCountry] = useState('worldwide');
const [countryInfo ,setCountryInfo] = useState({});
const [tableData,setTableData] = useState([]);
const [mapCenter, setMapCenter] = useState({ lat:34.80746, lng:-40.4796});
const [mapZoom, setMapZoom] = useState(3);

useEffect(() =>{
  fetch("https://disease.sh/v3/covid-19/all")
  .then(response => response.json())
  .then((data)=>{
    setCountryInfo(data);
  });
},[]);

//STATE = how to write a variable in REACT<<<<
//https://disease.sh/v3/covid-19/countries
//USEREFFECT = Runs a peice of code based on a given condition 
useEffect(()=>{
//The code inside here will run once
//when the component loads and not again

const getCountriesData = async ()=>{
  await fetch("https://disease.sh/v3/covid-19/countries")
  .then((response)=>response.json())
  .then((data)=>{
    const countries = data.map((country)=>(
      {
        name:country.country,
        value:country.countryInfo.iso2
      }));

      const sortedData = sortData(data);
      setTableData(sortedData);
      setCountries(countries);
  });
};
getCountriesData();
},[]);

const onCountryChange = async(event)=>{
  const countryCode = event.target.value;

//console.log("gyrgrfff",countryCode);
setCountry(countryCode);

const url = countryCode ==="worldwide" 
? "https://disease.sh/v3/covid-19/all"
: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

await fetch(url)
.then(response => response.json())
.then(data => {
  setCountry(countryCode);

  //All of the data..
  //from the country response
  setCountryInfo(data);

  setMapCenter([data.countryInfo.lat,data.countryInfo.lng]);
  setMapZoom(4);
  });
};
  return (
    <div className="App">
      <div className="app_left">
      <div className="app_header">
      <h1>COVID-19 TRACKER</h1>
      <FormControl className="app_dropdown">
        <Select variant="outlined" onChange={onCountryChange} value={country}>
        <MenuItem value="worldwide">Worldwide</MenuItem>
          {/*Loop through all the contries and show a drop down list of the options*/}
          {
            countries.map(country=>(
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))
          }

          {/*<MenuItem value="worldwide">Worldwide</MenuItem>
          <MenuItem value="worldwide">Option 2</MenuItem>
          <MenuItem value="worldwide">Option 3</MenuItem>
          <MenuItem value="worldwide">option 4</MenuItem>*/}

        </Select>
      </FormControl>
      </div>
      <div className="app_stats">
        <InfoBox title ="Coronavirus Cases" 
        cases={countryInfo.todayCases} 
        total = {countryInfo.cases}/>

        <InfoBox title ="Recovered"
        cases={countryInfo.todayRecovered} 
        total={countryInfo.recovered}/>

        <InfoBox title ="Deaths"
        cases={countryInfo.todayDeaths} 
        total={countryInfo.deaths}/>
      </div>

      <Map
      center = {mapCenter}
      zoom = {mapZoom}
      />
      
      </div>
      <Card className="app_rght">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries = {tableData}/>
          {/*Table*/}
          <h3>Worldwide new cases</h3>
          <LineGraph/>
          {/*Graph*/}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
