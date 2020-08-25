document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('volunteering-branch-form')) {
        // We're not on the volunteering branch listing page
        return;
    }

    const hiddenClass = 'is-hidden';
    const form = document.getElementById('volunteering-branch-form');
    const branchInput = document.getElementById('branch-input');
    const helpText = document.getElementById('search-help-text');
    const branches = JSON.parse(
        document.getElementById('branches_json').textContent,
    ).branches;
    const branchElements = Array.from(document.querySelectorAll('[data-branch]'));
    const resultsHeading = document.querySelector(
        '[data-branches-results-heading]',
    );

    // focus input on page load
    branchInput.focus();

    // listen for the form submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        init(branchInput.value);
    });

    function init(query) {
        const geocoder = new google.maps.Geocoder(); // eslint-disable-line no-undef

        if (query.length) {
            geocoder.geocode(
                {
                    address: query,
                    region: 'GB',
                },
                function(results, status) {
                    resetUI();
                    if (status === 'OK') {
                        resultsHeading.hidden = false;
                        addDistance(results[0]);
                    } else if (status === 'ZERO_RESULTS') {
                        helpText.innerHTML = `<p>Sorry, we didn't find anything for <b>${query}</b>.<br> Please try searching again.</p>`;
                    } else {
                        helpText.innerHTML =
                            '<p>There was a problem trying to find a branch. Please try again later.</p>';
                    }
                },
            );
        }
    }

    // add distance between searched location and list of branches
    function addDistance(place) {
        const distance = branches.map((branch) => {
            const branchLatlng = new google.maps.LatLng(...branch.latlng); // eslint-disable-line no-undef
            // eslint-disable-next-line no-undef
            branch.distance = google.maps.geometry.spherical.computeDistanceBetween(
                place.geometry.location,
                branchLatlng,
            );
            return branch;
        });

        distance.sort((next, prev) => next.distance - prev.distance);
        calcClosestBranches(distance);
    }

    // find the closest five branches
    function calcClosestBranches(distance) {
        const closestFiveBranches = distance.slice(0, 5);
        showClosestBranches(closestFiveBranches);
    }

    // show them
    function showClosestBranches(closestFiveBranches) {
        closestFiveBranches.forEach((branch, index) => {
            const match = document.querySelector(
                `[data-branch-id=${branch.branch_id}]`,
            );
            match.classList.remove(hiddenClass);
            match.style.order = index;
        });
    }

    function resetUI() {
        helpText.innerHTML = '';

        branchElements.forEach((el) => {
            el.classList.add(hiddenClass);
            el.style.order = '';
        });
    }
});
