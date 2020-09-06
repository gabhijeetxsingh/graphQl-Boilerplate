const mongoose = require("mongoose");
const Event= require("../../models/event");

module.exports = {
    events :async () => {
        try {

            let events = await Event.find();
            // return events.map(event=> {
            // });
            return events;

        }catch(err){
            throw err;
        };
    },
    createEvent: async (args, req) => {

        try {

            const event = new Event({
                title : args.eventInput.title,
                description : args.eventInput.description,
                price : +args.eventInput.price,
                date : new Date(args.eventInput.date),            
            })
            
            let createdEvent;

            let result = await event.save()

            createdEvent = result;

            return createdEvent;
        }
        catch(err){
            console.log(err);
            throw err;
        };
    }       
}