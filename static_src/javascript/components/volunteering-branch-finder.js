document.addEventListener('DOMContentLoaded', function () {
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
    const branchElements = Array.from(
        document.querySelectorAll('[data-branch]'),
    );
    const resultsHeading = document.querySelector(
        '[data-branches-results-heading]',
    );

    const NUM_CLOSEST_BRANCH_TO_SHOW = 5;
    const MAX_BRANCH_TO_SHOW = 10;

    // focus input on page load
    branchInput.focus();

    // listen for the form submit
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        init(branchInput.value);
    });

    function init(query) {
        const geocoder = new google.maps.Geocoder(); // eslint-disable-line no-undef

        if (query.length) {
            geocoder.geocode(
                {
                    address: query + ', Western Europe', // Append to better limit the search area,
                    bounds: {
                        north: 61.058285,
                        east: 1.977539,
                        south: 49.822037,
                        west: -10.942383,
                    }, // eslint-disable-line no-undef
                },
                function (results, status) {
                    resetUI();
                    if (status === 'OK') {
                        resultsHeading.hidden = false;
                        findBestBranchMatches(
                            results[0],
                            query.trim().toLowerCase(),
                        );
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

    // Finds the branches that matches the best a user's query.
    // Branch with the `where_we_work` field matching the query are prioritized.
    // After that, branches are sorted by distance and the nearest ones are returned.
    function findBestBranchMatches(place, normalizedQuery) {
        let promotedResultsCount = 0;

        const branchesWithDistanceAndPriority = branches.map((branch) => {
            const branchLatlng = new google.maps.LatLng(...branch.latlng); // eslint-disable-line no-undef
            // eslint-disable-next-line no-undef
            branch.distance =
                google.maps.geometry.spherical.computeDistanceBetween(
                    place.geometry.location,
                    branchLatlng,
                );

            if (
                branch.where_we_work &&
                branch.where_we_work.toLowerCase().includes(normalizedQuery)
            ) {
                branch.prioritized = true;
                promotedResultsCount += 1;
            } else {
                branch.prioritized = false;
            }
            return branch;
        });

        branchesWithDistanceAndPriority.sort((next, prev) => {
            // If the branches have the same priority, compare their distance.
            if (next.prioritized === prev.prioritized) {
                return next.distance - prev.distance;
            }

            // Otherwise, return the most prioritized one.
            return next.prioritized ? -1 : 1;
        });

        // Show promoted results and `NUM_CLOSEST_BRANCH_TO_SHOW` closest branches
        const numBranchToShow =
            promotedResultsCount + NUM_CLOSEST_BRANCH_TO_SHOW;
        const bestBranchMatches = branchesWithDistanceAndPriority.slice(
            0,
            // Limit results when we have more than `MAX_BRANCH_TO_SHOW` matches.
            numBranchToShow <= MAX_BRANCH_TO_SHOW
                ? numBranchToShow
                : MAX_BRANCH_TO_SHOW,
        );
        showBestBranchMatches(bestBranchMatches);
    }

    function showBestBranchMatches(bestBranchMatches) {
        bestBranchMatches.forEach((branch, index) => {
            const match = document.querySelector(
                `[data-branch-id=${branch.branch_id}]`,
            );
            if (!match) {
                return;
            }
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
