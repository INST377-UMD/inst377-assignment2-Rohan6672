// Global variables
let stockChart = null;
// Note: You need to sign up for a free Polygon.io API key and replace this placeholder
// Get your API key from: https://polygon.io/
const API_KEY = 'REPLACE_WITH_YOUR_FREE_API_KEY'; // Replace with your Polygon.io API key

// Main event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up the lookup button
    setupStockLookup();
    
    // Fetch Reddit stocks data
    fetchRedditStocks();
});

// Set up stock lookup functionality
function setupStockLookup() {
    const lookupBtn = document.getElementById('lookupBtn');
    
    lookupBtn.addEventListener('click', function() {
        const ticker = document.getElementById('ticker').value.trim().toUpperCase();
        const timeRange = document.getElementById('timeRange').value;
        
        if (ticker) {
            fetchStockData(ticker, timeRange);
        } else {
            alert('Please enter a stock ticker symbol');
        }
    });
}

// Fetch stock data from Polygon.io API
function fetchStockData(ticker, days) {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    
    // Create URL for API request
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formattedStartDate}/${formattedEndDate}?apiKey=${API_KEY}`;
    
    // Show loading state
    document.getElementById('stockTitle').textContent = `Loading data for ${ticker}...`;
    document.getElementById('chartSection').style.display = 'block';
    
    // Fetch data
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.resultsCount > 0) {
                displayStockChart(ticker, data.results);
            } else {
                alert('No data available for the selected ticker and time range');
            }
        })
        .catch(error => {
            console.error('Error fetching stock data:', error);
            alert('Failed to fetch stock data. Please check your ticker symbol and try again.');
        });
}

// Display stock chart using Chart.js
function displayStockChart(ticker, stockData) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    // Format data for Chart.js
    const labels = [];
    const prices = [];
    
    stockData.forEach(data => {
        // Convert timestamp (ms) to date
        const date = new Date(data.t);
        labels.push(formatDate(date));
        
        // Use closing price (c)
        prices.push(data.c);
    });
    
    // Destroy previous chart if it exists
    if (stockChart !== null) {
        stockChart.destroy();
    }
    
    // Create new chart
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${ticker} Stock Price`,
                data: prices,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Price ($)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
    
    // Update chart title
    document.getElementById('stockTitle').textContent = `${ticker} Stock Data`;
}

// Fetch top Reddit-mentioned stocks
function fetchRedditStocks() {
    const url = 'https://tradestie.com/api/v1/apps/reddit';
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Display only top 5 stocks
            displayRedditStocks(data.slice(0, 5));
        })
        .catch(error => {
            console.error('Error fetching Reddit stocks:', error);
            document.querySelector('#redditStocks tbody').innerHTML = 
                '<tr><td colspan="3">Failed to load Reddit stocks data. Please try again later.</td></tr>';
        });
}

// Display Reddit stocks in a table
function displayRedditStocks(stocks) {
    const tableBody = document.querySelector('#redditStocks tbody');
    tableBody.innerHTML = '';
    
    stocks.forEach(stock => {
        const row = document.createElement('tr');
        
        // Ticker with link to Yahoo Finance
        const tickerCell = document.createElement('td');
        const tickerLink = document.createElement('a');
        tickerLink.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
        tickerLink.textContent = stock.ticker;
        tickerLink.target = '_blank';
        tickerCell.appendChild(tickerLink);
        
        // Comment count
        const commentCell = document.createElement('td');
        commentCell.textContent = stock.no_of_comments;
        
        // Sentiment with icon
        const sentimentCell = document.createElement('td');
        const sentimentIcon = document.createElement('span');
        
        if (stock.sentiment === 'Bullish') {
            sentimentIcon.className = 'bullish-icon';
        } else {
            sentimentIcon.className = 'bearish-icon';
        }
        
        sentimentCell.appendChild(sentimentIcon);
        sentimentCell.appendChild(document.createTextNode(` ${stock.sentiment}`));
        
        // Add cells to row
        row.appendChild(tickerCell);
        row.appendChild(commentCell);
        row.appendChild(sentimentCell);
        
        // Add row to table
        tableBody.appendChild(row);
    });
}

// Get page-specific voice commands
function getPageSpecificCommands() {
    return {
        'lookup *ticker': function(ticker) {
            ticker = ticker.toUpperCase();
            document.getElementById('ticker').value = ticker;
            fetchStockData(ticker, 30); // Default to 30 days
        }
    };
}