import React, { useState, useEffect } from "react";

function DogCard({dog, location, favorites, setFavorites, showFavorites}) {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        setIsFavorite(favorites.some((favId) => favId === dog.id));
    }, [favorites, dog.id]);
    // console.log(favorites);

    return (
        <div className="DogCard">
            <div className="DogCardImageDiv" style={{backgroundImage: `url(${dog.img})`}}>
                {showFavorites && (isFavorite ? 
                    <i 
                        className="pi pi-heart-fill FavoriteHeartToggle"
                        onClick={() => setFavorites(favorites.filter((favId) => favId !== dog.id))} 
                        style={{color: '#FF2700'}}
                    />
                :
                    <i
                        className="pi pi-heart FavoriteHeartToggle"
                        onClick={() => setFavorites([...favorites, dog.id])}
                        style={{color: '#FF2700'}}
                    />)
                }
            </div>
            <div>
                <h2>{dog.name}</h2>
                <div className="DogCardInfo">
                    <p>{dog.breed}</p>
                    <p>-</p>
                    <p>{dog.age > 0 ? `${dog.age} y/o` : 'Puppy'}</p>
                </div>
                {location ?
                <div className="DogCardInfo">
                    <p>{location?.city}, {location?.state} - {location?.zip_code}</p>
                </div>
                :
                <div className="DogCardInfo">
                    <p>Zip Code - {dog.zip_code}</p>
                </div>
                }
            </div>
        </div>
    )
}

export default DogCard