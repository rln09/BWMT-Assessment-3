// News page — fetches blog posts from WordPress REST API

const NEWS_API_URL = 'http://pantry.local/wp-json/wp/v2/posts';

// Format date to readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', options);
}

// Truncate text to specified length
function truncateText(text, maxLength = 150) {
    if (!text) return '';
    const strippedText = text.replace(/<[^>]*>/g, '');
    if (strippedText.length <= maxLength) return strippedText;
    return strippedText.substring(0, maxLength).trim() + '...';
}

// Get featured image URL from post
function getFeaturedImage(post) {
    // Try different ways to get the featured image
    if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
        const media = post._embedded['wp:featuredmedia'][0];
        return media.source_url || media.media_details?.sizes?.medium?.source_url || DEFAULT_IMAGE;
    }
    
    if (post.featured_media_url) {
        return post.featured_media_url;
    }
    
    if (post.acf && post.acf.featured_image) {
        return post.acf.featured_image;
    }
    
    return DEFAULT_IMAGE;
}

// Show loading state
function showLoading() {
    const container = document.getElementById('news-list');
    if (container) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading latest news...</p>
            </div>
        `;
    }
}

// Show error message
function showError(message) {
    const container = document.getElementById('news-list');
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <p>⚠️ ${message}</p>
                <button onclick="retryLoadNews()" class="retry-btn">Try Again</button>
            </div>
        `;
    }
    console.error('News fetch error:', message);
}

// Show no posts message
function showNoPosts() {
    const container = document.getElementById('news-list');
    if (container) {
        container.innerHTML = `
            <div class="no-posts">
                <p>📝 No news posts available at the moment.</p>
                <p>Check back soon for updates from Pantry Perth!</p>
            </div>
        `;
    }
}

// Render news posts to the page
function renderPosts(posts) {
    const container = document.getElementById('news-list');
    
    if (!container) {
        console.error('News container not found');
        return;
    }
    
    if (!posts || posts.length === 0) {
        showNoPosts();
        return;
    }
    
    container.innerHTML = posts.map(post => `
        <article class="news-item">
            ${getFeaturedImage(post) !== DEFAULT_IMAGE ? `
                <div class="news-image">
                    <img src="${escapeHtml(getFeaturedImage(post))}" 
                         alt="${escapeHtml(post.title?.rendered || 'News image')}"
                         loading="lazy">
                </div>
            ` : ''}
            
            <div class="news-content">
                <div class="news-meta">
                    <span class="news-date">📅 ${formatDate(post.date)}</span>
                    ${post._embedded && post._embedded.author ? `
                        <span class="news-author">✍️ By ${escapeHtml(post._embedded.author[0].name)}</span>
                    ` : ''}
                </div>
                
                <h3 class="news-title">
                    <a href="${post.link}" target="_blank" rel="noopener noreferrer">
                        ${escapeHtml(post.title?.rendered || 'Untitled')}
                    </a>
                </h3>
                
                <div class="news-excerpt">
                    ${escapeHtml(truncateText(post.excerpt?.rendered || post.content?.rendered || 'No description available'))}
                </div>
                
                <div class="news-footer">
                    <a href="${post.link}" class="read-more" target="_blank" rel="noopener noreferrer">
                        Read full article →
                    </a>
                    
                    ${post.categories && post.categories.length ? `
                        <div class="news-categories">
                            ${post.categories.map(cat => `<span class="category-tag">${escapeHtml(cat)}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        </article>
    `).join('');
}

// Escape HTML to prevent XSS attacks
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Fetch categories for better display (optional)
async function fetchCategories() {
    try {
        const response = await fetch('http://pantry.local/wp-json/wp/v2/categories?per_page=50');
        if (response.ok) {
            const categories = await response.json();
            const categoryMap = {};
            categories.forEach(cat => {
                categoryMap[cat.id] = cat.name;
            });
            return categoryMap;
        }
    } catch (error) {
        console.warn('Could not fetch categories:', error);
    }
    return {};
}

// Main function to fetch and display news
async function loadNews(page = 1, perPage = 10) {
    showLoading();
    
    try {
        // Build URL with query parameters
        const url = new URL(NEWS_API_URL);
        url.searchParams.append('_embed', 'true'); // Include featured images and author info
        url.searchParams.append('per_page', perPage);
        url.searchParams.append('page', page);
        url.searchParams.append('orderby', 'date');
        url.searchParams.append('order', 'desc');
        
        const response = await fetch(url.toString(), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('News endpoint not found. Please check the API URL.');
            } else if (response.status === 429) {
                throw new Error('Too many requests. Please try again later.');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        
        const posts = await response.json();
        
        // Check if we have posts
        if (posts.length === 0 && page === 1) {
            showNoPosts();
            return;
        }
        
        // Get category names if available
        const categoryMap = await fetchCategories();
        
        // Enhance posts with category names
        const enhancedPosts = posts.map(post => {
            if (post.categories && categoryMap) {
                post.categories = post.categories.map(catId => categoryMap[catId] || `Category ${catId}`);
            }
            return post;
        });
        
        // Render the posts
        renderPosts(enhancedPosts);
        
        // Add pagination if there are more posts
        const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
        if (totalPages > 1) {
            addPagination(page, totalPages);
        }
        
    } catch (error) {
        console.error('Fetch error details:', error);
        
        // Provide more specific error messages
        if (error.message.includes('Failed to fetch')) {
            showError('Cannot connect to WordPress. Please check if http://pantry.local is accessible.');
        } else if (error.message.includes('CORS')) {
            showError('CORS error. Please check WordPress CORS settings.');
        } else {
            showError(error.message || 'Could not load news posts. Please try again later.');
        }
    }
}

// Add pagination controls
function addPagination(currentPage, totalPages) {
    const container = document.getElementById('news-list');
    if (!container) return;
    
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    
    let paginationHtml = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHtml += `<button onclick="loadNews(${currentPage - 1})" class="page-btn prev">← Previous</button>`;
    }
    
    // Page numbers
    paginationHtml += `<span class="page-info">Page ${currentPage} of ${totalPages}</span>`;
    
    // Next button
    if (currentPage < totalPages) {
        paginationHtml += `<button onclick="loadNews(${currentPage + 1})" class="page-btn next">Next →</button>`;
    }
    
    paginationDiv.innerHTML = paginationHtml;
    container.appendChild(paginationDiv);
}

// Retry function for error button
window.retryLoadNews = function() {
    loadNews();
};

// Add search functionality (optional)
function setupSearch() {
    const searchInput = document.getElementById('news-search');
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length >= 2 || searchTerm.length === 0) {
                searchNews(searchTerm);
            }
        }, 500);
    });
}

async function searchNews(searchTerm) {
    showLoading();
    
    try {
        const url = new URL(NEWS_API_URL);
        url.searchParams.append('_embed', 'true');
        url.searchParams.append('per_page', 20);
        url.searchParams.append('orderby', 'date');
        url.searchParams.append('order', 'desc');
        
        if (searchTerm) {
            url.searchParams.append('search', searchTerm);
        }
        
        const response = await fetch(url.toString());
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const posts = await response.json();
        
        if (posts.length === 0) {
            const container = document.getElementById('news-list');
            if (container) {
                container.innerHTML = `<div class="no-results">🔍 No posts found matching "${escapeHtml(searchTerm)}"</div>`;
            }
        } else {
            renderPosts(posts);
        }
        
    } catch (error) {
        console.error('Search error:', error);
        showError('Error searching news. Please try again.');
    }
}

// Initialize the page
function initNewsPage() {
    loadNews();
    setupSearch();
}

// Start loading when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsPage);
} else {
    initNewsPage();
}