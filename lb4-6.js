"use strict";

let movies = [];
let filteredMovies = [];

async function fetchMovies() {
    try {
        const response = await fetch('https://api.tvmaze.com/shows');
        if (!response.ok) {
            throw new Error(`HTTP помилка! Статус: ${response.status}`);
        }
        const data = await response.json();
        movies = data;
        filteredMovies = [...movies];
        displayMovies(filteredMovies);
    } catch (error) {
        console.error('Помилка при завантаженні даних:', error);
        showError('Не вдалося завантажити фільми. Спробуйте пізніше.');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('movies').innerHTML = '';
}

function displayMovies(movieList) {
    const moviesContainer = document.getElementById('movies');
    const errorDiv = document.getElementById('error');
    errorDiv.style.display = 'none';

    if (movieList.length === 0) {
        moviesContainer.innerHTML = '<p>Фільми не знайдені.</p>';
        return;
    }

    const html = movieList.map(movie => {
        const { name, image, rating, genres, summary } = movie;
        const imageUrl = image ? image.medium : 'https://via.placeholder.com/210x295?text=No+Image';
        const ratingValue = rating.average || 'N/A';
        const genresText = genres.join(', ') || 'Невідомо';

        return `
            <div class="movie-card">
                <img src="${imageUrl}" alt="${name}">
                <h3>${name}</h3>
                <p><strong>Рейтинг:</strong> ${ratingValue}</p>
                <p><strong>Жанри:</strong> ${genresText}</p>
                <p>${summary ? summary.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : 'Опис відсутній'}</p>
            </div>
        `;
    }).join('');

    moviesContainer.innerHTML = html;
}

function filterMovies(query) {
    filteredMovies = movies.filter(movie =>
        movie.name.toLowerCase().includes(query.toLowerCase())
    );
    displayMovies(filteredMovies);
}

function sortByAlphabet() {
    filteredMovies.sort((a, b) => a.name.localeCompare(b.name));
    displayMovies(filteredMovies);
}

function sortByRating() {
    filteredMovies.sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0));
    displayMovies(filteredMovies);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();

    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => {
        filterMovies(e.target.value);
    });

    document.getElementById('sort-alpha').addEventListener('click', sortByAlphabet);
    document.getElementById('sort-rating').addEventListener('click', sortByRating);
});