import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Fireworks } from "fireworks-js";

import DogCard from "./DogCard";

function MatchWindow({ match, setShowMatch, baseUrl }) {
    const [dog, setDog] = useState(null);
    const fireworksRef = useRef(null);
    const fireworksContainerRef = useRef(null);

    useEffect(() => {
        if (fireworksContainerRef.current) {
            const fw = new Fireworks(fireworksContainerRef.current, {
                speed: 3,
                acceleration: 1.05,
                particles: 150,
                explosion: 5,
                intensity: 40,
                friction: 0.97,
                gravity: 1.5,
                opacity: 0.5,
                trace: 3,
            });

            fw.start();
            fireworksRef.current = fw;

            setTimeout(() => {
                fw.stop();
            }, 12000);
        }
    }, []);

    useEffect(() => {
        fetch(baseUrl + "/dogs", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify([match.match]),
        }).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setDog(data[0]);
                    console.log(data);
                });
            }
        });
    }, []);

    return (
        <div className="MatchWindow">
            <div ref={fireworksContainerRef} className="fireworks-container"></div>
                <div className="MatchWindowContent">
                    {dog && <DogCard dog={dog} location={null} favorites={[]} setFavorites={[]} showFavorites={false} />}
                    <Button severity="warning" label="Close" onClick={() => setShowMatch(false)} className="p-button-secondary" />
                </div>
        </div>
    );
}

export default MatchWindow;
