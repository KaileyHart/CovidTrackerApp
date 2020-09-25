import React, { useState, useEffect } from "react";
import "./DropDown.scss";
//MATERIAL UI
import {
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import InfoBox from "../InfoBoxes/InfoBox";
import Map from "../Map/Map";
import Table from "../Table/Table";

function DropDown() {
  //Sets all countries
  const [countries, setCountries] = useState([]);

  //Sets the country
  const [country, setCountry] = useState("worldwide");

  //Sets country information
  const [countryInfo, setCountryInfo] = useState({});

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
      });
  };

  return (
    <div className="app">
      <div className="left">
        <div className="dropdown">
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
          <div className="body__stats">
            <InfoBox
              title="Coronavirus Cases"
              cases={countryInfo.todayCases}
              total={countryInfo.cases}
            />
            <InfoBox
              title="Recovered"
              cases={countryInfo.todayRecovered}
              total={countryInfo.recovered}
            />
            <InfoBox
              title="Deaths"
              cases={countryInfo.todayDeaths}
              total={countryInfo.deaths}
            />
          </div>
          <Map />
        </div>
      </div>
      <div className="right">
        <Card>
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={countries} />
            <h3> WorldWide New Cases</h3>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DropDown;
