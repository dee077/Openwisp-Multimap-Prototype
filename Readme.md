# 🗺️ OpenWISP MultiMap Prototype

[Live Deno](https://openwisp-multimap-prototype-m9rptmr07-dee777s-projects.vercel.app)

![Screenshot]('/data/ss.png')

This is a prototype to demonstrate how to render both a **geo map** and an **indoor floorplan overlay** using [NetJSONGraph](https://github.com/openwisp/netjsongraph). It is part of a GSoC idea to `Improve Openwisp the general map`. Supporting multi-view network visualizations.

## 🌐 Overview

- By default, only the geographical (geo) map is rendered in OpenWISP Monitoring. This solution extends the functionality by enabling support for multiple indoor floorplan views alongside the existing geo map.

- The idea is to allow each network node to optionally link to an indoor map view—displayed as a floorplan overlay—on a dedicated map page. This approach lays the groundwork for implementing the Figma design proposed for OpenWISP Monitoring.
 
- This showcases how both global and localized (indoor) visualizations can coexist in the same UI.
The logic for toggling and rendering the indoor map overlay is implemented in `js/app.js`

## Run App

App can be run just by opening the `index.html` file.
