# Inhale: Your Air Quality Monitor

## Introduction 

Inhale is an air quality monitoriing application that allows the user to view air quality and pollution data in their area. Users can create accounts to store favorite locations, journal about their health symptoms, and even learn how to reduce their environmental impact. 
Check out Inhale on Heroku here.

## Technology

- Node.js
- Expresss
- EJS
- Sequelize
- Breezeometer API
- ZipCode API

## Process

### Planning
ERD
![Image of ERD](https://i.imgur.com/xbTz1Pv.png)

#### Wireframe Samples

![HomePageImage](https://i.imgur.com/eYg8BNp.png)
![ShowAirQuality](https://i.imgur.com/dcwjuE6.png)
![JournalEntries](https://i.imgur.com/NyeAGXI.png)

### Sprint 1: Setting up Application and Adding APIs

I started my development process by importing an authorization boiler-plate that was created in my General Assembly course. The boiler-plate utilizes bcrypt, oAuth, express-session, and passport.

My next challenge was to find an API that gave pollution data by location. Although many are availble, Breezeometer seemed to me the most developer-friendly.

After connecting the API via axios to my application, I noted that users would not immediately know their latitude and longitude, the two parameters needed for Breezometer. I then had to located and connect another API that gave latitudes and longitudes from inputted zipcodes.

### Sprint #2: Creating and Implementing SQL Models

My next mission was to create three models for my Inhale application, which included a user model, a locations model, and a journal model. Users are able to store favorite locations and create journal entries about their health symptoms in those locations. `user` stores the user's authentication information, `location` stores their favorited zip codes and `journal` stores their journal entries and health levels.

### Sprint #3: Create Routes

My next step was to create the routes as seen below:

| Route | HTTP Verb | CRUD | Model | Explanation
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `"/"` | GET  | READ | N/A | Renders home page
|`"/show"`  | GET  | READ | none | Renders Air Quality Data based on searched zip Code
|`"/profile"` | GET | READ | `location` | Displays user's saved favorite locations by zip code
|`"/profile"` | GET | DELETE | `location` | Deletes user's saved favorite location
|`"/profile"` | POST | CREATE | `location` | Creates user's saved favorite location
|`"/profile/journal"` | GET | READ | `journal` | Displays user's written journal entries
|`"/profile/journal"` | POST | CREATE | `journal` | Creates user's journal entry
|`"/profile/journal"` | GET | DELETE | `journal` | Deletes user's journal entry
|`"/profile/journal/modify"` | GET | UPDATE | `journal` | Allows for editing of user's journal entry
|`"/co"` | GET | READ | N/A | Dislays information about pollutant

### Sprint #4: Styling and Personalization
After styling my pages, I wanted to make custom images to display for certain pollution conditions. For instance, a smiley face appears a different color and mood depending on the overall pollution conditions. Depending on the API, an image will display that points to the current API condition. This required a lot of work in Google Drawings and writing long javascript conditionals.

## Challenges
- Implementing two APIs into my application was challenging to learn, as I had not doubled up on APIs before.
- Creating one to many model relationships was challenging and required troubleshooting that eventually ensured that my models were properly communicating with each other.
- Styling was a challenge for me. After writing out my entire application in HTML and Javascript, I attempted to implement a CSS Framework, but quickly learned that it would take me just as long to edit my HTML code in order to match the framework as it would for me to implement my own styling.

## Future Goals
I want to make the application usable to those who do not live in the United States and therefore do not have a US Zip Code. I will need to add on other APIs that connect latitude and longitude to the preferred method of location in other countries.

