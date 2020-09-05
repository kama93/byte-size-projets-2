const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// Nasa API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let resultsArray = [];
let favorites = {};

function showContent(){
    window.scrollTo({top: 0, bahaviour: 'instant'});
    loader.classList.add('hidden')
    if(page === 'results'){
        resultsNav.classList.remove('hidden');
        favorites.classList.add('hidden');
    }else{
        resultsNav.classList.add('hidden');
        favorites.classList.remove('hidden');
    }
    
}

function createDOMNodes(page){
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link 
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA picture of the day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results'){
            saveText.textContent = 'Add To Favorite';
            saveText.setAttribute('onclick', `saveFavorites('${result.url}')`);
        }else{
            saveText.textContent = 'Remove Favorite';
            saveText.setAttribute('onclick', `removeFavorites('${result.url}')`);
        }
        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        // Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

function updateDom(page){
    // Get Favorites from localStorage
    if (localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

// Get 10 Images from NASA API
async function getNasaPictures(){
    // Show Loader
    loader.classList.remove('hidden')
    try{
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDom('results');
    }catch(error){
        // Catch Error Here
        console.log(error)
    }
}

// Add result to favorites
function saveFavorites(itemUrl){
    // Loop through Results Array to select Favorite
    resultsArray.forEach((item) =>{
        if(item.url.includes(itemUrl) && !favorites[itemUrl]){   favorites[itemUrl] = item;
            // Show Save Confirmation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() =>{
                saveConfirmed.hidden = true
            }, 2000);
            // Set favorites in localStorage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

// Remove item from favorites
function removeFavorites(itemUrl){
    if(favorites[itemUrl]){
        delete favorites[itemUrl];
         // Remove favorites in localStorage
         localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
         updateDom('favorites');
    }
}

// On Load
getNasaPictures();