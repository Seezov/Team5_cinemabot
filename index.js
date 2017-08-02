'use strict'

var TelegramBot = require('node-telegram-bot-api')
var tg
var contact
var location
var errorMessage = 'Error'
var settingsButton = {
    text:"Settings",
    callback_data:'settingsCmd'
}
var cancelButton = {
    text:"Cancel",
    callback_data:'cancelCmd'
}
var backButton = {
    text:"Back",
    callback_data:'backCmd'
}
var options = {}
options.reply_markup = {}
options.reply_markup.keyboard = []
options.reply_markup.keyboard.push([settingsButton])
options.reply_markup.keyboard.push([backButton])
options.reply_markup.keyboard.push([cancelButton])

function create() {
    var token = "422162771:AAFJE7VEnqNvOny3w8g7mbPKDYuuh6vGPd4"
    tg = new TelegramBot(token, {polling: true})

    tg.onText(/\/start/, function (message) {
        try {
            tg.sendMessage(message.chat.id, 'Hello! Input contact information in the format: ' +
                '\n<b>My contacts: first name, last name, phone, e-mail</b>', {parse_mode: 'HTML'}).then(function () {
                tg.once('message', function (message) {
                    if (message.text.toLowerCase().includes('my contacts:')) {
                        getContacts(message)
                    }
                    else {
                        throw new Error(errorMessage)
                    }
                    tg.sendMessage(message.from.id, 'Enter the city where you want to visit the cinema in the format: ' +
                        '\n<b>Location: city/town, country</b>', {parse_mode: 'HTML'}).then(function (answer) {
                        tg.once('message', function (message) {
                            if (message.text.toLowerCase().includes('location:')) {
                                getLocation(message)
                            }
                            else {
                                throw new Error(errorMessage)
                            }
                            tg.sendMessage(message.from.id, 'Cinemas')
                        })
                    })
                })
            })
        }
        catch (error){
            tg.sendMessage(message.chat.id, error)
            return Promise.reject(error);
        }
    })

    tg.onText(/\/settings/, function (message) {
        tg.sendMessage(message.chat.id, 'Settings')
    })

    tg.onText(/\/back/, function (message) {
        tg.sendMessage(message.chat.id, 'Back')
    })

    tg.onText(/\/cancel/, function (message) {
        tg.sendMessage(message.chat.id, 'Cancel')
    })

    tg.on('message', function (message) {

    })
}

function controlKeys() {
    tg.once('callback_query', function (message) {
        if (message.data === 'settingsCmd') {
            tg.sendMessage(message.chat.id, '/settings')
        }
        else if (message.data === 'backCmd') {
            tg.sendMessage(message.chat.id, '/back')
        }
        else if (message.data === 'cancelCmd') {
            tg.sendMessage(message.chat.id, '/cancel')
        }
    })
}

function errorMessage(message) {
    tg.sendMessage(message.chat.id, 'Sorry, I\'m afraid I don\'t follow you...')
}

function getContacts(message) {
    var substringArray = message.text.split(':')
    var splitArray = substringArray[1].split(',')
    if(splitArray[0] != undefined && splitArray[1] != undefined && splitArray[2] != undefined && splitArray[3] != undefined) {
        contact = {
            first_name: splitArray[0],
            last_name: splitArray[1],
            phone: splitArray[2],
            e_mail: splitArray[3]
        }

        tg.sendMessage(message.chat.id, 'Make sure that data has been entered correctly:\n'
            + 'first name - ' + contact.first_name + '\n'
            + 'last name - ' + contact.last_name + '\n'
            + 'phone - ' + contact.phone + '\n'
            + 'e-mail - ' + contact.e_mail, options)
        controlKeys()
    }
}

function getLocation(message) {
    var substringArray = message.text.split(':')
    var splitArray = substringArray[1].split(',')
    //find in db city and country
    if(splitArray[0] != undefined && splitArray[1] != undefined){
        location = {
            city: splitArray[0],
            country: splitArray[1]
        }
        var path = 'D:\\JustMovie\\Cinemas'
        var cinemas = [
            {
                name: 'Oasis',
                address: 'St. Stepan Bandera, 2А',
                contactCenter: '0 800 505 333',
                pathImage: '\\OasisT.jpg',
                city: 'Khmelnytskyi',
                country: 'Ukraine'
            },
            {
                name: 'Dafi',
                address: 'St. Heroyiv Pratsi, 9',
                contactCenter: '0 800 505 333',
                pathImage: '\\DafiT.jpg',
                city: 'Kharkiv',
                country: 'Ukraine'
            },
            {
                name: 'Hollywood',
                address: 'St. 77 Hvardiysʹkoyi dyviziyi, 1В',
                contactCenter: '0 800 505 333',
                pathImage: '\\HollywoodT.jpg',
                city: 'Chernigov',
                country: 'Ukraine'
            }
        ]

        cinemas.forEach(function (cinema, i, cinemas) {
            tg.sendPhoto(message.chat.id, path + cinema.pathImage,
                {
                    caption: cinema.name + '\n' + cinema.address + '\n' + cinema.contactCenter,
                    reply_markup: {
                        "inline_keyboard": [
                            [{text:'More details', callback_data: 'moreDetailsC'}],
                            [{text:'Choose', callback_data: 'chooseC'}]
                        ]
                    }
                })
        })
    }
    else {

    }
}

function sendPhotoOfCinema(cinema) {

}

create()