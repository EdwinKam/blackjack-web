import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Hello = () => {
    const [requests, setRequests] = useState([]);
    const [userInput, setUserInput] = useState('');

    const url = 'https://blackjack-service-render.onrender.com';
    // const url = 'http://localhost:8080';

    useEffect(() => {
        const intervalId = setInterval(() => {
            handleLookUp();
        }, 1000);

        return () => clearInterval(intervalId); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [requests]);

    const handleChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSubmitRequest = async () => {
        const response = await axios.post(url + '/add-to-queue', {}, {
            params: {
                'number': Number(userInput)
            }
        });
        setRequests(prevData => [...prevData,
        {
            trackingUuid: response.data,
            userInput: userInput,
            requestStatus: 'checking'
        }]);
    };

    const handleLookUp = async () => {
        const newArr = await Promise.all(requests.map(async r => {
            console.log(r);
            const response = await axios.post(url + '/check/', {}, {
                params: {
                    'trackingUuid': r.trackingUuid  // Assuming `trackingUuid` is part of each request object
                }
            });

            return {
                trackingUuid: r.trackingUuid,   // Use actual response data fields
                userInput: r.userInput, // Need to define where this is from
                requestStatus: response.data  // Use actual response data fields
            };
        }));

        console.log(newArr);

        setRequests(newArr);
    };

    const handleStop = async (trackingUuid) => {
        await axios.post(url + '/stop', {}, {
            params: {
                'trackingUuid': trackingUuid  // Assuming `trackingUuid` is part of each request object
            }
        });
    }

    return <div>
        <label>
            Enter a number:
            <input
                type="number"
                value={userInput}
                onChange={handleChange}
            />
        </label>
        <button onClick={handleSubmitRequest}>
            Click me
        </button>
        {requests.map((r, index) =>
            <div key={index}>
                <p>{r.trackingUuid} {r.userInput} {r.requestStatus}</p>
                <button onClick={() => handleStop(r.trackingUuid)}>
                    stop
                </button>
            </div>
        )}
    </div>;
}

export default Hello;