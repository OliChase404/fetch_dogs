import React, { useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function Login({baseUrl, setIsAuthenticated}) {
    const [name, setName] = useState("Testy Mctest");
    const [email, setEmail] = useState("t.mctest@gmail.com");

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(baseUrl + '/auth/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: name,
                email: email
            })
        }).then((response) => {
            if (response.ok) {
                setIsAuthenticated(true);
            }
            else {
                alert("Login failed");
            }
        })
    }

    return (
        <div className="LoginContainer">
                <div className="LoginForm">
                    <div className="LoginFromRow">
                        <label className="w-6rem">Name</label>
                        <InputText 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            type="text" 
                            className="w-12rem" 
                        />
                    </div>
                    <div className="LoginFromRow">
                        <label className="w-6rem">Email</label>
                        <InputText 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            type="Email" 
                            className="w-12rem" 
                        />
                    </div>
                    <Button 
                        onClick={handleSubmit} 
                        label="Login" icon="pi pi-user" 
                        className="w-10rem mx-auto"
                    />
                </div>
        </div>
    )
}

export default Login;