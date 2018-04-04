### REST API which delivers some information about Boulder Warriors Challenge

# GET

### /players
Gets general list of all players taking part in the challenge.

### /players/top
Gets all players with their scores gained during the challenge.

### /meetings
Gets all meetings organised in the challenge.

### /meetings/:meetingId/results
Gets results from one single meeting represented by meetingId.


# POST

### /players
Adds new players to general list of all players taking part in the challenge.

### /meetings
Adds new meeting to the challenge.

# /meetings/:meetingId/players
Adds existing players in the general list to the meeting represented by meetingId.

### /meetings/:meetingId/boulders
Adds new boulders to the meeting represented by meetingId.


# patch

### /meetings/:meetingId/results
Sets results of the meeting represented by meetingId. If there were any results before they are overwritten.


