'use strict';

/* Magic Mirror
 * Module: MMM-FitBark
 * 
 * By Luke Moch http://github.com/mochman/
 * MIT Licensed
 */

const NodeHelper = require('node_helper');
const FitBarkConnect = require('./FitBarkConnect');

module.exports = NodeHelper.create({
	start: function() {
		this.connection = undefined;
	},

	socketNotificationReceived: function(notification, payload) {
		this.connection = new FitBarkConnect(payload);
		switch (notification) {
			case 'GET_DOG_INFO':
				this.getInfo();
				break;
			case 'GET_DOG_GOAL':
				this.getGoal();
				break;
			case 'GET_DOG_TOTAL':
				this.getTotal();
				break;
			case 'GET_SIMILAR_DOG':
				this.getSimDogs();
				break;
			case 'GET_PERCENTAGE':
				this.getPer();
				break;
			case 'GET_WEEK_TOTAL':
				this.getWeekTotal();
				break;
			case 'GET_MONTH_TOTAL':
				this.getMonthTotal();
				break;
			default:
				console.log("Wrong Notification");
		}
	},

	getInfo: function() {
		this.connection.getDogInfo()
			.then((response) => {
				if(response) {
					 this.sendSocketNotification('DOG_INFO', response);
				} else {
					console.log("No Response - Info");
				}
			})
			.catch((error) => {
				console.log("Something Went Wrong: Info");
				console.error(error);
			});
	},

	getGoal: function() {
        this.connection.getDailyGoal()
            .then((response) => {
                if(response) {
                    this.sendSocketNotification('DOG_GOAL', response);
                } else {
                    console.log("No Response - Goal");
                }
            })
            .catch((error) => {
                console.log("Something Went Wrong: Goal");
                console.error(error);
            });
    },

	getTotal: function() {
        this.connection.getDailyTotal()
            .then((response) => {
                if(response) {
					this.sendSocketNotification('DOG_TOTAL', response);
                } else {
                    console.log("No Response - Total");
                }
            })
            .catch((error) => {
                console.log("Something Went Wrong: Total");
                console.error(error);
            });
    },

	getWeekTotal: function() {
        this.connection.getWeeklyTotal()
            .then((response) => {
                if(response) {
                    this.sendSocketNotification('DOG_WEEK', response);
                } else {
                    console.log("No Response - Weekly Total");
                }
            })
            .catch((error) => {
                console.log("Something Went Wrong: Weekly Total");
                console.error(error);
            });
    },

	getMonthTotal: function() {
        this.connection.getMonthlyTotal()
            .then((response) => {
                if(response) {
                    this.sendSocketNotification('DOG_MONTH', response);
                } else {
                    console.log("No Response - Monthly Total");
                }
            })
            .catch((error) => {
                console.log("Something Went Wrong: Monthly Total");
                console.error(error);
            });
    },

	getSimDogs: function() {
        this.connection.getSimilarDogs()
            .then((response) => {
                if(response) {
                    this.sendSocketNotification('DOG_SIMILAR', response);
                } else {
                    console.log("No Response - Similar");
                }
            })
            .catch((error) => {
                console.log("Something Went Wrong: Similar Dogs");
                console.error(error);
            });
    },
	getPer: function() {
        this.connection.getPercentage()
            .then((response) => {
                if(response) {
                    this.sendSocketNotification('PERCENTAGE', response);
                } else {
                    console.log("No Response - Percentage");
                }
            })
            .catch((error) => {
                console.log("Something Went Wrong: Percentage");
                console.error(error);
            });
	}

});
