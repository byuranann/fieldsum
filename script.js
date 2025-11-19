// Replace with your Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzteh_H5lRJY8uDEKjGsu4vedFYUmws_bNI7mmfuuMAT5om7jHmgcRBs6vsQKzsr7HC0Q/exec';

// DOM Elements
const form = document.getElementById('dataForm');
const saveBtn = document.getElementById('saveBtn');
const statusMessage = document.getElementById('statusMessage');
const totalEntriesEl = document.getElementById('totalEntries');

// Fetch total entries on page load
async function fetchTotalEntries() {
    try {
        const response = await fetch(`${SCRIPT_URL}?mode=info`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        totalEntriesEl.textContent = data.totalSum || 0;
    } catch (error) {
        console.error('Error fetching total entries:', error);
        totalEntriesEl.textContent = 'Error';
    }
}

// Show status message
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 5000);
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const category = document.getElementById('category').value;
    const priority = document.getElementById('priority').value;
    const status = document.getElementById('status').value;
    
    // Validate all fields are selected
    if (!category || !priority || !status) {
        showStatus('Please select all fields', 'error');
        return;
    }
    
    // Prepare data
    const formData = {
        category: category,
        priority: priority,
        status: status,
        timestamp: new Date().toISOString()
    };
    
    // Disable button during submission
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save data');
        }
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showStatus('Saved successfully!', 'success');
            form.reset();
            
            // Refresh total entries
            fetchTotalEntries();
        } else {
            throw new Error(result.message || 'Save failed');
        }
    } catch (error) {
        console.error('Error saving data:', error);
        showStatus('Error saving data. Please try again.', 'error');
    } finally {
        // Re-enable button
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchTotalEntries();
});