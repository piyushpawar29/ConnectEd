# API Testing Guide for Mentor Profile

To test the API endpoints, follow these steps:

## 1. Direct Backend API Testing:
- Use Postman or curl to test: http://localhost:5001/api/mentors/682d4d066de1e58590cec82d
- This will check if the backend recognizes this ID directly

## 2. Alternative Endpoints to Try:
- http://localhost:5001/api/mentors/profile/682d4d066de1e58590cec82d
- http://localhost:5001/api/users/682d4d066de1e58590cec82d/mentor-profile
   
## 3. Check if ID format is correct:
- MongoDB ObjectId should be 24 characters (yours is 24, which seems valid)
- Note that MongoDB ObjectIds are case-sensitive

## 4. If all endpoints return 404, check:
- Is the ID a user ID instead of a mentor profile ID?
- Is there a typo in the ID?
- Is the backend server running on port 5001?

## 5. Frontend Testing:
- Check from browser: http://localhost:3000/api/mentors/682d4d066de1e58590cec82d
- This tests your NextJS API route
   
If the backend returns a 404, this means the ID is likely not found in the database.
If it returns a 500, there might be a data formatting issue.

## How to test with curl:
```
curl http://localhost:5001/api/mentors/682d4d066de1e58590cec82d
```

With authorization header (if needed):
```
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5001/api/mentors/682d4d066de1e58590cec82d
```

## Compare IDs in MongoDB
If you have access to MongoDB, check:
1. The User collection for the ID: 682d4d066de1e58590cec82d
2. The MentorProfile collection for any document with user field matching this ID

This will help determine if you're using a user ID when you should be using a mentor profile ID, or vice versa. 