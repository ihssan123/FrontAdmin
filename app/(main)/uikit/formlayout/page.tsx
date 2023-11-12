'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
interface DropdownItem {
    name: string;
    code: string;
}

const FormLayoutDemo = () => {
    const [userData, setUserData] = useState({ username: '',firstName: '',lastName: '',age: 0,phone: '', email: '' });
    const storedToken = localStorage.getItem('token');
    const [dropdownItem, setDropdownItem] = useState<DropdownItem | null>(null);
    const dropdownItems: DropdownItem[] = useMemo(
        () => [
            { name: 'Option 1', code: 'Option 1' },
            { name: 'Option 2', code: 'Option 2' },
            { name: 'Option 3', code: 'Option 3' }
        ],
        []
    );

    useEffect(() => {
        setDropdownItem(dropdownItems[0]);

        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/user/userInfo', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                });

                if (response.status === 200) {
                    setUserData({ username: response.data.username,firstName: response.data.firstName,lastName: response.data.lastName,age: response.data.age,phone: response.data.phone, email: response.data.email});
                    console.log(response.data.firstName); // Log or set the retrieved user info in state
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                // Handle error
            }
        };

        fetchUserInfo(); // Invoke the fetchUserInfo function

    }, [dropdownItems, storedToken]);

 
    return (
        <div className="grid">
              <div className="col-12">
                <div className="card">
                    <h5>Mettre à jour vos informations personnelles</h5>
                    <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        
                            <label htmlFor="firstname2">Nom d'utilisateur</label>
                            <InputText   value={userData.username} id="firstname2" type="text" />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="firstname2">Prénom</label>
                            <InputText   value={userData.firstName} id="firstname2" type="text" />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="lastname2">Nom </label>
                            <InputText value={userData.lastName} id="lastname2" type="text" />
                        </div>
                        
                        <div className="field col-12 md:col-6">
                            <label htmlFor="lastname2">Age</label>
                            <InputText value={userData.age.toString()} id="lastname2" type="text" />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="lastname2">Téléphone</label>
                            <InputText value={userData.phone} id="lastname2" type="text" />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="lastname2">Email</label>
                            <InputText value={userData.email} id="lastname2" type="text" />
                        </div>
                        <Button label="Modifier" severity="info" text />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormLayoutDemo;
