# 🌦️ SKH Cast+ — Advanced Weather Dashboard

**SKH Cast+** is a responsive weather intelligence dashboard built with **HTML, CSS and JavaScript**, using the **Open-Meteo Forecast API** and **Open-Meteo Geocoding API**.

## ✨ Features

- 🔎 City and postal-code search with live location suggestions
- 📍 Browser geolocation support
- 🌡️ Live current temperature and feels-like temperature
- 💧 Humidity, wind, visibility, pressure, UV and cloud-cover metrics
- 🕐 12-hour forecast view
- 📅 7-day forecast
- 🌅 Sunrise/sunset progress indicator
- 💡 Smart weather insights for temperature, rain, UV, wind, cloud and humidity
- ⭐ Save up to 6 favorite locations with LocalStorage
- 🌙 Dark/light theme persistence
- °C / °F switching
- 📱 Responsive mobile-first layout
- 🛡️ No weather API key is hard-coded into the client

## 🔌 API Integration

SKH Cast+ uses Open-Meteo's public forecast endpoint for weather data and its geocoding endpoint for city search. The forecast API provides current, hourly and daily weather variables, while the geocoding API resolves location names to coordinates.

## 🧰 Tech Stack

`HTML5` `CSS3` `JavaScript` `Fetch API` `LocalStorage` `Open-Meteo API`

## 🚀 Run

Open `index.html` in a modern browser. For the browser's geolocation feature, serve the folder through a local development server or deploy it to a site using HTTPS.

## 🔐 Security Notes

This project does not require a private weather API key for the selected Open-Meteo endpoints. If a future provider requires credentials, keep them out of source code and use the deployment platform's secret/environment-variable system instead.

## 📌 Project Goal

The goal is to demonstrate a practical API-integrated frontend with live data, responsive UI, persistent preferences and useful derived insights — not just a static weather card.

## 📚 API Documentation

- Open-Meteo Forecast API: https://open-meteo.com/en/docs
- Open-Meteo Geocoding API: https://open-meteo.com/en/docs/geocoding-api

## Engineering Evidence

**Architecture:** Search/geolocation → Open-Meteo geocoding → coordinates → forecast API → client-side weather model → responsive UI.

**Validation:** Repository CI checks JavaScript syntax and parses tracked HTML documents. The project README documents the HTTPS requirement for browser geolocation.

**Security boundary:** No private API credential is required for the selected Open-Meteo endpoints. Future credentialed providers must use deployment secrets rather than client-side source code.

**Live preview:** `/skycast/` when published through the repository's GitHub Pages deployment.

## Verification Checklist

- City/postal-code search
- Location suggestions
- Browser geolocation
- Current/hourly/daily forecast rendering
- Unit switching
- Favorites persistence
- Theme persistence
- API error handling
- Responsive layout
