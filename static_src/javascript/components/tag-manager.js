function sendTagManagerEvents() {
    var eventsNode = document.getElementById('tag_manager_events');
    if (eventsNode) {
        window.dataLayer = window.dataLayer || [];
        JSON.parse(eventsNode.textContent).map((event) =>
            window.dataLayer.push(event),
        );
    }
}

export default sendTagManagerEvents;
