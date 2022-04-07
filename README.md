# What is Time trac?

* Time trac is an application that allows users to track their time and analyse the time spent on every activity. 

* For example, A user can track the time they spend on activities like Sleeping, Studying, Learning new skills etc.

* The user can plan their days ahead using logs which are instances of activities.

* Once the user completes a log, they can mark it complete and if they miss it, The system automatically marks the log as missed. 

* The user can also look at the analytics where they can see the time they spent on every activity, and what percentage of logs they missed.

* The user can view the analytics on a range of durations like 1 day , 7 days , 1 month , 6 months , 1 year etc..

For visual Representation of Time trac, View the prototype here.
https://www.figma.com/proto/yhB8F70Hglbfgb7GxIOezM/Time-Trac-v1?node-id=0%3A1

## Aim of this project.

* A **backend API** for the Time Trac mobile and web applications to handle **authentication** ,  **CRUD** operations and **Data Storage**.

# Technical Documentation

## Technologies/Tools used:

* Nodejs
* Express framework for server routing
* Mongodb for Data storage
* mongoose library to interact with Mongodb
* Hosting on Heroku

## Project Structure

* The execution starts in `app.js` 
* `Models` folder containes all the Data models
* `Controllers` folder contain all the methods which contain the server side logic that is called when it's endpoint is called.
* `Routes` folder contains the beginning of the endpoint from where middleware and controller methods are called as required. 
* `validators` in `/utils` contain the validation methods to ensure the client's request contains the required data.

## Endpoints Documentation 

The endpoints documentation can be found here:
https://documenter.getpostman.com/view/19193041/UVXomtgq

## Highlights

### 1. An algorithm to generate repetitive instances of Logs. 

#### Problem

As mentioned in the CREATE LOGS endpoint, Upon the client sending the following data in the `POST` request,

```
{
    "title" : "Sleep",
    "duration" : 420,
    "repeatsOn" : [ 0, 1 , 2 , 3 , 4 , 5, 6 ], 
    "numOfRepeats" : 10,
    "parentActivity" : "624872121ee2c9724f00eaa7",
    "startTime" : 1648919373311 
}
```

Where `startTime` is the start of the first repetition of the Log (JS timestamp)

`repeatsOn` is the days of the week on which the Log repeats (0-6 , Sunday - Saturday)

`numOfRepeats` is the number of times the Log has to repeat.



The following data has to be generated 

```
{
    "title": "Sleep",
    "loglets": [
      {
        "startTime": "2022-04-02T17:09:33.311Z",
        "duration": 420,
        "isCompleted": false,
        "_id": "6249bd9f4b2065d929072000"
      },
      {
        "startTime": "2022-04-03T17:09:33.000Z",
        "duration": 420,
        "isCompleted": false,
        "_id": "6249bd9f4b2065d929072001"
      },
      {
        "startTime": "2022-04-04T17:09:33.000Z",
        "duration": 420,
        "isCompleted": false,
        "_id": "6249bd9f4b2065d929072002"
      },
      {
        "startTime": "2022-04-05T17:09:33.000Z",
        "duration": 420,
        "isCompleted": false,
        "_id": "6249bd9f4b2065d929072003"
      },
      {
        "startTime": "2022-04-06T17:09:33.000Z",
        "duration": 420,
        "isCompleted": false,
        "_id": "6249bd9f4b2065d929072004"
      },
      {
        "startTime": "2022-04-07T17:09:33.000Z",
        "duration": 420,
        "isCompleted": false,
        "_id": "6249bd9f4b2065d929072005"
      },
      {
        "startTime": "2022-04-08T17:09:33.000Z",
        "duration": 420,
        "isCompleted": false,
        "_id": "6249bd9f4b2065d929072006"
      },
      {
        "startTime": "2022-04-09T17:09:33.000Z",
        "duration": 420,
        "isCompleted": false,
        "_id": "6249bd9f4b2065d929072007"
      },
      {
        "startTime": "2022-04-10T17:09:33.000Z",
        "duration": 420,
        "isCompleted": false,
        "_id": "6249bd9f4b2065d929072008"
      },
      {
        "startTime": "2022-04-11T17:09:33.000Z",
        "duration": 420,
        "isCompleted": false,
        "_id": "6249bd9f4b2065d929072009"
      },
      {
        "startTime": "2022-04-12T17:09:33.000Z",
        "duration": 420,
        "isCompleted": false,
        "_id": "6249bd9f4b2065d92907200a"
      }
    ],
    "parentActivity": "624872121ee2c9724f00eaa7",
    "owner": "624871d4e11b16a8500d6fb4",
    "_id": "6249bd9f4b2065d929071fff",
    "__v": 0
  }
  ```
  
* Each loglet is an instance of a log, with it's own start time generated according to the days of the week the log repeats on based on the `RepeatsOn` Array

* The number of loglets generated is equal to `numOfRepeats` property.


#### Solution

**Note**: The input data used here is different from the one in the Problem, so as to better explain the algorithm. 


* Take the Day of the week which is the first instance of the log using `getDay()` method on `startTime`.

* Check for the index of this Day in the `RepeatsOn` Array and store the index as `firstIndex`.

* Generate a new Array which contains the number of days between each repetition, example:

```
if RepeatsOn : [0 , 1 , 4 , 6],

dayDifference = [1 , 3 , 2 , 1]

```
* Code used to generate dayDifference

```
    for(let i = 0 ; i < req.body.repeatsOn.length ; i++){
        if(i == req.body.repeatsOn.length-1){  // find the number of days between last element of repeatsOn and first element of RepeatsOn
        dayDiff[i] = ((7-req.body.repeatsOn[i]) + req.body.repeatsOn[0])
        continue
        }
        dayDiff[i] = req.body.repeatsOn[i+1] - req.body.repeatsOn[i];
    }
```
* Here the last element of the Array is the difference in number of days between the last element and first element in `RepeatsOn` given by the formula 

(7-repeatsOn[-1] + repeatsOn[0])

* Now that we have the number of days between repetitive logs in `dayDifference`, we generate a new array which has this sequence continue `numOfRepeats` times. This array has to begin with the day of the first repetiton 

* We achieve this by pushing each element of `dayDifference` starting from `firstIndex` and moving to the right `numOfRepeats` times. If we reach the end of the array but have not yet iterated `numOfRepeats`times, we start over from the beginning of `dayDifference` and move to the right until we have `numOfRepeats` elements

Loop : 

```
        for(let j = 0 ; j < req.body.numOfRepeats ; j++){
            dayDiffLong[j] = dayDiff[firstIndex];
            if(firstIndex== (dayDiff.length - 1)) {
                firstIndex = 0;
                continue
            }
            ++firstIndex;
        }
```

**Note**: We can start the loop from `firstIndex` as, `dayDifference[firstIndex]` is equal to **the number of days between the first instance of the log and it's first repetition**

example : 
if the log starts on Tuesday i.e 1 , then `firstIndex` for 

`RepeatsOn : [0 , 1 , 4 , 6]`

is going to be 1, `firstIndex = 1`. Now the value at `firstIndex` in 

`dayDifference = [1 , 3 , 2 , 1]`

is 3 which is the number of days between first Instance and first Repetition (4 - 1).

* Now we have an array which has the number of days between each repetition. The array's length is `numOfrepetition`. 

` dayDiffLong = [3 , 2 , 1 , 1 , 3]`. Here, `numOfRepetitions` = 5.

* The final step is to generate the `startTimes` for each repetition based on `dayDiffLong`.

* We first add the first instance into the array followed by the repetitions. 

```
//first instance
 let data = {
                title : req.body.title,
                parentActivity : req.body.parentActivity,
                owner : req.user._id,
                loglets : [
                    {
                        startTime : req.body.startTime,
                        duration : req.body.duration,
                        isCompleted : false
                    }
                ]
            }
```

```
let nowTime = new Date(req.body.startTime);
for(let i = 0 ; i < dayDiffLong.length ; i++){
    let nextTime = Date.parse(nowTime) + (86400000 * dayDiffLong[i]); //Each day has 86400000 ms.
    nowTime = new Date(nextTime);
    data.loglets.push(
        {
            startTime : nextTime,
            duration : req.body.duration,
            isCompleted : false
        }
    )
}
```

Thus we have an array of Loglets (Instances of a log which repeats and have their own start time). 


