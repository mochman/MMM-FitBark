/* Magic Mirror
 * Module: MMM-FitBark
 *
 * By Luke Moch
 * MIT Licensed.
 */

Module.register("MMM-FitBark",{
	defaults: {
		token: "",
		dog: "",
		units: config.units,
		updateInterval: 60 * 1000, 	//	Updates every minute by default
		animationSpeed: 2 * 1000, 	
		initialLoadDelay: 0

	},

	getScripts: function() {
		return ["moment.js"];
	},
	
	// Define required scripts.
	getStyles: function() {
		return ["MMM-FitBark.css"];
	},

	start: function() {
		this.loaded = false;
		this.dogName = "";
		this.dogGoal = 0;
		this.dogTotal = 0;
		this.simDogs = 0;
		this.dogActivePercent = 0.0;
		this.weeklyTotal = 0;
		this.monthlyTotal = 0;
		this.batteryLevel = 0;
		this.timeCompare = "";
		this.lastSyncTime = moment();
		this.lastPoints = -1;
		this.updateLoop();
	},

	getDom: function() {
		this.textColor = "";
		this.syncHours = 0;
		this.timeText = "";
		var wrapper = document.createElement("div");
		if(this.loaded == false) {
			wrapper.innerHTML = "Loading...";
			wrapper.className = "small";
			return wrapper;
		}
		var nameLabel = document.createElement("div");
		nameLabel.innerHTML = this.dogName + "'s Daily Activity"
		nameLabel.className = "medium";
		if (this.dogTotal > this.dogGoal && this.dogTotal > this.simDogs) {
                this.textColor = "green";
        } else if (this.dogTotal > this.dogGoal || this.dogTotal > this.simDogs) {
				this.textColor = "yellow";
		} else {
			this.textColor = "red";
		}
		var syncLabel = document.createElement("div");
		syncLabel.innerHTML = "Waiting for first sync of the day...";
		syncLabel.className = "small italic dimmed";	
		var points = document.createElement("div");
		points.innerHTML = "<font color=\"" + this.textColor + "\">" + this.dogTotal + "</font> out of <b>" + this.dogGoal + "</b>";
		points.className = "small";
		var weeklyAvg = document.createElement("div");
        weeklyAvg.innerHTML = "Weekly Avg: " + this.weeklyTotal.toFixed(0);
        weeklyAvg.className = "small";
		var monthlyAvg = document.createElement("div");
        monthlyAvg.innerHTML = "Monthly Avg: " + this.monthlyTotal.toFixed(0);
        monthlyAvg.className = "small";
		var simDogTot = document.createElement("div");
        simDogTot.innerHTML = "Similar Dog Avg: " + this.simDogs;
        simDogTot.className = "small";
		var battLev = document.createElement("div");
		battLev.innerHTML = "Battery at <font color=\"red\">" + this.batteryLevel + "%</font>";
		battLev.className = "small";
		var activeAvg = document.createElement("div");
		activeAvg.innerHTML = "Active " + this.dogActivePercent.toFixed(0) + "% of the day";
		activeAvg.className = "small";
		var timeUpdate = document.createElement("div");
		if(this.timeCompare >= 60) {
			this.syncHours = Math.floor(this.timeCompare / 60);
			this.timeText = "Synced " + this.syncHours + "h " + Math.round(this.timeCompare - this.syncHours * 60) + "m ago";
		} else {
			this.timeText = "Synced " + Math.round(this.timeCompare) + "m ago";
		}
		timeUpdate.innerHTML = this.timeText;
		timeUpdate.className = "xsmall thin light";
		
		wrapper.appendChild(nameLabel);
		if (this.dogTotal == 0) {
			wrapper.appendChild(syncLabel);
			wrapper.appendChild(weeklyAvg);
			wrapper.appendChild(monthlyAvg);
			wrapper.appendChild(simDogTot);
			if(this.batteryLevel <= 33) {
				wrapper.appendChild(battLev);
			}
			return wrapper;
		}
		wrapper.appendChild(points);
		wrapper.appendChild(simDogTot);
        wrapper.appendChild(weeklyAvg);
		wrapper.appendChild(monthlyAvg);
		wrapper.appendChild(activeAvg);
		if(this.batteryLevel <= 33) {
			wrapper.appendChild(battLev);
		}
		wrapper.appendChild(timeUpdate);
		return wrapper;	
	},

	socketNotificationReceived: function (notification, payload) {
		switch(notification) {
			case 'DOG_INFO':
				this.batteryLevel = payload.dog.battery_level;
				this.dogName = payload.dog.name;
				break;
			case 'DOG_GOAL':
				this.dogGoal = payload.daily_goals[0].goal;
				break;
			case 'DOG_TOTAL':
				let timeNow = moment();
				this.dogTotal = payload.activity_value;
				if(this.dogTotal == this.lastPoints) {
					let timeDiff = moment.duration(timeNow.diff(this.lastSyncTime));
					this.timeCompare = timeDiff.asMinutes();
				} else {
					this.lastPoints = this.dogTotal;
					this.lastSyncTime = moment();
					this.timeCompare = 0;
				}
				break;
			case 'DOG_SIMILAR':
				this.simDogs = payload.similar_dogs_stats.median_same_breed_daily_activity;
				break;
			case 'DOG_WEEK':
				this.weeklyTotal = payload.activity_value / 7;
				break;
			case 'DOG_MONTH':
				this.monthlyTotal = payload.activity_value / 30;
				break;
			case 'PERCENTAGE':
				this.dogActivePercent = (payload.activity_level.min_play + payload.activity_level.min_active) /
					(payload.activity_level.min_play + payload.activity_level.min_active + payload.activity_level.min_rest) * 100;
				break;
		}
		if(this.dogName != "" && this.dogGoal !=0 && this.simDogs != 0) {
			this.loaded = true;
		}
        this.updateDom(self.config.animationSpeed);
    },

	updateLoop: function() {
			this.sendSocketNotification("GET_DOG_INFO", {'token': this.config.token, 'dog': this.config.dog});
            this.sendSocketNotification("GET_DOG_GOAL", {'token': this.config.token, 'dog': this.config.dog});
            this.sendSocketNotification("GET_DOG_TOTAL", {'token': this.config.token, 'dog': this.config.dog});
			this.sendSocketNotification("GET_SIMILAR_DOG", {'token': this.config.token, 'dog': this.config.dog});
			this.sendSocketNotification("GET_PERCENTAGE", {'token': this.config.token, 'dog': this.config.dog});
			this.sendSocketNotification("GET_WEEK_TOTAL", {'token': this.config.token, 'dog': this.config.dog});
			this.sendSocketNotification("GET_MONTH_TOTAL", {'token': this.config.token, 'dog': this.config.dog});
		setInterval(() => {
			this.sendSocketNotification("GET_DOG_INFO", {'token': this.config.token, 'dog': this.config.dog});
			this.sendSocketNotification("GET_DOG_GOAL", {'token': this.config.token, 'dog': this.config.dog});
			this.sendSocketNotification("GET_DOG_TOTAL", {'token': this.config.token, 'dog': this.config.dog});
			this.sendSocketNotification("GET_SIMILAR_DOG", {'token': this.config.token, 'dog': this.config.dog});
			this.sendSocketNotification("GET_PERCENTAGE", {'token': this.config.token, 'dog': this.config.dog});
			this.sendSocketNotification("GET_WEEK_TOTAL", {'token': this.config.token, 'dog': this.config.dog});
			this.sendSocketNotification("GET_MONTH_TOTAL", {'token': this.config.token, 'dog': this.config.dog});
		}, this.config.updateInterval);
	}	

});
