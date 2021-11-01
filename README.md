# TIoS Web Application

This is the main repo for TIoS Web Application

Click here for [TIoS API repo](https://github.com/luiscolmenares/TiOS-api)

For source code of Mobile App (React), reach out directly.

TIoS is a tool designed for administrators of internet connected organizations. It is a computerized system for the management of organizations and their IoT projects.
Organization Projects will display a set of graphs and reports based on data pulled from a restful API. This data comes from devices(sensors) connected to the cloud directly to a Mysql Database and serve to the application using API endpoints.

## Main Features:

- Administration of organizations

- Administrations of projects

- Administration of users

- Projects Dashboard

- Organizations Dashboard

- Triggers

- Scheduled Actions

- Geolocation 

## Installation

Steps:
Clone the project to your local
```
cd TiOS-webapp
npm install
```

After bringing all dependencies, edit the file src/assets/js/app.js :
Uncomment local urls and comment prod urls

```

App.constant('urls', {
//Local
// BASE_API_SERVER: 'http://127.0.0.1:5000/',
// BASE_API: 'http://127.0.0.1:5000/api/',
// BASE_NR: 'http://127.0.0.1:1880',
// MQTT_BROKER: 'mqtt.tiosplatform.com',
// MQTT_BROKER_PORT: 9001,

```
```
//prod
BASE_API_SERVER: 'https://api.tiosplatform.com/',
BASE_API: 'https://api.tiosplatform.com/api/',
BASE_NR: 'https://node-red.tiosplatform.com:1080',
MQTT_BROKER: 'mqtt.tiosplatform.com',
MQTT_BROKER_PORT: 9001,
```

Run local web server using ‘grunt’

Localhost web app should be available at http://localhost:8080

Requirements
- [TIos API](https://github.com/luiscolmenares/TiOS-api/)
- [MQTT Server](https://mosquitto.org/) 
- [Node Red Instance](https://nodered.org/)


