module egret {
	/**
	 * 游戏场景
	 */
	export class SceneWindow extends egret.DisplayObjectContainer {

		private static _instance: SceneWindow = null;
		public static getInstance(): SceneWindow {
			return SceneWindow._instance || (SceneWindow._instance = new SceneWindow());
		}
		public static stage: egret.Stage = null;

		private _role: Plane;

		private _map: MapBase;

		private _myBullet: Array<Bullet> = [];
		private _enemyBullet: Array<Bullet> = [];

		private _enemyArray: Array<Plane> = [];
		private _enemyTimer: egret.Timer;
		private _enemyCreateSpeed: number = 2000;

		private _scoreText: egret.TextField;

		public constructor() {
			super();
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.open, this);
		}

		public get width(): number{
			return SceneWindow.stage.stageWidth;
		}

		public open(): void {
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.open, this);
			if (!SceneWindow.stage) {
				SceneWindow.stage = this.stage;
			}
			this._map = new MapBase();
			this.addChild(this._map);
			this._scoreText = new TextField();
			this._scoreText.size = 30;
			this._scoreText.textColor = 0x000000;
			this._scoreText.bold = true;
			this._scoreText.width = this.width;
			this._scoreText.textAlign = egret.HorizontalAlign.CENTER;
			this.addChild(this._scoreText);
			this.startGame();
		}

		private startGame(): void {
			GameData.getInstance().resetScore();
			this._scoreText.text = "分数:"+GameData.getInstance().score;
			this._map.moveMap();
			this.initRole();
			this._enemyTimer = new Timer(this._enemyCreateSpeed);
			this._enemyTimer.addEventListener(egret.TimerEvent.TIMER,this.initEnemy,this);
			this._enemyTimer.start();
			this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchBegin,this);
			this.addEventListener(egret.Event.ENTER_FRAME,this.freshView,this);
			// this.addEventListener(GameEvent.SCORE_CHANGE,this.updateScore,this);
		}

		private stopGame(): void{

		}

		private overGame():void{
			this.removeEventListener(egret.Event.ENTER_FRAME,this.freshView,this);
			this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchBegin,this);
			this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchMoveHandler,this);
			// this.removeEventListener(GameEvent.SCORE_CHANGE,this.updateScore,this);
			this._map.stopMap();
			this._enemyTimer.stop();
		}

		private touchBegin(e:egret.TouchEvent):void{
			let target:any = this;
			egret.Tween.get(this._role).to({x:e.stageX,y:e.stageY},400).call(()=>{
				target.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,target.touchMoveHandler,target);
			},this);
			
		}

		private touchMoveHandler(e:egret.TouchEvent):void{
			this._role.x = Math.min(e.stageX,this.width-this._role.width/2);
			this._role.y = e.stageY;
		}

		private initRole(): void {
			this._role = Plane.factory("hero1.png");
			this._role.x = this.width/2;
			this._role.y = SceneWindow.stage.stageHeight - this._role.height/2 - 50;
			this.addChild(this._role);
			this._role.addEventListener(GameEvent.SHOT,this.shot,this);
			this._role.fire();
			
		}

		private initEnemy(): void {
			let random: number = Math.floor(Math.random()*4+1);
			let source: string = `enemy${random}.png`;
			let plane: Plane = Plane.factory(source);
			plane.addEventListener(GameEvent.SHOT,this.shot,this);
			plane.fire(500);
			plane.x = Math.max(Math.floor(Math.random()*(this.width-plane.width/2)+plane.width/2),120);
			plane.y = -plane.height;
			this.addChild(plane);
			this._enemyArray.push(plane);
		}

		private freshView(): void{
			for(let i = 0; i<this._myBullet.length; i++){
				var tempBullet: Bullet = this._myBullet[i];
				tempBullet.y -= 20;
				if(tempBullet.y < -tempBullet.height){
					GameUtil.remove(tempBullet);
					Bullet.recover(tempBullet);
					this._myBullet.splice(this._myBullet.indexOf(tempBullet),1);
					i--;
				}
			}
			for(let j = 0; j<this._enemyBullet.length; j++){
				tempBullet = this._enemyBullet[j];
				tempBullet.y += 10;
				if(tempBullet.y > SceneWindow.stage.stageHeight+tempBullet.height){
					GameUtil.remove(tempBullet);
					Bullet.recover(tempBullet);
					this._enemyBullet.splice(this._enemyBullet.indexOf(tempBullet),1);
					j--;
				}
			}
			for(let k = 0; k<this._enemyArray.length; k++){
				var tempEnemy: Plane = this._enemyArray[k];
				tempEnemy.y += 5;
				if(tempEnemy.y > SceneWindow.stage.stageHeight+tempEnemy.height){
					GameUtil.remove(tempEnemy);
					tempEnemy.stopFire();
					tempEnemy.removeEventListener(GameEvent.SHOT,this.shot,this);
					Plane.recover(tempEnemy);
					this._enemyArray.splice(this._enemyArray.indexOf(tempEnemy),1);
					k--;
				}
			}

			this.hitCheck();
		}

		private shot(e:GameEvent): void{
			if(e.target == this._role){
				var bullet: Bullet = Bullet.factory("bullet1.png");
				bullet.x = this._role.x - bullet.width/2;
				bullet.y = this._role.y - this._role.height/2 - bullet.height;
				this.addChild(bullet);
				this._myBullet.push(bullet);
			}
			else if(e.target.parent){
				let plane: Plane = e.target as Plane;
				let source = plane.planeTexture;
				switch(source){
					case "enemy1.png":
					case "enemy2.png":
						bullet = Bullet.factory("bullet2.png");
						break;
					case "enemy3.png":
						bullet = Bullet.factory("bullet3.png");
						break;
					case "enemy4.png":
						bullet = Bullet.factory("bullet4.png");
						break;
				}
				if(bullet){
					bullet.x = e.target.x - bullet.width/2;
					bullet.y = e.target.y + e.target.height/2;
					this.addChild(bullet);
					this._enemyBullet.push(bullet);
				}
			}
		}

		private hitCheck(): void{
			let target: any = this;
			for(let i = 0; i<this._myBullet.length;i++){
				var bullet: Bullet = this._myBullet[i];
				for(let j = 0; j<this._enemyArray.length;j++){
					var enemy:Plane = this._enemyArray[j];
					var rect1:egret.Rectangle = GameUtil.getInstance().drwaRect(bullet);
					var rect2:egret.Rectangle = GameUtil.getInstance().drwaRect(enemy);
					rect2.x = rect2.x - enemy.width/2;
					rect2.y = rect2.y - enemy.height/2;
					if(GameUtil.getInstance().hitTestByRect(rect1,rect2)){
						GameData.getInstance().addScore(10);
						this.updateScore();
						enemy.explode();
						enemy.setExplodeEndHandler((child)=>{
							GameUtil.remove(child);
						},this,[enemy]);
						enemy.removeEventListener(GameEvent.SHOT,this.shot,this);
						enemy.stopFire();
						Plane.recover(enemy);
						this._enemyArray.splice(this._enemyArray.indexOf(enemy),1);
						j--;
					}
				}
			}
			for(let i = 0; i<this._enemyBullet.length;i++){
				bullet = this._enemyBullet[i];
				rect1 = GameUtil.getInstance().drwaRect(bullet);
				rect2 = GameUtil.getInstance().drwaRect(this._role);
				rect2.x = this._role.x - this._role.width/2;
				rect2.y = this._role.y - this._role.height/2;
				if(GameUtil.getInstance().hitTestByRect(rect1,rect2)){
					this._role.explode();
					this._role.removeEventListener(GameEvent.SHOT,this.shot,this);
					this._role.stopFire();
					Plane.recover(this._role);
					this.overGame();
				}
			}
			for (let i in this._enemyArray){
				enemy = this._enemyArray[i];
				if(enemy.parent){
					rect1 = GameUtil.getInstance().drwaRect(enemy);
					rect2 = GameUtil.getInstance().drwaRect(this._role);
					rect1.x = enemy.x - enemy.width/2;
					rect1.y = enemy.y - enemy.height/2;
					rect2.x = this._role.x - this._role.width/2;
					rect2.y = this._role.y - this._role.height/2;
					if(GameUtil.getInstance().hitTestByRect(rect1,rect2)){
						this._role.explode();
						this._role.stopFire();
						this._role.removeEventListener(GameEvent.SHOT,this.shot,this);
						Plane.recover(this._role);
						this.overGame();
					}
				}
			}
		}

		private updateScore(): void{
			this._scoreText.text = "分数:"+GameData.getInstance().score;
		}

	}
}