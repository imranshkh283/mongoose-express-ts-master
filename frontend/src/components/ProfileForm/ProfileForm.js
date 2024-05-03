import React, { useState } from "react";
import axios from "axios";
import "./ProfileForm.css";

import { ACCESS_TOKEN_NAME } from "../../constants/apiContants";
import { withRouter } from "react-router-dom";


function ProfileForm(props) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [userName, setUserName] = useState("")
    const [gender, setGender] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
    const [pincode, setPincode] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const handleSubmitClick = (e) => {
        e.preventDefault();
        const payload = {
            "firstName": firstName,
            "lastName": lastName,
            "userName": userName,
            "gender": gender,
            "dateOfBirth": dateOfBirth,
            "phone": phone,
            "address": address,
            "city": city,
            "country": country,
            "pincode": pincode
        };

        axios.post('http://localhost:5000/api/profile', {
            headers: {
                "authorization": localStorage.getItem(ACCESS_TOKEN_NAME)
            }
        }, payload)
            .then(function (response) {
                if (response.status === 200) {
                    setSuccessMessage("Profile updated successfully");
                    localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
                    props.showError(null);
                } else if (response.code === 401) {
                    props.showError("Username and password do not match");
                } else {
                    props.showError("Username does not exists");
                }
            })
    }
    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        placeholder="Add First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}

                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="userName"
                        placeholder="Add Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="userName">User Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="userName"
                        placeholder="Add User Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="gender">Gender</label>
                    <select
                        className="form-control"
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}

                    >
                        <option value>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                        type="date"
                        className="form-control"
                        id="dateOfBirth"
                        placeholder="Add Date of Birth"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="text"
                        className="form-control"
                        id="phone"
                        placeholder="Add Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        id="address"
                        placeholder="Add Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}

                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="city">City</label>
                    <input
                        type="text"
                        className="form-control"
                        id="city"
                        placeholder="Add City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}

                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="country">Country</label>
                    <input
                        type="text"
                        className="form-control"
                        id="country"
                        placeholder="Add country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}

                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="country">Pin Code</label>
                    <input
                        type="text"
                        className="form-control"
                        id="pincode"
                        placeholder="Add Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}

                    />
                </div>
                <div className="form-check"></div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    Submit
                </button>
            </form>
            <div
                className="alert alert-success mt-2"
                style={{ display: successMessage ? "block" : "none" }}
                role="alert"
            >
                {successMessage}
            </div>

        </div>
    );
}



export default withRouter(ProfileForm);