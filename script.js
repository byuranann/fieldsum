// Replace with your Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwhufm59PpbxzX2oDnmKzyJVhifmve4m8PXDJPueYoXfDAYcqm7dQjPMU7LNCIn6g9ykg/exec';

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
        totalEntriesEl.textContent = data.totalEntries || 0;
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
    
    // Validate all fields are filled
    if (!category || !priority || !status) {
        showStatus('กรุณากรอกข้อมูลให้ครบทุกช่อง', 'error');
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
    saveBtn.textContent = 'กำลังบันทึก...';
    
    try {
        console.log('Sending data:', formData);
        
        // Use a simpler approach with fetch
        const response = await fetch(SCRIPT_URL, {
            redirect: 'follow',
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        console.log('Response:', result);
        
        if (result.status === 'success') {
            showStatus('บันทึกสำเร็จ!', 'success');
            form.reset();
            
            // Refresh total entries after delay
            setTimeout(() => {
                fetchTotalEntries();
            }, 1000);
        } else {
            throw new Error(result.message || 'Save failed');
        }
        
    } catch (error) {
        console.error('Error details:', error);
        showStatus('เกิดข้อผิดพลาด: ' + error.message, 'error');
    } finally {
        // Re-enable button
        saveBtn.disabled = false;
        saveBtn.textContent = 'บันทึก';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchTotalEntries();
});
