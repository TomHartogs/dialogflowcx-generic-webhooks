# Generic reusable webhooks

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) ![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)

## A Dialogflow CX competition entry

This repository contains generic webhooks that can be reused across multiple Dialogflow CX agents.

### Setup
```bash
git clone https://github.com/TomHartogs/dialogflowcx-generic-webhooks.git
cd ./dialogflow-cx-generic-webhooks/functions
firebase --use add PROJECTID
```
## Longterm storage
Use this simple webhook if you want to store parameters over multiple sessions.

### Deployment
```bash
firebase deploy --only functions:longtermstorage
```

### Usage
The webhook supports 3 types of tags:
|Tag|Description|
|---|---|
|Save| Saves all session parameters in a firestore document with the sessionId as unique key |
|Load| Looks for a document with the sessionId and appends the previous sessionParameters to the current parameters |
|Clear| Clears all session parameters from both the current session and the storage |

Be sure to store the sessionId somewhere in the front-end so you can use the same id with later sessions.

## Analytics
This webhook allows the tracking of custom events in your chatbot with the help of Google Analytics.
### Deployment
```bash
firebase deploy --only functions:analytics
```
> Note: Copy the URL of your function

### Configuration
In order to track events, you first need to create a new Universal Analytics property in Google Analytics. 
To do this you must:
1. Go to Admin settings
2. Click `Create Property`
3. Fill in property name
4. Click `Show advanced settings`
5. Select `Create a Universal Analytics property`
6. Click `Next`
7. Select your UA Property and go to Property Settings
8. Copy `Tracking ID`
![Google Analytics setup](./resources/img/ga-setup.jpeg?raw=true)
![Property settings](./resources/img/property-settings.jpeg?raw=true)
![Tracking id](./resources/img/tracking-id.jpeg?raw=true)

1. Create a new webhook
2. Set Webhook URL to be the URL of your deployed cloud function
3. Add a header with the key `trackingid` and in the value add your `Google Analytics Tracking ID`

![Dialogflow CX webhook settings](./resources/img/webhook-settings.png?raw=true)

### Usage
To send events to Google Analytics you need to trigger your webhook.
In the tag you need to define a JSON with the following parameters
|Key|Value|
|---|---|
|Event| Name of the custom event as to be displayed in Google Analytics |
|Category| Category of the event |
|Label| Custom label |

![Dialogflow CX fulfillment settings](./resources/img/fulfillment-settings.png?raw=true)