const mongoose = require('mongoose');

const rescoSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        basketballWins: { 
            type: Number, 
            required: true 
        },
        basketballLosses: { 
            type: Number, 
            required: true 
        },
        footballWins: { 
            type: Number, 
            required: true 
        },
        footballLosses: { 
            type: Number, 
            required: true 
        },
        soccerWins: { 
            type: Number, 
            required: true 
        },
        soccerLosses: { 
            type: Number, 
            required: true 
        },
        volleyballWins: { 
            type: Number, 
            required: true 
        },
        volleyballLosses: { 
            type: Number, 
            required: true 
        },
});

module.exports = mongoose.model("Resco", rescoSchema);
