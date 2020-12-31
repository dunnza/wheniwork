# When I Work Code Challenge

This repository is my submission for the When I Work code challenge. You can
search for comments with the word "REQUIREMENT" in them to see me talk about how
I approached the task.

## How to Run the Backend Locally

1. You must have the .NET Core SDK 3.1 installed on your machine. The project MIGHT work with the .NET 5 SDK, but I have not tested with that version. The .NET Core version I am using is 3.1.404.

   - [https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download)

2. Clone the repo to your local machine.

3. Navigate to /backend/src on the command line

4. Run the command `dotnet run`

5. Test the API with your tool of choice (Postman, Insomnia, cURL, etc.). You'll
   want to make requests like (substitute IDs for the IDs from the data you
   generate):
   - `GET http://localhost:5000/api/shifts`
   - `GET http://localhost:5000/api/shifts/aa50d506-cbd3-4e03-aa53-4959f170ecb3`
   - `POST http://localhost:5000/api/shifts`
     - body: `{ "employee": "Zachary", "start": "2020-12-26T08:00:00Z", "end": "2020-12-26T16:30:00Z" }`
   - `PATCH http://localhost:5000/api/shifts/196a11d1-b81f-45a2-8bc2-f8ebfc06be39`
     - body: `{ "end": "2020-12-26T17:00:00Z" }`
   - `DELETE http://localhost:5000/api/shifts/8fbccc04-141e-4833-9279-3a53408b3b1d`

## How to Run the Frontend Locally

1. You must have at least Node.js v14.15.0 installed. That's what I used in development. I'm sure it will work with newer versions and probably even v10.\* but I did not test with them.

2. Navigate to /frontend in your cloned repo (from step 2 above).

3. Run the command `npm install` to install the necessary dependencies (in a different shell from the one in step 3 above).

4. Once step 3 is complete, run the command `npm run dev`.

5. Navigate to `http://localhost:3000` in a browser to see the application and interact with it.

## How to Test the Live Project

This project is hosted on my site at https://www.zachary-dunn.com/wheniwork.
You should be able to use your API testing tool of choice to make requests
against http://www.zachary-dunn.com/wheniwork/api/shifts, along with playing
around with the app.

**NOTE:** For the "best" experience I recommend playing around with it locally
if possible. I have never actually deployed a Next.js project before and it gave
me a few problems putting it up on my site that I kinda had to piece together.

## Notes

I am just using a file for storage persistence. This would never suffice for a
production app, it would get very slow very quickly and you'd have to develop
different mechanisms to make sure that we aren't trying to write to it from two
different sources at the same time. Various database solutions (relational,
nosql, etc.) provide solutions to these problems.

## Other Considerations

In a production application you would use heuristics like "no shift can be
greater than 24 hours" to help limit the data further for some of these
operations like checking for overlaps. That would be a helpful optimization to
improve performance once the data set got large enough.
