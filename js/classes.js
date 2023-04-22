class Settings {
	constructor(p1color, p2color, ivolume, spcontrols) {
		this.p1color = p1color;
		this.p2color = p2color;
		this.volume = ivolume;
		this.controls = spcontrols;
	}
}

class User {
	constructor(pId, pEmail, pUsername, pPw){
		this.id = pId;
		this.email = pEmail;
		this.username = pUsername;
		this.pw = pPw;
	}
}

class Score {
	constructor(pId, pScore, pUserId){
		this.id = pId;
		this.score = pScore;
		this.user_id = pUserId;
	}
}