export function toggleLeaderboard(button) {
    if (!button) {
        return;
    }

    const hiddenRows = document.querySelectorAll(
        '[data-leaderboard-hidden-row]',
    );
    const speed = 50;

    button.addEventListener('click', () => {
        let promise = Promise.resolve();

        hiddenRows.forEach((row) => {
            promise = promise.then(() => {
                row.classList.add('display');

                setTimeout(() => {
                    row.classList.add('opacity');
                }, speed);

                return new Promise((resolve) => {
                    setTimeout(resolve, speed);
                });
            });
        });

        promise.then(() => {
            button.remove();
        });
    });
}
