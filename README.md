# Image Scheduler

---

## Description

An image sending scheduler I created for [Paradise Music](https://youtube.com/wavemusic) so that their followers can get access to the background images they use on their videos.


## Endpoints

### Authentication

#### POST `/auth/login`
Login endpoint

Requires:
- Username
- Password

#### POST `/auth/signup`
The signup endpoint, which allows an admin to create an account for the service.

Requires:
- Username
- Password
- User's Role
- *Requesting user to be an admin*

#### GET `/auth/validate`
Validates the provided token

Requires:
- Authorization token

### Background

#### POST `/background/url`
Adds a URL to the send queue

Reqires:
- Scheduled time
- Image URL
- Channel (Wave / Paradise)
- Source (URL)

#### PUT `/background`
Updates the specific queue item

Requires:
- Item ID

#### DELETE `/background`
Deletes the specified item from the queue

Requires:
- Item ID

#### GET `/background`
Get's a specific item from the queue

Requires:
- Item ID

#### GET `/background/all`
Gets all items in the queue