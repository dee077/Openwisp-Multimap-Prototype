// Initialize the Main Network Map
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
      { name: "up", linkStyle: { color: "#3acc38", width: 4 } },
      { name: "down", linkStyle: { color: "#c92517", width: 4, dashArray: "5,5" } },
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
  
    onReady() {
      window.addEventListener("resize", () => this.map?.invalidateSize());
      this.map?.on("click", (e) => console.log("Map clicked at:", e.latlng));
    },
  
    onClickElement(type, data) {
      openIndoorMap();
    },
  });
  
  networkMap.render();
  
  // Open Indoor Map Overlay
  function openIndoorMap() {
    const floorplanContainer = createOverlayContainer("floorplan-container");
    const mapContainer = createOverlayContainer("indoor-map-container", floorplanContainer);
    const closeButton = createCloseButton(() => floorplanContainer.remove());
  
    floorplanContainer.appendChild(closeButton);
    document.body.appendChild(floorplanContainer);
  
    const graph = new NetJSONGraph("data/netjsonmap-indoormap.json", {
      el: "#indoor-map-container",
      render: "map",
      mapOptions: {
        center: [0, 0],
        zoom: 1,
        zoomSnap: 0.3,
        crs: L.CRS.Simple, // Ideal for static images like floorplans
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
          linkStyle: { width: 4 },
          animation: false,
        },
      },
  
      prepareData(data) {
        data.nodes.forEach((node) => {
          node.label = node.name;
          node.properties = { ...node.properties, location: node.location };
        });
      },
  
      onReady() {
        const map = this.leaflet;
        const imageUrl = "data/floorplan.png";
        const image = new Image();
  
        image.onload = () => {
          const width = image.width;
          const height = image.height;
          const bounds = [[0, 0], [height, width]];
  
          L.imageOverlay(imageUrl, bounds).addTo(map);
          map.setMaxBounds(bounds);
          map.fitBounds(bounds);
          map.invalidateSize();
        };
  
        image.onerror = () => {
          alert("Failed to load floorplan image.");
          floorplanContainer.remove();
        };
  
        image.src = imageUrl;
      },
    });
  
    graph.render();
  }
  
  // Creates a full-screen div for map or container
  function createOverlayContainer(id, parent = document.body) {
    const div = document.createElement("div");
    div.id = id;
    Object.assign(div.style, {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: "0",
      left: "0",
      zIndex: "10000000",
    });
    parent.appendChild(div);
    return div;
  }
  
  //  Creates close ("X") button
  function createCloseButton(onClick) {
    const btn = document.createElement("p");
    btn.innerText = "✖";
    Object.assign(btn.style, {
      position: "absolute",
      top: "10px",
      right: "20px",
      fontSize: "22px",
      cursor: "pointer",
      fontWeight: "bold",
      color: "#000",
      zIndex: "10000001",
      background: "#fff",
      padding: "4px 8px",
      borderRadius: "4px",
    });
    btn.onclick = onClick;
    return btn;
  }
  