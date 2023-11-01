// PostcodeForm.js
import React, { useState, useEffect } from 'react';
import countries from './countries.json';

const PostcodeForm = () => {
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [state,setState] = useState('');
  const [api, setApi] = useState('');
  const [postCodeError,setPostCodeError] = useState('');
  const [countryError,setCountryError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (postcode) {
          // Replace 'YOUR_API_ENDPOINT' with the actual API URL
          var response;
            if (api === 'PostalPinCode') {
                response = await fetch(`https://api.postalpincode.in/pincode/${postcode}`);
                if (response.ok) {
                    const data = await response.json();
                    if(data[0].Status === 'Error') setPostCodeError('Please Enter a valid postcode');
                    else {
                        setPostCodeError('');
                        setState(data[0].PostOffice[0].Circle);
                        setProvince(data[0].PostOffice[0].District);
                        setCity(data[0].PostOffice[0].Name);
                    }
                } else {
                    console.error('API request failed');
                    setPostCodeError('Please enter a valid postcode');
                }
            }
            else if (api === 'DataGov'){
                response = await fetch(`https://api.data.gov.in/resource/6176ee09-3d56-4a3b-8115-21841576b2f6?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&&filters%5Bpincode%5D=${postcode}`);
                if (response.ok) {
                    const data = await response.json();
                    if(data.records.length === 0) setPostCodeError('Please Enter a valid postcode');
                    else {
                        setPostCodeError('');
                        setState(data.records[0].statename);
                        setProvince(data.records[0].districtname);
                        setCity(data.records[0].officename);
                    }
                } else {
                    console.error('API request failed');
                    setPostCodeError('Please enter a valid postcode');
                }
            }
            else if (api === 'ZipCodeBase'){
                if(countries.hasOwnProperty(country)){
                    response = await fetch(`https://app.zipcodebase.com/api/v1/search?apikey=780122d0-76f3-11ee-ac0a-d1e21fb94706&codes=${postcode}&country=${countries[country]}`);
                    if (response.ok) {
                        var data = await response.json();
                        data = data.results;
                        if(data.length === 0) setPostCodeError('Please Enter a valid postcode');
                        else{
                            data = data[postcode];
                            setPostCodeError('');
                            setState(data[0].state);
                            setProvince(data[0].province);
                            setCity(data[0].city);
                        }
                    } else {
                        console.error('API request failed');
                    }
                }
            }
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
  
    if(api !== ""){fetchData();}
  }, [postcode]);
  
  const handlePostcodeChange = (e) => {
    const newPostcode = e.target.value;
    setPostcode(newPostcode);
  };

  const handleApiChange = (e) => {
    const newApi = e.target.value;
    setApi(newApi);
    if(api === 'DataGov' || api === 'PostalPinCode') setCountry('India');
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setCity(newCity);
  };

  const handleProvinceChange = (e) => {
    const newProvince = e.target.value;
    setProvince(newProvince);
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setState(newState);
  };

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    if(countries.hasOwnProperty(newCountry)){
        setCountryError('');
    }
    else setCountryError('Please enter a valid country!');
  };

  return (
    <div className="container">
      <h1>Postcode to Address Lookup</h1>
      <form className="row g-3 needs-validation" novalidate>
        <div className="col-md-4">
            <label for="api" class="form-label">API</label>
            <select class="form-select" id="api" value={api} onChange={handleApiChange} required>
                <option selected disabled value="">Select an API</option>
                <option value="ZipCodeBase">ZipCodeBase</option>
                <option value="DataGov">DataGov</option>
                <option value="PostalPinCode">PostalPinCode</option>
            </select>
		</div>
        <div className="col-md-4">
          <label For="postcode" className="form-label">
            Postcode
          </label>
          <input
            type="Number"
            className="form-control"
            id="postcode"
            value={postcode}
            onChange={handlePostcodeChange}
          />
        <div class="text-danger">
		    {postCodeError}
		</div>
        </div>
        <div className= 'col-md-4'>
          <label htmlFor="country" className="form-label">
            Country
          </label>
          <input
            type="text"
            className="form-control"
            id="country"
            value={country}
            onChange={handleCountryChange}
            disabled = {(api === 'DataGov' || api === 'PostalPinCode') ? true : false}
          />
        <div class="text-danger">
		    {countryError}
		</div>
        </div>
        <div className="col-md-4">
        <label htmlFor="city" className="form-label">
            City/Area
          </label>
          <input
            type="text"
            className="form-control"
            id="city"
            value={city}
            onChange={handleCityChange}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="province" className="form-label">
            Province
          </label>
          <input
            type="text"
            className="form-control"
            id="province"
            value={province}
            onChange={handleProvinceChange}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="state" className="form-label">
            State
          </label>
          <input
            type="text"
            className="form-control"
            id="state"
            value={state}
            onChange={handleStateChange}
          />
        </div>
      </form>
    </div>
  );
};

export default PostcodeForm;
