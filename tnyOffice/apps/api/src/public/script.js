// API Base URL
const API_BASE = '/api/v1/files';

// Response display elements
const responseSection = document.getElementById('responseSection');
const statusCode = document.getElementById('statusCode');
const responseTime = document.getElementById('responseTime');
const responseBody = document.getElementById('responseBody');
const filesSection = document.getElementById('filesSection');
const filesList = document.getElementById('filesList');

// API Key elements
const apiKeyInput = document.getElementById('apiKey');
const saveApiKeyBtn = document.getElementById('saveApiKey');
const clearApiKeyBtn = document.getElementById('clearApiKey');
const apiKeyStatus = document.getElementById('apiKeyStatus');

// Store API key in memory (persists during session)
let currentApiKey = localStorage.getItem('tnyoffice_api_key') || '';

// Forms
const createForm = document.getElementById('createForm');
const listForm = document.getElementById('listForm');
const getForm = document.getElementById('getForm');
const updateForm = document.getElementById('updateForm');
const deleteForm = document.getElementById('deleteForm');

// Helper function to show response
function showResponse(status, data, time) {
    responseSection.style.display = 'block';
    statusCode.textContent = `${status} ${getStatusText(status)}`;
    statusCode.className = `status-code ${status < 400 ? 'success' : 'error'}`;
    responseTime.textContent = `${time}ms`;
    responseBody.textContent = JSON.stringify(data, null, 2);
}

// Helper function to get status text
function getStatusText(status) {
    const statusTexts = {
        200: 'OK',
        201: 'Created',
        400: 'Bad Request',
        404: 'Not Found',
        500: 'Internal Server Error'
    };
    return statusTexts[status] || '';
}

// Helper function to make API requests
async function makeRequest(method, url, body = null) {
    const startTime = Date.now();
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // Add API key if set
    if (currentApiKey) {
        options.headers['x-api-key'] = currentApiKey;
    }
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        const endTime = Date.now();
        
        showResponse(response.status, data, endTime - startTime);
        
        // If listing files, also show them in a nice format
        if (method === 'GET' && url.includes(API_BASE) && !url.includes('/') && data.files) {
            showFilesList(data.files);
        }
        
        return { status: response.status, data };
    } catch (error) {
        const endTime = Date.now();
        showResponse(500, { error: error.message }, endTime - startTime);
    }
}

// Show files list
function showFilesList(files) {
    if (!files || files.length === 0) {
        filesSection.style.display = 'none';
        return;
    }
    
    filesSection.style.display = 'block';
    filesList.innerHTML = files.map(file => `
        <div class="file-item">
            <div class="file-info">
                <div class="file-name">${file.filename}</div>
                <div class="file-meta">
                    ${formatBytes(file.size)} • Created ${formatDate(file.createdAt)}
                </div>
            </div>
            <div class="file-id" onclick="copyToClipboard('${file.id}')" title="Click to copy ID">
                ${file.id}
            </div>
        </div>
    `).join('');
}

// Format bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    
    return date.toLocaleDateString();
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show a temporary success message
        const el = event.target;
        const originalText = el.textContent;
        el.textContent = 'Copied!';
        setTimeout(() => {
            el.textContent = originalText;
        }, 1000);
    });
}

// Handle create form submission
createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(createForm);
    const body = {
        filename: formData.get('filename'),
        content: formData.get('content')
    };
    
    const result = await makeRequest('POST', API_BASE, body);
    
    // If successful, clear the form
    if (result && result.status === 201) {
        createForm.reset();
        
        // Also copy the new file ID to clipboard
        if (result.data.id) {
            navigator.clipboard.writeText(result.data.id);
        }
    }
});

// Handle list form submission
listForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(listForm);
    const params = new URLSearchParams({
        limit: formData.get('limit'),
        offset: formData.get('offset')
    });
    
    await makeRequest('GET', `${API_BASE}?${params}`);
});

// Handle get form submission
getForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(getForm);
    const fileId = formData.get('fileId');
    
    await makeRequest('GET', `${API_BASE}/${fileId}`);
});

// Handle update form submission
updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(updateForm);
    const fileId = formData.get('updateFileId');
    
    // Build update body with only provided fields
    const body = {};
    const filename = formData.get('updateFilename');
    const content = formData.get('updateContent');
    
    if (filename) body.filename = filename;
    if (content) body.content = content;
    
    // Check if at least one field is provided
    if (Object.keys(body).length === 0) {
        showResponse(400, { error: 'At least one field (filename or content) must be provided' }, 0);
        return;
    }
    
    const result = await makeRequest('PUT', `${API_BASE}/${fileId}`, body);
    
    // If successful, copy the file ID to clipboard
    if (result && result.status === 200) {
        navigator.clipboard.writeText(fileId);
    }
});

// Handle delete form submission
deleteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(deleteForm);
    const fileId = formData.get('deleteFileId');
    
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete file ${fileId}?`)) {
        return;
    }
    
    const result = await makeRequest('DELETE', `${API_BASE}/${fileId}`);
    
    // If successful, clear the form
    if (result && result.status === 200) {
        deleteForm.reset();
    }
});

// Handle API key management
function updateApiKeyStatus() {
    if (currentApiKey) {
        apiKeyStatus.textContent = 'API key is set';
        apiKeyStatus.classList.add('active');
        apiKeyInput.value = currentApiKey;
    } else {
        apiKeyStatus.textContent = 'No API key set';
        apiKeyStatus.classList.remove('active');
        apiKeyInput.value = '';
    }
}

saveApiKeyBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        currentApiKey = apiKey;
        localStorage.setItem('tnyoffice_api_key', apiKey);
        updateApiKeyStatus();
        // Show success feedback
        const originalText = saveApiKeyBtn.textContent;
        saveApiKeyBtn.textContent = 'Saved!';
        setTimeout(() => {
            saveApiKeyBtn.textContent = originalText;
        }, 1000);
    }
});

clearApiKeyBtn.addEventListener('click', () => {
    currentApiKey = '';
    localStorage.removeItem('tnyoffice_api_key');
    updateApiKeyStatus();
    // Show success feedback
    const originalText = clearApiKeyBtn.textContent;
    clearApiKeyBtn.textContent = 'Cleared!';
    setTimeout(() => {
        clearApiKeyBtn.textContent = originalText;
    }, 1000);
});

// Load initial files list on page load
window.addEventListener('load', () => {
    updateApiKeyStatus();
    listForm.dispatchEvent(new Event('submit'));
});