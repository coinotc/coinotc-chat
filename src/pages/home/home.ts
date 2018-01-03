import { Component, OnInit } from '@angular/core';
import { NavController,AlertController, Events } from 'ionic-angular';
import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
	client: any;
	ref;
	typingStatus;
	name;
	newmessage;
	messagesList;
	typing = '';
	typeStatusId;
  
  constructor(public navCtrl: NavController, public alert: AlertController, public events: Events) {
		this.ref = firebase.database().ref('messages');
		this.typingStatus = firebase.database().ref('typeStatus');
		this.name = '';
	}
	
	ngOnInit() { 
		// Handle is typing event
		this.typingStatus.on('value',data => {
  		data.forEach( data => {
				if(typeof(data.val().name) !== 'undefined'){
					if(data.val().name !== this.name.username){
						this.typing = data.val().name + ' is typing...'
						setTimeout(() => {
							this.typing = ''
						}, 2000)
					}
				}
  		});
  	});
		
	}
 
	 onChange(e) {
		this.newmessage = e.target.value;
		//this.events.publish('chat:typing', this.name);
		this.typingStatus.push({
			name: this.name.username,
			datetime: Date.now()
		});
 	}

  ionViewDidLoad(){
  	// Presenting popup
  	this.alert.create({
  		title:'Username',
  		inputs:[{
  			name:'username',
  			placeholder: 'username'
  		}],
  		buttons:[{
  			text: 'Continue',
  			handler: username =>{
					this.name = username;
					// need to check list of logout users remove them as well. 
					this.typingStatus.on('value',data => {
						data.forEach( data => {
							console.log(data.val().id !== this.typeStatusId);
							if(typeof(data.val().name) !== 'undefined'){
								if(data.val().name === username){
									data.remove();
								}
							}
						});
					});
  			}
  		}]
		}).present();
		
		//reading data from firebase
  	this.ref.on('value',data => {
  		let tmp = [];
  		data.forEach( data => {
  			tmp.push({
  				key: data.key,
  				name: data.val().name,
  				message: data.val().message
  			})
  		});
  		this.messagesList = tmp;
		});
		
  }
  
  // send message
  send(){
  	// add new data to firebase
  	this.ref.push({
  		name: this.name.username,
			message: this.newmessage,
			datetime: Date.now()
		});
		this.newmessage = '';
  }

}
