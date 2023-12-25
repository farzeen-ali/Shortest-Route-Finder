var map = L.map('map', {
    center: [30.3753, 69.3451],
    zoom: 6
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
    foo: 'bar',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Get user's current location and set the initial marker
map.locate({ setView: true, maxZoom: 16 });

var initialMarker;

// Handle location found event
function onLocationFound(e) {
    var latlng = e.latlng;
    initialMarker = L.marker(latlng).addTo(map);
}

// Handle location error event
function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// Add click event listener
map.on('click', function (e) {
    var secondMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    L.Routing.control({
        waypoints: [
            L.latLng(initialMarker.getLatLng()), // Use the initial marker's location
            L.latLng(e.latlng.lat, e.latlng.lng)
        ]
    }).addTo(map);
});


function onLocationFound(e) {
    var latlng = e.latlng;
    initialMarker = L.marker(latlng).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

var graph = {}; // Define the graph

map.on('click', function (e) {
    var secondMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);

    if (initialMarker) {
        var start = initialMarker.getLatLng();
        var goal = e.latlng;

        // Perform UCS
        var path = ucs(graph, start, goal);

        // Draw the path
        if (path) {
            var latlngs = path.map(node => [node.lat, node.lng]);
            L.polyline(latlngs, { color: 'red' }).addTo(map);
        }
    }
});

function ucs(graph, start, goal) {
    var frontier = new PriorityQueue();
    frontier.enqueue({ path: [start], cost: 0 });

    while (!frontier.isEmpty()) {
        var { path, cost } = frontier.dequeue();
        var current = path[path.length - 1];

        if (current.equals(goal)) {
            return path;
        }

        for (var neighbor in graph[current]) {
            var newPath = [...path, neighbor];
            var newCost = cost + graph[current][neighbor];
            frontier.enqueue({ path: newPath, cost: newCost });
        }
    }

    return null; // No path found
}
function distance(p1, p2) {
    return initialMarker.getLatLng().distanceTo(L.latLng(p1.lat, p1.lng));
}

function PriorityQueue() {
    this.elements = [];
}

PriorityQueue.prototype.enqueue = function (element) {
    this.elements.push(element);
    this.elements.sort((a, b) => a.cost - b.cost);
};

PriorityQueue.prototype.dequeue = function () {
    return this.elements.shift();
};

PriorityQueue.prototype.isEmpty = function () {
    return this.elements.length === 0;
};