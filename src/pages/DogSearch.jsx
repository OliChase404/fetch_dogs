import React, { useState, useEffect } from "react";
import axios from 'axios';

import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';  
import { Dropdown } from 'primereact/dropdown';

import DogCard from "../components/DogCard";
import MatchWindow from "../components/MatchWindow";

function DogSearch({baseUrl, setIsAuthenticated}) {
    const [breeds, setBreeds] = useState([]);
    const [dogs, setDogs] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [previousDogs, setPreviousDogs] = useState([]);
    const [locations, setLocations] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [match, setMatch] = useState({});
    const [showMatch, setShowMatch] = useState(false);

    // pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [totalResults, setTotalResults] = useState(0);
    // ----------------

    // store search parameters
    const [selectedBreeds, setSelectedBreeds] = useState([]);
    const [zipCodes, setZipCodes] = useState([]);
    const [ageMin, setAgeMin] = useState('');
    const [ageMax, setAgeMax] = useState('');
    const [size, setSize] = useState(12);
    const [from, setFrom] = useState('');
    const [sort, setSort] = useState('breed:asc');
    // -----------------

    const sortOptions = [
        {label: 'Breed (A-Z)', value: 'breed:asc'},
        {label: 'Breed (Z-A)', value: 'breed:desc'},
        {label: 'Name (A-Z)', value: 'name:asc'},
        {label: 'Name (Z-A)', value: 'name:desc'},
        {label: 'Age (youngest to oldest)', value: 'age:asc'},
        {label: 'Age (oldest to youngest)', value: 'age:desc'}
    ];

    useEffect(() => {
        fetch(baseUrl + '/dogs/breeds',{
            method: 'GET',
            credentials: 'include'
        }).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setBreeds(data);
                })
            }
        })

        handleSearch(selectedBreeds, zipCodes, ageMin, ageMax, size, from, sort)
    }, []);
    
    useEffect(() => {
        handleSearch(selectedBreeds, zipCodes, ageMin, ageMax, pageSize, page, sort);
    }, [selectedBreeds, zipCodes, ageMin, ageMax, pageSize, page, sort]);
    

    useEffect(() => {
        fetch( baseUrl + '/locations', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dogs.map((dog) => dog.zip_code))
            }).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setLocations(data);
                })
            }
            
        })
    }, [dogs]);

    useEffect(() => {
        if (favorites.length >= 5) {
            fetch(baseUrl + '/dogs/match', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(favorites)
            }).then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        setMatch(data);
                        console.log(data);
                    })
                }
            })
        }
    }, [favorites]);


    function fetchDogs(ids) {
        fetch( baseUrl + '/dogs', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ids)
        }).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setDogs(data);
                    })
            }
        })
    }

    function handleSearch(breeds, zipCodes, ageMin, ageMax, pageSize, page, sort) {
        const offset = (page - 1) * pageSize;
    
        axios.get(baseUrl + '/dogs/search', {
            params: {
                breeds,
                zipCodes,
                ageMin,
                ageMax,
                size: pageSize,
                from: offset,
                sort
            },
            withCredentials: true
        })
        .then(response => {
            setTotalResults(response.data.total);
            fetchDogs(response.data.resultIds);
        })
        .catch(error => console.error('Error:', error));
    }
    
    function clearSearch() {
        setSelectedBreeds([]);
        setZipCodes([]);
        setAgeMin('');
        setAgeMax('');
        setSize(8);
        setFrom('');
        setSort('breed:asc');
        handleSearch([], [], '', '', 100, '', '');
    }

    function getFavorites() {
        if (favorites.length <= 0) {
            return;
        }
        fetch(baseUrl + '/dogs/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(favorites)
            }).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setPreviousDogs(dogs);
                    setDogs(data);
                    setShowFavorites(true);
                })
            }
        })
    }
    function backToSearch() {
        setDogs(previousDogs);
        setShowFavorites(false);
    }

    function logout() {
        fetch(baseUrl + '/auth/logout', {
            method: 'POST',
            credentials: 'include'
        }).then((response) => {
            if (response.ok) {
                setIsAuthenticated(false);
            }
        })
    }

    const renderDogs = () => {
        return dogs.map((dog) => {
            const location = locations.find((location) => location?.zip_code === dog.zip_code);
            return (
                <DogCard 
                    dog={dog} 
                    location={location} 
                    favorites={favorites} 
                    setFavorites={setFavorites}
                    showFavorites={true}
                    key={dog.id}
                />
            )
        })
    }

    return (
        <div className="DogSearch">
            <div className="Header">
                <div className="HeaderLeft">
                    <h1 style={{ marginTop: '0' }}>🐶 Dog Matcher</h1>
                    <h2>Who's a good boy?</h2>
                </div>
                <div className="HeaderRight">
                    {favorites.length >= 5  ? 
                    <Button 
                        label="View Your Match!"
                        onClick={() => {setShowMatch(true)}}
                    />
                    :
                        `Favorite ${5 - favorites.length} more dogs to get your match!`
                    }
                    <Button label="Logout"onClick={() => {logout()}}/>
                </div>
            </div>

            {showMatch && <MatchWindow style={showMatch ? {display: 'block'} : {display: 'none'}} match={match} setShowMatch={setShowMatch} baseUrl={baseUrl} />}

            <div className="SearchContainer">
                <div className="SearchOptionsContainer">
                    <div className="SearchOption">
                        <h3>Breed</h3>
                        <MultiSelect
                            value={selectedBreeds}
                            options={breeds.map(breed => ({ label: breed, value: breed }))}
                            onChange={(e) => setSelectedBreeds(e.value)}
                            style={{ width: '100%' }}
                            className="BreedSelect w-full md:w-20rem"
                            maxSelectedLabels={1}
                            filter
                        />
                    </div>
                    <div className="SearchOption">
                        <h3>Age</h3>
                        <InputText 
                            placeholder="Min" 
                            min={0}
                            max={100}
                            className="p-inputtext-sm AgeSelect" 
                            keyfilter={"int"} 
                            value={ageMin} 
                            onChange={(e) => setAgeMin(e.target.value)}
                        />
                        <InputText 
                            placeholder="Max" 
                            min={0}
                            max={100}
                            className="p-inputtext-sm AgeSelect" 
                            keyfilter={"int"} 
                            value={ageMax} 
                            onChange={(e) => setAgeMax(e.target.value)}
                        />
                    </div>
                    <div className="SearchOption">
                        <h3>Sort By</h3>
                        <Dropdown
                            value={sort}
                            options={sortOptions}
                            onChange={(e) => setSort(e.value)}
                            style={{ width: '100%' }}
                            className="BreedSelect w-full md:w-20rem"
                            maxSelectedLabels={1}
                        />
                    </div>
                    <div className="SearchOptionButtonContainer">
                        <Button severity="warning" onClick={clearSearch}>Reset</Button>
                        <Button severity="info" onClick={() => handleSearch(selectedBreeds, zipCodes, ageMin, ageMax, size, from, sort)}>Search</Button>
                    </div>
                    {favorites.length >= 1 && (showFavorites ?
                        <div className="SearchOptionButtonContainer">
                            <Button severity="help" onClick={() => backToSearch()}>Back to Search</Button>
                        </div>
                        :
                        <div className="SearchOptionButtonContainer">
                            <Button severity="help" onClick={() => getFavorites()}>Show Favorites</Button>
                        </div>
                        )
                    }
                </div>

                <div className="DogCardContainer">
                    {renderDogs()}
                </div>
            </div>
            <Paginator
                first={(page - 1) * pageSize}
                rows={pageSize}
                totalRecords={totalResults}
                rowsPerPageOptions={[8, 16, 32]}
                className="DogSearchPaginator"
                onPageChange={(e) => {
                setPage(e.page + 1);
                setPageSize(e.rows);
                }}
            />
        </div>
    );
}

export default DogSearch;