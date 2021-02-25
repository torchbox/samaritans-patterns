document.addEventListener('DOMContentLoaded', function () {

    if (!document.getElementById('branch-form')) {
        // We're not on the branch listing page
        return;
    }

    // assign variables
    let branchMap;
    const form = document.getElementById('branch-form');
    const branchInput = document.getElementById('branch-input');
    const branchList = document.getElementById('branch-list');
    const branchMapCanvas = document.getElementById('branch-finder-map');
    const branches = JSON.parse(document.getElementById('branches_json').textContent).branches;

    // listen for the form submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        init(branchInput.value);
    });

    function init(query) {
        const geocoder = new google.maps.Geocoder(); // eslint-disable-line no-undef

        if (query.length) {
            geocoder.geocode({
                'address': query,
                'region': '155', // Western Europe
                'bounds': {north: 61.058285, east: 1.977539, south: 49.822037, west: -10.942383} // eslint-disable-line no-undef
            }, function (results, status) {
                if (status === 'OK') {
                    setMap();
                    setBaseMarker(results[0]);
                } else if (status === 'ZERO_RESULTS') {
                    branchList.innerHTML = `<p>Sorry, we didn't find anything for <b>${query}</b>.<br> Please try searching again.</p>`;
                    resetMap();
                } else {
                    branchList.innerHTML = '<p>There was a problem trying to find a branch. Please try again later.</p>';
                    resetMap();
                }
            });
        }
    }

    // set the map up
    function setMap() {
        const mapOptions = {
            mapTypeId: google.maps.MapTypeId.ROADMAP, // eslint-disable-line no-undef
            panControl: false,
            gestureHandling: 'greedy',
            zoom: 8
        };

        branchMap = new google.maps.Map(branchMapCanvas, mapOptions); // eslint-disable-line no-undef
    }

    function resetMap() {
        branchMapCanvas.innerHTML = '';
    }

    // create markers for other branches
    function setBranchMarkers(branch) {
        const branchLatlng = new google.maps.LatLng(branch.latlng[0], branch.latlng[1]); // eslint-disable-line no-undef
        const marker = new google.maps.Marker({ // eslint-disable-line no-undef
            position: branchLatlng,
            icon: '/static/images/map-marker.png',
        });
        marker.setMap(branchMap);
    }

    // set base marker
    function setBaseMarker(place) {
        const marker = new google.maps.Marker({ // eslint-disable-line no-undef
            branchMap,
            position: place.geometry.location,
        });

        marker.setMap(branchMap);
        addDistance(place);
    }

    // add distance between searched location and list of branches
    function addDistance(place) {
        const distance = branches.map(branch => {
            const branchLatlng = new google.maps.LatLng(...branch.latlng); // eslint-disable-line no-undef
            branch.distance = google.maps.geometry.spherical.computeDistanceBetween(place.geometry.location, branchLatlng); // eslint-disable-line no-undef
            return branch;
        });

        distance.sort((next, prev) => next.distance - prev.distance);
        calcClosestBranches(distance);
    }

    // find the closest five branches
    function calcClosestBranches(distance) {
        const closestFiveBranches = distance.slice(0, 5);
        const closestBranchLat = closestFiveBranches[0].latlng[0];
        const closestBranchLong = closestFiveBranches[0].latlng[1];

        branchMap.setCenter(new google.maps.LatLng(closestBranchLat, closestBranchLong)); // eslint-disable-line no-undef
        closestFiveBranches.map(branch => setBranchMarkers(branch));
        addToList(closestFiveBranches);
    }

    // add the branches markup
    function addToList(closestFiveBranches) {
        const markup = `
            <ul class="news-list">
                <p class="intro intro--less-margin">Your nearest branches are:</p>
                ${closestFiveBranches.map(branch => `
                    <li>
                        <a href="${branch.url}" class="listing-item listing-item--website">
                            <div class="listing-item__content">
                                <h2 class="listing-item__title">${branch.name}</h2>
                                <p class="listing-item__summary">
                                    ${branch.street_address_1 ? `${branch.street_address_1},` : ''}
                                    ${branch.street_address_2 ? `${branch.street_address_2},` : ''}
                                    ${branch.city}
                                    ${branch.region ? `${branch.region}` : ''}
                                    ${branch.postcode}
                                </p>
                                <ul class="list-inline-bulleted">
                                    <li class="list-inline-bulleted__item">Distance: ${getMiles(branch.distance)}m</li>
                                    ${branch.wheelchair_accessible ? '<li class="list-inline-bulleted__item">Wheelchair accessible</li>' : ''}
                                    ${branch.welsh_speaking ? '<li class="list-inline-bulleted__item">Welsh speakers</li>' : ''}
                                </ul>
                            </div>
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;

        branchList.innerHTML = markup;
    }

    function getMiles(i) {
        const miles = i * 0.000621371192;
        return Math.round(miles * 10) / 10;
    }
});
