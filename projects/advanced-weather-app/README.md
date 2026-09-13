# 🌦️ SkyCast — Advanced Weather Dashboard

A responsive weather dashboard built with **HTML, CSS and JavaScript**, using the **Open-Meteo Forecast API** and **Open-Meteo Geocoding API**.

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

SkyCast uses Open-Meteo's public forecast endpoint for weather data and its geocoding endpoint for city search. The forecast API supports current, hourly and daily weather variables, while the geocoding API resolves location names to coordinates.

## 🧰 Tech Stack

`HTML5` `CSS3` `JavaScript` `Fetch API` `LocalStorage` `Open-Meteo API`

## 🚀 Run

Open `index.html` in a modern browser. For the browser's geolocation feature, serve the folder through a local development server or deploy it to a site using HTTPS.

## 🔐 Security Notes

This project does not require a private weather API key for the selected Open-Meteo endpoints. If a future provider requires credentials, keep them out of source code and use the deployment platform's secret/environment-variable system instead.

## 📌 Project Goal

The goal is to demonstrate a practical API-integrated frontend with real-time data, responsive UI, persistent preferences and useful derived insights — not just a static weather card.

## 📚 API Documentation

- Open-Meteo Forecast API: https://open-meteo.com/en/docs
- Open-Meteo Geocoding API: https://open-meteo.com/en/docs/geocoding-api
