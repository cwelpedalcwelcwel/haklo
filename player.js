import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

document.addEventListener('DOMContentLoaded', async () => {
    // Get movie ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        window.location.href = '/';
        return;
    }

    try {
        // Check if user has purchased the movie
        const { data: orders, error } = await supabase
            .from('stripe_user_orders')
            .select('*')
            .eq('payment_status', 'paid')
            .eq('status', 'completed');

        if (error) {
            throw error;
        }

        if (!orders || orders.length === 0) {
            // User hasn't purchased the movie - show purchase UI
            const movie = movies[movieId];
            if (!movie) {
                window.location.href = '/';
                return;
            }

            document.querySelector('.video-wrapper').innerHTML = `
                <div class="purchase-overlay">
                    <h2>Kup film aby oglądać</h2>
                    <p>Aby oglądać ten film, musisz go najpierw kupić.</p>
                    <div class="purchase-actions">
                        <button class="btn btn-primary purchase-button">
                            <i data-lucide="shopping-cart"></i>
                            <span>Kup teraz za 5.00 zł</span>
                        </button>
                    </div>
                </div>
            `;

            // Initialize purchase button
            const purchaseButton = document.querySelector('.purchase-button');
            if (purchaseButton) {
                purchaseButton.addEventListener('click', () => {
                    redirectToCheckout('MOVIE_PURCHASE');
                });
            }

            // Initialize icons
            lucide.createIcons();
            return;
        }

        // User has purchased - initialize player
        const movie = movies[movieId];
        if (movie) {
            // Initialize Plyr
            const player = new Plyr('#moviePlayer', {
                controls: [
                    'play-large',
                    'play',
                    'progress',
                    'current-time',
                    'duration',
                    'mute',
                    'volume',
                    'captions',
                    'settings',
                    'pip',
                    'airplay',
                    'fullscreen'
                ],
                keyboard: { focused: true, global: true },
                tooltips: { controls: true, seek: true }
            });

            // Update page content with movie details
            document.title = `${movie.title} - WFO`;
            document.getElementById('movieTitle').textContent = movie.title;
            document.getElementById('movieRating').textContent = movie.rating;
            document.getElementById('movieYear').textContent = movie.year;
            document.getElementById('movieGenre').textContent = movie.genre;
            document.getElementById('movieDescription').textContent = movie.description;

            // Set video source
            if (movie.videoUrl) {
                player.source = {
                    type: 'video',
                    sources: [
                        {
                            src: movie.videoUrl,
                            type: 'video/mp4',
                            size: 1080
                        }
                    ]
                };
            }

            // Initialize watermark functionality
            initializeWatermark(player);
        }
    } catch (error) {
        console.error('Error checking purchase status:', error);
        window.location.href = '/';
    }
});

function initializeWatermark(player) {
    const testText = document.createElement('div');
    testText.style.position = 'absolute';
    testText.style.color = 'white';
    testText.style.padding = '5px 10px';
    testText.style.backgroundColor = 'rgba(220, 38, 38, 0.7)';
    testText.style.borderRadius = '4px';
    testText.style.fontSize = '14px';
    testText.style.fontWeight = 'bold';
    testText.style.zIndex = '1000';
    testText.style.display = 'none';
    testText.textContent = 'test';

    const videoContainer = document.querySelector('.plyr');
    videoContainer.appendChild(testText);

    function showRandomText() {
        const container = document.fullscreenElement || videoContainer;
        const maxX = container.offsetWidth - testText.offsetWidth;
        const maxY = container.offsetHeight - testText.offsetHeight;
        
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        
        testText.style.left = `${randomX}px`;
        testText.style.top = `${randomY}px`;
        testText.style.display = 'block';
        
        setTimeout(() => {
            testText.style.display = 'none';
        }, 2000);
    }

    let textInterval = setInterval(showRandomText, 5000);

    document.addEventListener('fullscreenchange', () => {
        clearInterval(textInterval);
        textInterval = setInterval(showRandomText, 5000);
    });

    window.addEventListener('unload', () => {
        clearInterval(textInterval);
    });
}