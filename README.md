# Eventures

Eventures is an event management mobile application created by Alma Lundberg, Hugo Ericsson, Jessie Bäckström, Lovisa Thorsander and Saga Edstam

Independent Project in Sociotechnical Systems Engineering – IT Systems at Uppsala University

## About
The primary aim of the project was to simplify the way that campus events are created, accessed and marketed. This by collecting all the different features and information needed on one centralized location; the application Eventures. 

The mobile application is developed to host two different kinds of users, students and organizations. 

A student can sign up to Eventures, and once signed in to the application, students can explore events and organizations through the search page.

One of the main functionalities of the application is that students are required to be members of a student organization in order to register for their events. However, students can browse events hosted by other organizations on the search page. 

Once the organization accept the students membership request, the student can see the organizations events in their feed and register or buy tickets for their events.

Unlike student accounts, organization accounts are created by the Eventures administrators due to verification aspects, as they are supposed to handle private information and payments. This to prevent fake organization accounts.  Once signed in, an organization can create new events and edit events. Also, a student organization can handle membership requests and see a list of their members. 

## Codebase Structure

The repository is divided into a front-end folder and a back-end folder.  

The FRONT-END is built using React Native and Expo Go. Expo is an open-source client that can be used for testing React Native applications for iOS and Android easily. When running the command ’npx expo start’ in the terminal, a development server starts which can connect to an Android Studio simulator, Xcode simulator or the Expo Go app. 

Eventures is an application containing several different screens, therefore it utilizes React Native’s built-in stack navigation and tab navigation. This can be found in the folder "navigation". The navigation stacks consists of several screens, which can be found in the folder "screens".

Eventures utilizes Axios to communicate with the BACK-END API. To enable the application to run during development, the correct API_BASE_URL must be configured in the axios.js file. See the [HOWTO.md][] to know more about how to run the application.

The BACK-END is built using Django and consist of a core-app, where the settings.py is located, a "user" app where all authentication and the API is located as well as a "userprofile" app where all other objects of the database is located.

Django REST Framework is utilized for building the API. For authentication, SimpleJWT is used.

See the [HOWTO.md][] to know more about how to run the application.