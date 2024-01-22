import React, { useState, useEffect } from "react";
import { Card, CardContent, FormControl, Select, MenuItem} from "@mui/material";
import { sortData, prettyPrintStat} from "./utilities";
import InfoBox from "./components/InfoBoxes/InfoBox";
import WorldMap from "./components/WorldMap/WorldMap";
import Table from "./components/Table/Table";
import Graph from "./components/Graph/Graph";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  // * Sets Map center
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  // * Sets Covid case types
  const [casesType, setCasesType] = useState("cases");

  // * Disease.sh API: https://disease.sh/

  // * Retrieves all data (worldwide) on first page load
  useEffect(() => {

    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {

        setCountryInfo(data);

      });

  }, []);


  // * Retrieves specific country data
  useEffect(() => {

    const getCountriesData = async () => {

      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {

          const countries = data.map((country) => ({

            name: country.country, // * United States, United Kingdom, etc
            value: country.countryInfo.iso2, //* UK,US, etc

          }));

          const sortedData = sortData(data);

          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);

        });

    };

    getCountriesData();

  }, []);


  // * When a country is selected, retrieve its Covid information
  const onCountryChange = async (event) => {

    let countryCode = event.target.value;

    setCountry(countryCode);

    let url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

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

          <h1>COVID-19 Tracker</h1>

          <FormControl className="dropdown">

            <Select className="select" variant="outlined" onChange={onCountryChange} value={country}>

              <MenuItem value="worldwide">Worldwide</MenuItem>

              {countries.map((country, index) => (
                <MenuItem key={index} value={country.value}>{country.name}</MenuItem>
              ))}

            </Select>

          </FormControl>

        </div>

        <div>

          <div className="app__stats">

            <InfoBox isRed title="Coronavirus Cases Today" active={casesType === "cases"} onClick={(event) => setCasesType("cases")} cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}
            />

            <InfoBox  title="Recovered Today" active={casesType === "recovered"} onClick={(event) => setCasesType("recovered")} cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />

            <InfoBox isRed title="Deaths Today" active={casesType === "deaths"} onClick={(event) => setCasesType("deaths")} cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} />
            
          </div>

          <WorldMap casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />

        </div>

      </div>

      <div className="app__right">

        <Card className="app__right-card">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <hr/>
            <Table countries={tableData} />
          </CardContent>
        </Card>

        <Card className="app__right-card">
          <CardContent>
            <h3 className="worldwideCases"> Worldwide New {casesType}</h3>
            <hr/>
            <Graph casesType={casesType} />
          </CardContent>
        </Card>

      </div>

    </div>
  );
}

export default App;