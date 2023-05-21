
/getting reference of required html elements
const userContainer = document.querySelector(".box1");
const addressContainer = document.querySelector(".box2");
const resultContainer = document.querySelector("#result-container");
const errorMsg = document.querySelector(".error");
const submit = document.querySelector('#submit');

// IIFE function--Immediately Invoking function
//To get CurrentTimezone
(()=>{
if(navigator.geolocation){
    // passing showcurrentTimezone as callback function
    navigator.geolocation.getCurrentPosition(showCurrentTimezone)
} else{
    error.innerHTML=`Geolocation is not supported by this browser`;
}
})()

var APIKey = `1e5c094e31934dd1a100cec951893977`;

function showCurrentTimezone(currentPosition){
    const latitude = currentPosition.coords.latitude;
    const longitude = currentPosition.coords.longitude;

    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${APIKey}`;

    fetch(url)
    .then(response => response.json())
    .then(res => {

        let html = `
            <p class="time-zone">Name of Time Zone: ${res.results[0].timezone.name}</p>
            <div>
                <p class="latitude">Lat: ${res.results[0].lat}</p>
                <p class="longitude">Long: ${res.results[0].lon}</p>
            </div>
            <p class="STD-seconds">Offset STD Seconds: ${res.results[0].timezone.offset_STD_seconds}</p>
            <p class="DST">Offset DST: ${res.results[0].timezone.offset_DST}</p>
            <p class="DST-seconds">offset DST Seconds: ${res.results[0].timezone.offset_DST_seconds}</p>
            <p class="country">Country: ${res.results[0].country}</p>
            <p class="postcode">Postcode: ${res.results[0].postcode}</p>
            <p class="city">City: ${res.results[0].city}</p>
    `;

    userContainer.innerHTML = html;

    })
    .catch(err => resultContainer.style.display = err);
}


function fetchDetailsByAddress(){
    let address = document.querySelector(".address").value;

    // Address validation here..
    if (address.trim() === "") {
        errorMsg.innerHTML = "Please Enter City name";
        resultContainer.style.display = 'none';
        address= "";
        return;
    }
    if (!validateAddress(address)) {
        errorMsg.innerHTML = "Please Enter a valid Address";
        resultContainer.style.display = 'none';
        address = "";
        return;
    }

    // Convert address to coordinates using geocoding API
    const geocodingUrl = `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${APIKey}`;

    fetch(geocodingUrl)
        .then(response => response.json())
        .then(res => {

            const latitude = res.features[0].properties.lat;
            const longitude = res.features[0].properties.lon;

            const timezoneUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${APIKey}`;

            fetch(timezoneUrl)
                .then(response => response.json())
                .then(res => {

                    resultContainer.style.display = 'block';
                    resultContainer.style.marginTop="20px"
                    resultContainer.style.border = "2px solid white"
                    errorMsg.innerHTML = "";
                    address = "";

                    let html = `
                    <p class="time-zone">Name of Time Zone: ${res.results[0].timezone.name}</p>
                    <div>
                        <p class="latitude">Lat: ${res.results[0].lat}</p>
                        <p class="longitude">Long: ${res.results[0].lon}</p>
                    </div>
                    <p class="STD-seconds">Offset STD Seconds: ${res.results[0].timezone.offset_STD_seconds}</p>
                    <p class="DST">Offset DST: ${res.results[0].timezone.offset_DST}</p>
                    <p class="DST-seconds">offset DST Seconds: ${res.results[0].timezone.offset_DST_seconds}</p>
                    <p class="country">Country: ${res.results[0].country}</p>
                    <p class="postcode">Postcode: ${res.results[0].postcode}</p>
                    <p class="city">City: ${res.results[0].city}</p>
                `;
                addressContainer.innerHTML=html;
            })
            .catch(() => {
                // Display the error message for timezone retrieval
                errorMsg.textContent = 'Error retrieving timezone.';
                resultContainer.style.display = 'none';
                address= "";
            });
        })
        .catch(() => {
            resultContainer.style.display = 'none';
            errorMsg.innerHTML = `An error occurred while geocoding the address: Please Enter Valid City`;
            address= "";
        });
}

function validateAddress(address) {
    var addressPattern = /^[a-zA-Z0-9\s\.,#'-]+$/;
    if (addressPattern.test(address)) {
        return true;
    } else {
        return false;
    }
}


submit.addEventListener('click', fetchDetailsByAddress);
