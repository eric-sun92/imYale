
/**
 * Represents a game in the application.
 * @typedef {Object} Game
 * @property {string} team1 - The name of the first team.
 * @property {string} team2 - The name of the second team.
 * @property {number} scoreHome - The score of the home team.
 * @property {number} scoreAway - The score of the away team.
 * @property {string} winner - The name of the winning team.
 * @property {Array<Array<string>>} team1Users - The users associated with the first team.
 * @property {Array<Array<string>>} team2Users - The users associated with the second team.
 * @property {string} sport - The sport of the game.
 * @property {Date} date - The date of the game.
 * @property {boolean} isPlayOff - Indicates if the game is a playoff game.
 * @property {boolean} completed - Indicates if the game is completed.
 * @property {Array<ObjectId>} announcement - The announcements associated with the game.
 */

/**
 * Represents a game in the application.
 * @class Game
 * @property {string} team1 - The name of the first team.
 * @property {string} team2 - The name of the second team.
 * @property {number} scoreHome - The score of the home team.
 * @property {number} scoreAway - The score of the away team.
 * @property {string} winner - The name of the winning team.
 * @property {Array<Array<string>>} team1Users - The users associated with the first team.
 * @property {Array<Array<string>>} team2Users - The users associated with the second team.
 * @property {string} sport - The sport of the game.
 * @property {Date} date - The date of the game.
 * @property {boolean} isPlayOff - Indicates if the game is a playoff game.
 * @property {boolean} completed - Indicates if the game is completed.
 * @property {Array<ObjectId>} announcement - The announcements associated with the game.
 */
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
    {
        team1: { 
            type: String, 
            required: true 
        },
        team2: { 
            type: String, 
            required: true 
        },
        scoreHome: { 
            // home team, away team
            type: Number, 
            required: true
        },
        scoreAway: { 
            type: Number, 
            required: true 
        },
        winner: { 
            type: String, 
            required: true 
        },
        team1Users: { 
            type: [[String, String]], 
            required: true
         },
        team2Users: { 
            type: [[String, String]], 
            required: true 
        },
        sport: { type: String, 
            required: true 
        },
        date: {
            type: Date,
            required: true
        },
        isPlayOff:{
            type: Boolean,
            required: true
        },
        completed: {
            type: Boolean,
            required: true
        },
        announcement: [{
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Announcement'
        }]
});

module.exports = mongoose.model("Game", gameSchema);
