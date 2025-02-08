# Fetch Dogs App

This is a take-home assignment from [Fetch](https://fetch.com/).

I used [Pet Finder](https://www.petfinder.com/) as a design reference for this project. 

###   
**Project Overview**

The app is a simple frontend for navigating a database of dogs drawn from Fetch's own API. 

It allows for various methods of filtering and sorting as outlined in the brief. 

It also allows users to favorite dogs and receive recommendations based on their favorites.

Though it has a pseudo-login feature, it does not require a password, and the backend does not store user information. 

No user interaction data persists beyond the session.

---

### **Future Enhancements**

If this project were to be further developed, I would consider the following:

#### **Google Maps Integration**

Show and filter dogs by their locations, displayed on an integrated map.

Display dogs based on there distance from the user's location.

#### **Further Mobile Optimization**

My current design is responsive to a point, but more could be done to improve the user experience across various devices.

#### **Secure Login and 'My Profile' Page**

Persist user data and send notifications based on previous browsing.

#### **More Sort Options**

Sort dogs by city, state, dog size, dog color, and more.

---

### The brief from Fetch:

  
¶  
Fetch Frontend Take-Home Exercise

Here at Fetch, we love dogs, and hope you do too! Your task is to build a website to help a dog-lover like yourself search through a database of shelter dogs, with the hope of finding a lucky dog a new home!  
General Requirements

You first should have users enter their name and email on a login screen. Then, you should use this information to hit our login endpoint to authenticate with our service (see API Reference below).

Once a user is successfully authenticated, they should be brought to a search page where they can browse available dogs. This page must meet the following requirements:

```
Users must be able to filter by breed
Results should be paginated
Results should be sorted alphabetically by breed by default. Users should be able to modify this sort to be ascending or descending.
All fields of the Dog object (except for id) must be presented in some form
```

Users should be able to select their favorite dogs from the search results. When finished searching, they should be able to generate a match based on dogs added to the favorites list. A single match will be generated by sending all favorited dog IDs to the /dogs/match endpoint. You should display this match however you see fit.

As for everything else, you have free rein, so get creative! We strongly encourage you to go beyond the minimum requirements to build something that showcases your strengths.

You may find it helpful to make use of a component library.  
Additional Requirements

```
Your app should be hosted on the internet where it can be visited and interacted with
Your source code should be stored in a git repository and hosted on the internet (i.e. GitHub)
You should include any necessary documentation to run your site locally
```

How to submit

Please provide a link to your deployed site and your public code repository via Greenhouse.  
How will this exercise be evaluated?

An engineer will review the code you submit. You will be evaluated based on:

```
Code quality
Use of best practices
Fulfillment of minimum requirements
Site usability/UX
```

Can I provide a private repository?

If at all possible, we prefer a public repository because we do not know which engineer will be evaluating your submission. If you are still uncomfortable providing a public repository, you can work with your recruiter to provide access to the reviewing engineer.  
How long do I have to complete the exercise?

There is no time limit for the exercise. Out of respect for your time, we designed this exercise with the intent that it should take you a few hours. However, you may take as much time as you need to complete the work.

For any further questions or clarifications, please reach out to your recruiter.  
API Reference

We provide our own backend to facilitate searching/fetching dog info. The base URL is https://frontend-take-home-service.fetch.com.  
Data Model

Here is the Typescript interface for the Dog objects returned by our API:

interface Dog {  
id: string  
img: string  
name: string  
age: number  
zip\_code: string  
breed: string  
}

We also provide endpoints for fetching location data, which should be useful if you’d like to implement filtering dogs by location. Here is the Typescript interface for the Location objects returned by our API:

interface Location {  
zip\_code: string  
latitude: number  
longitude: number  
city: string  
state: string  
county: string  
}

interface Coordinates {  
lat: number;  
lon: number;  
}

Authentication

You will need to hit the login endpoint in order to access other endpoints. A successful request to the login endpoint will return an auth cookie included in the set-cookie response header. It’s an HttpOnly cookie, so you will not be able to access this value from any Javascript code (nor should you need to). Your browser will automatically send this cookie with all successive credentialed requests to the API. Note that you will need to pass a config option in order to send credentials (cookies) with each request. Some documentation to help you with this:

```
Including credentials with fetch (set credentials: 'include' in request config)
Including credentials with axios (set withCredentials: true in request config)
```

Postman will do this for you automatically.  
POST /auth/login  
Body Parameters

```
name - the user’s name
email - the user’s email
```

Example

// API Request Function  
...  
body: {  
name: string,  
email: string  
}  
...

Response

200 OK

An auth cookie, fetch-access-token, will be included in the response headers. This will expire in 1 hour.  
POST /auth/logout

Hit this endpoint to end a user’s session. This will invalidate the auth cookie.  
GET /dogs/breeds  
Return Value

Returns an array of all possible breed names.  
GET /dogs/search  
Query Parameters

The following query parameters can be supplied to filter the search results. All are optional; if none are provided, the search will match all dogs.

```
breeds - an array of breeds
zipCodes - an array of zip codes
ageMin - a minimum age
ageMax - a maximum age
```

Additionally, the following query parameters can be used to configure the search:

```
size - the number of results to return; defaults to 25 if omitted
from - a cursor to be used when paginating results (optional)
sort - the field by which to sort results, and the direction of the sort; in the format sort=field:[asc|desc].
    results can be sorted by the following fields:
        breed
        name
        age
    Ex: sort=breed:asc
```

Return Value

Returns an object with the following properties:

```
resultIds - an array of dog IDs matching your query
total - the total number of results for the query (not just the current page)
next - a query to request the next page of results (if one exists)
prev - a query to request the previous page of results (if one exists)
```

The maximum total number of dogs that will be matched by a single query is 10,000.  
POST /dogs  
Body Parameters

The body should be an array of no more than 100 dog IDs to fetch (no pun intended).

// API Request Function  
...  
body: string\[\]  
...

Return Value

Returns an array of dog objects  
POST /dogs/match  
Body Parameters

The body of this request should be an array of dog IDs.

Example

// API Request Function  
...  
body: string\[\]  
...

Return Value

This endpoint will select a single ID from the provided list of dog IDs. This ID represents the dog the user has been matched with for adoption.

interface Match {  
match: string  
}

POST /locations  
Body Parameters

The body of this request should be an array of no more than 100 ZIP codes.

Example

// API Request Function  
...  
body: string\[\]  
...

Return Value

Returns an array of Location objects.  
POST /locations/search  
Body Parameters

The following body parameters can be supplied to filter the search results. All are optional; if none are provided, the search will match all locations.

```
city - the full or partial name of a city
states - an array of two-letter state/territory abbreviations
geoBoundingBox - an object defining a geographic bounding box:
    This object must contain one of the following combinations of properties:
        top, left, bottom, right
        bottom_left, top_right
        bottom_right, top_left
    Each property should have the following data:
        lat - latitude
        lon - longitude
```

Additionally, the following body parameters can be used to configure the search:

```
size - the number of results to return; defaults to 25 if omitted
from - a cursor to be used when paginating results (optional)
```

The maximum total number of ZIP codes that will be matched by a single query is 10,000.

Example

// API Request Function  
...  
body: {  
city?: string,  
states?: string\[\],  
geoBoundingBox?: {  
top?: Coordinates,  
left?: Coordinates,  
bottom?: Coordinates,  
right?: Coordinates,  
bottom\_left?: Coordinates,  
top\_left?: Coordinates  
},  
size?: number,  
from?: number  
}  
...

Return Value

Returns an object with the following properties:

```
results - an array of Location objects
total - the total number of results for the query (not just the current page)
```

{  
results: Location\[\],  
total: number  
}