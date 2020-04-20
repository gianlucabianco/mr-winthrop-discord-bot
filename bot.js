// Required
// Run dotenv
require('dotenv').config();

// date-fns
const {
    format,
    isValid,
    parse
} = require('date-fns');

// Discord
const Discord = require('discord.js');
const client = new Discord.Client();

// Functions. TODO: Move somewhere else.
const isHourValid = hourAndMinutes => isValid(
    parse(
        hourAndMinutes,
        'HH:mm',
        new Date()
    )
);

// On Server start
client.on('ready', () => {

    console.log(
        `Logged in as ${ client.user.tag }!`
    );

});

// Auth
client.login( process.env.DISCORD_TOKEN );

client.on('message', message => {

    // Ignore messages that aren't from a guild
    if ( ! message.guild )
        return;

    // Ignore messages not directed to bot
    if ( ! message.content.toLowerCase().startsWith('mw!') )
        return;
    
    // compact command arguments
    const command = message.content.split(' ').join('').toLowerCase();
    
    // FEATURE, HELP: Displays bot guide
    if ( command === 'mw!' || command === 'mw!h' || command === 'mw!help' )
        message.reply( '\nI could help, Master.\n\nmw!    |    mw! h    |    mw! help\ndisplays bot guide\n\nmw! d hh:mm-hh:mm    |    mw! disp hh:mm-hh:mm\nrecord if the player is available to play (time table, from-to)\n\nmw! d hh:mm    |    mw! disp hh:mm\nrecord the player starting availabiliy.\nExpires in 4 hours.' );
        
    // Integers RegEx
    const containsAtLeastOneInteger = /.*[0-9].*/;
    
    // remove the trigger command
    const argument = command.replace('mw!', '');

    // FEATURE, TIMETABLE RECORD: record player availability
    if(
        argument.includes('disp') ||
        (
            argument[0] === 'd' &&
            containsAtLeastOneInteger.test(
                argument[1]
            )
        )        
    ) {
        
        // Find reservation date inside arguments
        const reservationDate = argument
            .split('')
            .filter(
                e => containsAtLeastOneInteger.test( e )
            );
            
        // reservation date validation length
        const reservationDateValidations = [
            4,
            8
        ];

        const errorDateMessage = '\nSembra che mi abbia comunicato una disponibilità in un formato errato Signore, la prego di riprovare.\n\nPer maggiori informazioni digiti    mw!    ';

        // Reservation validations
        if(
            ! reservationDate.length ||
            ! reservationDateValidations
            .includes(
                reservationDate.length
            )
        )
            return message.reply( errorDateMessage );

        let formattedReservationDate = reservationDate.join('');
        
        // Starting Reservation ?? Complete Reservation BL
        if( formattedReservationDate.length < 8 ) {
            
            const reservationStarting = `${formattedReservationDate.slice(0, 2)}:${formattedReservationDate.slice(2)}`;

            if(
                ! isHourValid(reservationStarting)
            )
                return message.reply( errorDateMessage );

            // TODO: BL here (starting + 4h ?)

            return message.reply( `\nCome desidera Signore, segno la sua disponibilità a partire dalle ${ reservationStarting }` );

        } else {

            const reservationStarting = `${formattedReservationDate.slice(0, 2)}:${formattedReservationDate.slice(2, 4)}`
            , reservationEnding = `${formattedReservationDate.slice(4, 6)}:${formattedReservationDate.slice(6, 8)}`;

            if(
                ! isHourValid(reservationStarting) ||
                ! isHourValid(reservationEnding)
            )
                return message.reply( errorDateMessage );

                // TODO: BL here

            return message.reply( `\nCome desidera Signore, segno la sua disponibilità nella seguente fascia oraria ${ reservationStarting }-${ reservationEnding }` );

        }

    }

    // TEST PLAYGROUND
    // TODO: examples for further feats

    // displays the message author name
    // console.log(        
    //     message.author.username,
    // );

    // cmd for test purpose only        
    if ( message.content == 'mw!date' )
        message.reply( `Today is: ${format(new Date(), 'dd.mm.yyyy.H:mm:ss')}` );
        
    // RESULT TRACKING FEATURE:
    /*
    // FIXME: mentions to register players data
    const user = message.mentions.users.first();

    // First user test
    if ( ! user )
        return;
    */

});
