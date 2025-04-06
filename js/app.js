// Initialize the Network Map
const networkMap = new NetJSONGraph("data/netjsonmap.json", {
  render: "map",
  switchMode: false,
  clustering: false,
  clusteringThreshold: 50,
  toolbox: { show: false },

  mapOptions: {
    center: [46.8676, 19.676],
    zoom: 5,
    nodeConfig: {
      nodeStyle: {
        radius: 8,
        color: "#3388ff",
        borderColor: "#fff",
      },
      label: {
        offset: [0, -10],
        show: false,
      },
    },
  },

  linkCategories: [
    {
      name: "up",
      linkStyle: { color: "#3acc38", width: 4 },
    },
    {
      name: "down",
      linkStyle: { color: "#c92517", width: 4, dashArray: "5,5" },
    },
  ],

  prepareData: (data) => {
    data.nodes.forEach((node) => {
      node.properties = node.properties || {};
      node.properties.location = node.location;
      node.label = node.name;
    });

    data.links.forEach((link) => {
      link.properties = link.properties || {};
      link.category = link.properties.status || "up";
    });

    return data;
  },

  onReady: function () {
    window.addEventListener("resize", () => {
      this.map?.invalidateSize();
    });

    this.map?.on("click", (e) => {
      console.log("Map clicked at:", e.latlng);
    });
  },

  onClickElement: function (type, data) {
    openIndoorMap(); // Trigger overlay and render floorplan
  },
});

networkMap.render();

function openIndoorMap() {
    const floorplanContainer = document.createElement("div");
    floorplanContainer.id = "floorplan-container";
    floorplanContainer.style.width = "100%";
    floorplanContainer.style.height = "100%";
    floorplanContainer.style.position = "absolute";
    floorplanContainer.style.top = "0";
    floorplanContainer.style.left = "0";
    floorplanContainer.style.zIndex = "10000000";
    document.body.appendChild(floorplanContainer);
  
    const mapContainer = document.createElement("div");
    mapContainer.id = "indoor-map-container";
    mapContainer.style.width = "100%";
    mapContainer.style.height = "100%";
    floorplanContainer.appendChild(mapContainer);
  
    const closeButton = document.createElement("p");
    closeButton.innerText = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10%";
    closeButton.style.right = "20%";
    closeButton.style.fontSize = "20px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontWeight = "bold";
    closeButton.style.zIndex = "10000001";
  
    closeButton.onclick = () => {
      floorplanContainer.remove();
    };
  
    floorplanContainer.appendChild(closeButton);

  const graph = new NetJSONGraph("/data/netjsonmap-indoormap.json", {
    el: "#indoor-map-container",
    render: "map",
    mapOptions: {
      center: [48.577, 18.539],
      zoom: 5.5,
      zoomSnap: 0.3,
      minZoom: 3.5,
      maxZoom: 9,
      nodeConfig: {
        label: {
          offset: [0, -10],
          fontSize: "14px",
          fontWeight: "bold",
          color: "#D9644D",
        },
        animation: false,
      },
      linkConfig: {
        linkStyle: {
          width: 4,
        },
        animation: false,
      },
      baseOptions: {
        media: [
          {
            query: {
              minWidth: 320,
              maxWidth: 850,
            },
            option: {
              tooltip: {
                show: false,
              },
            },
          },
          {
            query: {
              minWidth: 851,
            },
            option: {
              tooltip: {
                show: true,
              },
            },
          },
          {
            query: {
              minWidth: 320,
              maxWidth: 400,
            },
            option: {
              series: [
                {
                  label: {
                    fontSize: "12px",
                  },
                },
              ],
            },
          },
        ],
      },
    },

    prepareData: function (data) {
      data.nodes.forEach((node) => {
        node.label = node.name;
        node.properties = Object.assign(node.properties || {}, {
          location: node.location,
        });
      });
    },

    onReady: function presentIndoormap() {
      const netjsonmap = this.leaflet;

      const image = new Image();
      image.src = "data/floorplan.png";

      image.onload = function () {
        const aspectRatio = image.width / image.height;
        const height = 700;
        const width = aspectRatio * height;

        const southWest = { lat: 53, lng: 2 };
        const swPixel = netjsonmap.latLngToContainerPoint(southWest);
        const nePixel = swPixel.add(new L.Point(width, height));
        const northEast = netjsonmap.containerPointToLatLng(nePixel);

        const bounds = new L.LatLngBounds(southWest, northEast);

        netjsonmap.setMaxBounds(bounds);
        if (netjsonmap.getBoundsZoom(bounds) <= netjsonmap.getMaxZoom()) {
          netjsonmap.setZoom(netjsonmap.getBoundsZoom(bounds));
        }

        L.imageOverlay(image.src, bounds).addTo(netjsonmap);

        netjsonmap.invalidateSize();
        netjsonmap.fitBounds(bounds);
      };
    },
  });

  graph.render();
}
