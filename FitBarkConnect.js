'use strict';

const request = require('request-promise-native'); 
const moment = require('moment');

const apiTotal = 'https://app.fitbark.com/api/v2/activity_totals';
const apiGoal = 'https://app.fitbark.com/api/v2/daily_goal/';
const apiInfo = 'https://app.fitbark.com/api/v2/dog/';
const apiSimDogs = 'https://app.fitbark.com/api/v2/similar_dogs_stats';
const apiTime = 'https://app.fitbark.com/api/v2/time_breakdown';

module.exports = class FitBarkConnect {

	constructor(credentials) {
		this.credentials = credentials;
	}

	getDailyGoal() {
		let options = {
			url: apiGoal + this.credentials.dog,
			headers: {'Authorization': 'Bearer ' + this.credentials.token},
			json: true
		};
		return request.get(options);
	}

	getDogInfo() {
		let options = {
			url: apiInfo + this.credentials.dog,
			headers: {'Authorization': 'Bearer ' + this.credentials.token},
			json: true
		};
		return request.get(options);
	}

	getDailyTotal() {
		let theDate = moment();
		let options = {
			url: apiTotal,
			headers: {'Authorization': 'Bearer ' + this.credentials.token},
			body: {
				"dog": {
					"slug": this.credentials.dog,
					"from": theDate.format('YYYY-MM-DD'),
					"to": theDate.format('YYYY-MM-DD')
				}	
			},
			json: true
		};
		return request.post(options);
	}

	getWeeklyTotal() {
        let theDate = moment();
        let options = {
            url: apiTotal,
            headers: {'Authorization': 'Bearer ' + this.credentials.token},
            body: {
                "dog": {
                    "slug": this.credentials.dog,
                    "to": theDate.subtract(1, 'day').format('YYYY-MM-DD'),
                    "from": theDate.subtract(8, 'day').format('YYYY-MM-DD')
                }
            },
            json: true
        };
        return request.post(options);
    }

	getMonthlyTotal() {
        let theDate = moment();
        let options = {
            url: apiTotal,
            headers: {'Authorization': 'Bearer ' + this.credentials.token},
            body: {
                "dog": {
                    "slug": this.credentials.dog,
                    "to": theDate.subtract(1, 'day').format('YYYY-MM-DD'),
                    "from": theDate.subtract(31, 'day').format('YYYY-MM-DD')
                }
            },
            json: true
        };
        return request.post(options);
    }

	getSimilarDogs() {
		let options = {
			url: apiSimDogs,
			headers: {'Authorization': 'Bearer ' + this.credentials.token},
            body: {
                "slug": this.credentials.dog,
            },
            json: true
        };
        return request.post(options);
	}

	getPercentage() {
		let theDate = moment();
        let options = {
            url: apiTime,
            headers: {'Authorization': 'Bearer ' + this.credentials.token},
       		body: {
                "dog": {
					"slug": this.credentials.dog,
					"from": theDate.format('YYYY-MM-DD'),
					"to": theDate.format('YYYY-MM-DD')
				}
            },
            json: true
        };
        return request.post(options);
    }

};
