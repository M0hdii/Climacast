import express from 'express';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
const fetch = await import('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Get the directory name of the current module file
const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files from the 'frontend' directory
app.use(express.static(join(__dirname, '/frontend'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    },
}));

// Serve the index.html file at the root route
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'frontend', 'index.html'));
});

app.get('/api/weather', async (req, res) => {
    const { city, lat, lon } = req.query;
    let url = '';

    if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ccc1534c3c516c8a83b22e235b5690c6&units=metric`;
    } else if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=ccc1534c3c516c8a83b22e235b5690c6&units=metric`;
    } else {
        return res.status(400).json({ error: 'City or coordinates required' });
    }

    try {
        const response = await fetch.default(url); // Access fetch function from dynamic import
        const data = await response.json();
        if (data.cod !== 200) throw new Error(data.message);

        res.json({
            city: data.name,
            temperature: data.main.temp,
            condition: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// JavaScript code to animate elements on scroll and add hover effect
function animateOnScroll() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Percentage of the element's visibility required to trigger animation
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function addHoverEffect() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    addHoverEffect();
});

// JavaScript code for weather functionality
document.getElementById('get-weather-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    getWeather(city);
});

async function getWeather(city) {
    let url = '';
    if (city.trim() !== '') {
        url = `/api/weather?city=${city}`;
        fetchWeather(url);
    } else {
        alert('Please enter a city name.');
    }
}

async function fetchWeather(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather data not available');
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        alert(error.message);
    }
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weather-display');
    weatherDisplay.innerHTML = `
        <h2>Weather for ${data.city}</h2>
        <p>Temperature: ${data.temperature}°C</p>
        <p>Condition: ${data.condition}</p>
        <p>Humidity: ${data.humidity}%</p>
        <p>Wind Speed: ${data.windSpeed} m/s</p>
    `;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
