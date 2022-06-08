class GoogleMap {
    static selector() {
        return '.js-map';
    }

    constructor(node) {
        this.node = node;
        this.location = {
            lat: parseFloat(this.node.dataset.latitude),
            lng: parseFloat(this.node.dataset.longitude),
        };
        this.zoom = parseInt(this.node.dataset.zoomLevel);

        // populated in mapLoad();
        this.googleMap = null;
        this.marker = null;

        this.mapLoad();
    }

    mapLoad() {
        this.googleMap = new google.maps.Map(this.node, {
            // eslint-disable-line no-undef
            zoom: this.zoom,
            scrollwheel: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            center: this.location,
        });
        this.marker = new google.maps.Marker({
            // eslint-disable-line no-undef
            position: this.location,
            map: this.googleMap,
        });
    }
}

export default GoogleMap;
