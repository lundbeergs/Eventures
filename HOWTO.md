# Eventures
Eventures is an event management mobile application created by Alma Lundberg, Hugo Ericsson, Jessie Bäckström, Lovisa Thorsander and Saga Edstam

Independent Project in Sociotechnical Systems Engineering – IT Systems at Uppsala University

## Requirements

* Python 3.6+
* Django 4.2, 4.1, 4.0, 3.2, 3.1, 3.0

Django REST FRAMEWORK **highly recommend** and only officially support the latest patch release of each Python and Django series.

* [Node.js > 12](https://nodejs.org) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Expo Go](https://reactnative.dev/docs/environment-setup)
* [Xcode 12](https://developer.apple.com/xcode)
* [Android Studio and Android SDK](https://developer.android.com/studio)

## Backend setup

**Run Following Commands in the Terminal**  

To get this project up and running locally on your computer follow the following steps. This assumes you are using the code editor [Visual Studio Code](https://code.visualstudio.com).

1. Clone this repository to your local machine.

```bash
git clone https://github.com/lundbeergs/Eventures.git
```
2. Open the repository in Visual Studio Code.
3. Create a python virtual environment and activate it.
4. Open up your terminal in Visual Studio Code and run the following command to install the packages used in this project. Make sure you are in the right directory.

```bash
$ pip install -r requirements.txt
```
4. Change directory in your terminal to the backend folder where you will see manage.py and run following

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
5. Open up <http://localhost:8000/admin/> in your browser. You will see that your BACK-END setup functions if this is your first view.
![Backend runserver](/assets/success-runserver.png)

6. Run ^C (command + C) to stop the backend server. You have to create a superuser, to be able to login to the Django admin. Do this by running the following code, and entering an email and password:

```bash
python manage.py createsuperuser
```
By running the server again, you can login to <http://localhost:8000/admin/> to get an overview of the objects in backend. 

7. The only object that cannot be created through the frontend is a organization user. This is created by accessing the API through <http://localhost:8000/api/signup/organization/>.

## Frontend Setup + Connecting to Backend

1. Open up a new terminal, we call it the "frontend Terminal". Change directory to the frontend folder. Run the following command lines in the terminal to install all required packages specified in packade.json 

```bash
npm install
```

2. Start your simulator of choice (preferably [Android SDK in Android Studio](https://developer.android.com/studio)). 

3. Run the following command lines in the frontend terminal to start the frontend server:

```bash
npx expo start
```

![Frontend server running](/assets/npx-expo-start.png)

4. Copy the url the frontend server is running on (see the url returned as "130.243.218.18:19000" in the image above). Change the port to for example 8000, so the url is "XXX.XXX.XXX.XX:8000", and start the backend server in the backend terminal using the following command:


```bash
python manage.py runserver XXX.XXX.XXX.XX:8000
```

![Backend server running](/assets/python-runserver.png)

5. Copy the http://XXX.XXX.XXX.XX:8000 returned when starting the backend server and paste it in the axios.js file in the frontend folder to change the API_BASE_URL and the API_REFRESH_URL. 

![Axios url](/assets/Axios.png)

6. Lastly, start the simulator of your choice using any of the expo commands in the frontend terminal, and the mobile application should be successfully up and running with the frontend and backend connected.