# TIoS-webapp

# Related files

TIoS is a tool designed for administrators of internet connected organizations. It is a computerized system for the management of organizations and their IoT projects.
Organization Projects will display a set of graphs and reports based on data pulled from a restful API. This data comes from devices(sensors) connected to the cloud directly to a Mysql Database and serve to the application using API endpoints.

## Main Features:

Administration of organizations

Administrations of projects

Administration of users

Projects Dashboard

Organizations Dashboard

Triggers

Scheduled Actions

Billing

## Installation

Dowload or clone this repository

```
cd TiOS-webapp
npm install
```


# SPECIFICATIONS
## Functional Requirements
## Business Rules

An Organization is an entity within the system. Organization contains Projects and Users (Organization Managers and Organization Members). Projects contains Datapoints. A User can be part of multiple Projects, but only part of one Organization. 

Access to TIoS web application is restricted to System Administrators, Organization Administrators and Organization Members.

System Administrators must have access to all Projects, Organizations, Users, Datasources and Datapoints that have been registered in the system.

System Administrator can create other System Administrators, and also create other Users with the following roles: Organization Manager and Organization Member.

System Administrators can create a relationship between Users (Organization Managers and Organization Members) and Projects.

System Administrators can disable Organizations, Projects and Users. Conditions: a User can be disabled any time. A project can be disabled only if all users have been disabled already, or the project has no users at all. An Organization can be disabled only if all Projects and Users are disabled already.

System Administrators can create Datapoints.

System Administrators can add Datapoints to a Project.

Organization Managers and Organization Members access ONLY to the Organization and Projects that have been assigned to.

An Organization can have multiple Organization Managers and Organization Members.

An Organization can have Multiple Projects.

Organization Managers can create entries for the Organization Dashboard. The Organization Dashboard is the main page for any Organization main page in the system. Organization dashboard entries are: Number of Users, Number of Projects, Calendar Entries, log entries and notification entries.

Organization Managers can  customize the look and feel for their Organization web portal by uploading a logo (image) and choosing between a range of colors and web fonts.

Organization Managers can delegate certain privileges to other users, for instance: create entries to the dashboard.

## Administrative functions
## For System Administrators:

CRUD operations for Organizations, Users, Projects and Datapoints. 

## General Configuration.

Login and password are required to access TIoS web application. All account access will be provided by the System Admins.

## Authorization levels

Standard Authorization Protocols are required. Oauth 2.0 is preferred.

## Certification Requirements

Secure Socket Layer (SSL) .

## For System Administrators:

Organizations in the system with their statuses (active, inactive), # of users, Contract length, Start date, Final date and CRUD options
Users with their related Organization, status of the user, role and CRUD options.

## For Organization Managers
Users with their related Projects, status of the user, role 
