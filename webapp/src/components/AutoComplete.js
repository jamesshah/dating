import React, { useState, useCallback, useEffect } from "react";
import { FormControl, ListGroup } from "react-bootstrap";
import axios from "axios";
import debounce from "lodash.debounce";
import { GeoAlt } from "react-bootstrap-icons";

const AutoComplete = ({
  className,
  placeholder,
  userLocation,
  setUserLocation,
}) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    setSearch(userLocation?.place_name);
  }, [userLocation]);

  const makeRequest = async (query) => {
    console.log(query);
    if (query) {
      setLoading(true);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?country=US&autocomplete=true&types=place&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_KEY}`;

      let results = await axios.get(url);
      let features = results.data.features;
      console.log(features);
      if (features.length !== 0) {
        setSuggestions(features);
        setLoading(false);
        setValid(true);
      } else {
        setSuggestions([]);
        setLoading(false);
        setValid(false);
      }
    } else {
      setLoading(false);
      setValid(true);
      setSuggestions([]);
    }
  };

  const listOnClick = (suggestion) => {
    setValid(true);
    setLoading(false);
    setSuggestions([]);
    setSearch(suggestion.place_name);
    console.log(suggestion);
    setUserLocation(suggestion.geometry);
  };

  const debouncedSave = useCallback(
    debounce((newValue) => makeRequest(newValue), 1000),
    []
  );

  const updateValue = (newValue) => {
    setLoading(true);
    setSearch(newValue);
    debouncedSave(newValue);
  };

  return (
    <>
      <FormControl
        type="text"
        placeholder={placeholder ? placeholder : "Find dates near..."}
        value={search}
        onChange={(e) => updateValue(e.target.value)}
        required
      />
      <ListGroup className={className}>
        {loading && <ListGroup.Item>Loading...</ListGroup.Item>}
        {!valid && !loading && (
          <ListGroup.Item>Please select a valid location</ListGroup.Item>
        )}
        {suggestions.length > 0 &&
          !loading &&
          suggestions.map((suggestion) => {
            return (
              <ListGroup.Item
                action
                key={suggestion.id}
                onClick={() => listOnClick(suggestion)}
              >
                <GeoAlt className="me-2" />
                {suggestion.place_name}
              </ListGroup.Item>
            );
          })}
      </ListGroup>
    </>
  );
};

export default AutoComplete;
