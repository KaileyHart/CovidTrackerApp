import React, { useState, useEffect } from "react";
import { sortData } from "./utilities";
import { prettyPrintStat } from "./utilities";
//MATERIAL UI
import {
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
//Components
import InfoBox from "./components/InfoBoxes/InfoBox";
import Map from "./components/Map/Map";
import Table from "./components/Table/Table";
import Graph from "./components/Graph/Graph";
import "leaflet/dist/leaflet.css";

function App() {
  //Sets all countries
  const [countries, setCountries] = useState([]);

  //Sets the country
  const [country, setCountry] = useState("worldwide");

  //Sets country information
  const [countryInfo, setCountryInfo] = useState({});

  //Sets Table data
  const [tableData, setTableData] = useState([]);

  //Sets Map center
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });

  //Sets Map zoom
  const [mapZoom, setMapZoom] = useState(3);

  //Sets all the countries on the map
  const [mapCountries, setMapCountries] = useState([]);

  //Sets case types
  const [casesType, setCasesType] = useState("cases");

  //Disease.sh API
  //Retrieves all data (worldwide) on first page load
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  //Disease.sh API
  //Retrieves specific country data
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, //United States, United Kingdom, etc
            value: country.countryInfo.iso2, //UK,US, etc
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  //When a country is selected, retrieve the covid information
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__dropdown">
          <h1>COVID 19 TRACKER</h1>
          <FormControl className="dropdown">
            <Select
              onChange={onCountryChange}
              className="select"
              variant="outlined"
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <div className="app__stats">
            <InfoBox
              isRed
              active={casesType === "cases"}
              onClick={(e) => setCasesType("cases")}
              title="Coronavirus Cases"
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={prettyPrintStat(countryInfo.cases)}
            />
            <InfoBox
              active={casesType === "recovered"}
              onClick={(e) => setCasesType("recovered")}
              title="Recovered"
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={prettyPrintStat(countryInfo.recovered)}
            />
            <InfoBox
              isRed
              active={casesType === "deaths"}
              onClick={(e) => setCasesType("deaths")}
              title="Deaths"
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={prettyPrintStat(countryInfo.deaths)}
            />
          </div>
          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>
      <div className="app__right">
        <Card>
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3 className="worldwideCases"> WorldWide New {casesType}</h3>
            <Graph casesType={casesType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
