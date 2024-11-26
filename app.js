// Initialize the API Gateway client
const apigClient = apigClientFactory.newClient();

// Search Photos
document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('search-query').value;
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = "Loading...";

    try {
        const params = { query };
        const response = await apigClient.searchGet(params, {}, {});
        const photos = response.data.photos;

        resultsContainer.innerHTML = '';
        if (photos && photos.length > 0) {
            photos.forEach(photo => {
                const img = document.createElement('img');
                img.src = photo.url;
                resultsContainer.appendChild(img);
            });
        } else {
            resultsContainer.innerHTML = "No results found.";
        }
    } catch (error) {
        console.error("Error fetching search results:", error);
        resultsContainer.innerHTML = "Error fetching results.";
    }
});

// Upload Photo
document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('photo-file');
    const customLabelsInput = document.getElementById('custom-labels');
    const uploadStatus = document.getElementById('upload-status');

    if (!fileInput.files[0]) {
        uploadStatus.textContent = "Please select a photo.";
        return;
    }

    const file = fileInput.files[0];
    const customLabels = customLabelsInput.value.split(',').map(label => label.trim()).join(',');

    const reader = new FileReader();
    reader.onload = async () => {
        const body = reader.result;
        const params = {};
        const additionalParams = {
            headers: {
                'x-amz-meta-customLabels': customLabels,
                'Content-Type': file.type
            }
        };

        try {
            await apigClient.photosPut(params, body, additionalParams);
            uploadStatus.textContent = "Photo uploaded successfully!";
            fileInput.value = "";
            customLabelsInput.value = "";
        } catch (error) {
            console.error("Error uploading photo:", error);
            uploadStatus.textContent = "Error uploading photo.";
        }
    };
    reader.readAsArrayBuffer(file);
});
