const quoteContainer=document.getElementById('quote-container');
const quoteText=document.getElementById('quote');
const authorText=document.getElementById('author');
const twitterBtn=document.getElementById('twitter');
const newQuoteBtn=document.getElementById('new-quote');
const loader = document.getElementById('loader')


// Show loader
function loading(){
    loader.hidden= false;
    quoteContainer.hidden= true;
}

// Hiden loader
function complete(){
    if(!loader.hidden)
    {loader.hidden= true;
    quoteContainer.hidden= false;}
}

// Get Quote from API
async function getQuote(){
    loading();
    const proxyUrl='https://cors-anywhere.herokuapp.com/'
    const apiUrl='http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
        const response=await fetch(proxyUrl+apiUrl);
        const data= await response.json();
        if (data.quoteAuthor === ''){
            authorText.innertext='Unknown'
        }else{
            authorText.innerText=data.quoteAuthor
        }
        if (data.quoteText.length > 120){
            quoteText.classList.add('long-quote')
        }else{
            quoteText.innerText=data.quoteText
        }
        quoteText.innerText=data.quoteText;
        complete();
    }catch(error){
        getQuote;
    }
}

// Tweet Quote
function tweetQuote(){
    const quote =quoteText.innerText;
    const author= authorText.innerText;
    const twitterUrl= `https://twitter.com/intent/tweet?text=${quote} - ${author}`
    window.open(twitterUrl, 'blank');
}

// Event Listener
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote)

// On load
getQuote();
