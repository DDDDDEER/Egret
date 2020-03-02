module egret {
	/**
	 * 飞机
	 */
	export class Plane extends egret.DisplayObjectContainer {

		private _bodyImg: egret.Bitmap;
		private _texture: egret.Texture;

		private _fireTimer: egret.Timer;
		// 毫秒数
		public shotSpeed: number = 300;

		public static cache: Object = {};

		public planeTexture: string;

		private _explodeMc:egret.MovieClip;

		public constructor(source: string) {
			super();
			if (source.length > 0) {	
				this.planeTexture = source;
				// RES.getResAsync(source,this.loadComplete,this);
				RES.getResByUrl("resource/assets/fly/"+source,this.loadComplete,this);
			}
			
			this._fireTimer = new egret.Timer(this.shotSpeed,0);
			this._fireTimer.addEventListener(egret.TimerEvent.TIMER,this.shot,this);
		}

		private loadComplete(img:egret.Texture):void{
			this._bodyImg = new Bitmap(img);
			this.addChild(this._bodyImg);
			this.width = this._bodyImg.width;
			this.height = this._bodyImg.height;
			this.anchorOffsetX = this._bodyImg.width/2;
			this.anchorOffsetY = this._bodyImg.height/2;
		}

		public fire(delay:number = 300): void {
			this._fireTimer.delay = delay;
			this._fireTimer.start();
		}

		public stopFire(): void {
			this._fireTimer.stop();
		}

		public explode(): void {
			let data = RES.getRes("explode_eff_mc_json");
			let txtr = RES.getRes("explode_eff_tex_png");
			if(!data || !txtr){
				if(this._explodeEndHandler){
					this._explodeEndHandler.apply(this._funTarget,this._funParam);
					this._explodeEndHandler = null;
				}
				return ;
			}
			let mcFanctory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
			this._explodeMc = new egret.MovieClip(mcFanctory.generateMovieClipData());
			this._explodeMc.x = this.width/2;
			this._explodeMc.y = this.height/2;
			GameUtil.remove(this._bodyImg);
			this.addChild(this._explodeMc);
			this._explodeMc.play(1);
			let target: any = this;
			this._explodeMc.addEventListener(egret.Event.COMPLETE,()=>{
				target._explodeMc.stop();
				GameUtil.remove(target._explodeMc);
				if(target._explodeEndHandler){
					target._explodeEndHandler.apply(target._funTarget,target._funParam);
					target._explodeEndHandler = null;
				}
			},this);
		}

		private _explodeEndHandler: Function;
		private _funTarget:any;
		private _funParam:Array<any>;
		public setExplodeEndHandler(callback:Function,target:any,param?:Array<any>){
			this._explodeEndHandler = callback;
			this._funTarget = target;
			if(param){
				this._funParam = param;
			}
		}

		private shot(): void{
			this.dispatchEvent(new GameEvent(GameEvent.SHOT));
		}

		public reset(): void{
			if(!this._bodyImg.parent){
				this.addChild(this._bodyImg);
			}
		}

		public static factory(texture: string): Plane{
			if(Plane.cache[texture] == undefined){
				Plane.cache[texture] = [];
			}
			let dic: Array<Plane> = Plane.cache[texture];
			if(dic.length>0){
				var plane: Plane = dic.pop();
				plane.reset();
			}
			else{
				plane = new Plane(texture);
			}
			return plane;
		}

		public static recover(plane: Plane):void{
			if(Plane.cache[plane.planeTexture] == undefined){
				Plane.cache[plane.planeTexture] = [];
			}
			let dic: Array<Plane> = Plane.cache[plane.planeTexture];
			if(dic.indexOf(plane)<0){
				dic.push(plane);
			}
		}
	}
}