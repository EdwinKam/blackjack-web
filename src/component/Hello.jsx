import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Hello = () => {
    const [text, setText] = useState('loading...');

    useEffect(() => {
        fetchHelloWorldServer()
            .then(data => setText(data))
            .catch(() => setText("Unable to fetch data"));
    }, []);

    return <h1>{text}</h1>;
}

const fetchHelloWorldServer = async () => {
    const url = 'https://blackjack-service-render.onrender.com/hello';
    const response = await axios.get(url);
    return response.data;
}

export default Hello;