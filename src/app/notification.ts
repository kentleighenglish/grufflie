
export class Notification {
	public text;
	public type;
	public id;
	public status;
	private _destroy;
	private _count: number = 0;
	private _delay: number = 200;
	private _death: number = 3000;

	constructor(private settings) {
		this.text = settings.text;
		this.type = settings.type;
		this.id = settings.id;

		if(this.type == 'error') {
			this._death = 10000;
		}

		this._destroy = settings.destroy;
		this.status = "init";

		var interval = setInterval(function(){
			if(this._count == 0) {
				this.status = "open";
			}

			if(this._count == this._death-this._delay) {
				this.status = "closed";
			}
			if(this._count == this._death) {
				clearInterval(interval);
				settings.destroy.call();
			}
			this._count = this._count + 100;
		}.bind(this), 100);
	}

	public destroy() {
		this.status = "closing";
		let die = setTimeout(function() {
			this.status = "closed";
			this._destroy.call();
		}.bind(this), this._delay);
	}
}
