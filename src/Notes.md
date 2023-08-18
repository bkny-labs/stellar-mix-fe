Main controller 
primary thread for accessing the API services

Main state handler
- Handles setting and loading the global states of the application payload
  - Weather
  - SunCalc Data (current sunrise, sunset, moon phase)

API Services Needed
These should be entirely promise-based and return a promise to the main state handler.
- Weather API Service 
    - Gets weather based on user's current location (Chrome location services approval needed here)
    - Catches for when location services have not be approved yet by user

- Spotify API Service
  - Authenticates user with Spotify api
  - Submits API request for playlists based on current Main state handler payload



Utility needed
- Generate query
  - Combines the data to format the query for Spotify based on the following factors:
    - Time of day
      - If sun has not set, should be some sort of "daytime" or "upbeat" playlist 
      - If it's night time, we need to setup some keywords for the Spotify query that align with the current moon phase (full moon, new moon, etc)
    - Weather from API service
      - If it's raining or sunny, we need to setup some keywords for the Spotify query that align with the current weather (rainy, stormy, clear, sunny, etc)