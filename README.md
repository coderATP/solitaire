# solitaire
a Solitaire game made with phaser 3
* play it on https://atp-solitaire.netlify.app
  
//TO-DO:
1. leaderboard
7. scoring system:

each move = 5 points
before awarding points,
award moves from discard to foundation
award moves from tableau to foundation
award bonus points when player completes game in less than 10 min
deduct points when player undos any rewarding action




FUNCTION CALLBACK FROM EV LISTENER
CREATE LOADING SCREEN IN PHASER 3
WINNING CONDITION
For every 1 second that the player finished earlier than 10 min, award extra five points
e.g. if player finishes in 5min 30sec, extra points = 

10 min = 10 * 60 seconds * 5points = 3000 points total