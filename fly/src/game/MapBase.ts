module egret {
	export class MapBase extends egret.DisplayObjectContainer {

		private _imgArray: Array<eui.Image> = [];
		private _imgTexture: egret.Texture;
		private _mapWidth: number = 0;
		private _mapHeight: number = 0;

		private _scrollSpeed: number = 3;
		private _stage: egret.Stage = SceneWindow.stage;

		private _maxCount: number = 0;

		public constructor(source: string = "background.jpg") {
			super();
			if (source.length > 0) {
				// RES.getResAsync(source, this.loadComplete, this);
				RES.getResByUrl("resource/assets/fly/"+source,this.loadComplete,this);
			}
		}

		private loadComplete(img: egret.Texture): void {
			if (img) {
				this._imgTexture = img;
				this._mapWidth = this.width = img.textureWidth;
				this._mapHeight = img.textureHeight;
			}
			this.initMap();
		}

		public initMap(): void {
			if (!this._imgTexture) {
				console.log("地图资源加载错误");
				return;
			}
			if (this._stage) {
				this._maxCount = Math.ceil(this._stage.stageHeight / this._mapHeight) + 1;
				for (let i: number = 0; i < this._maxCount; i++) {
					let tempImg: eui.Image = new eui.Image(this._imgTexture);
					tempImg.y = this._mapHeight * (i - 1);
					tempImg.x = 0;
					tempImg.width = this._stage.stageWidth;
					this._imgArray.push(tempImg);
					this.addChild(tempImg);
				}
			}
			else {
				console.log("舞台未初始化");
			}
		}

		public moveMap(): void {
			if (!this.hasEventListener(egret.Event.ENTER_FRAME)) {
				this.addEventListener(egret.Event.ENTER_FRAME, this.moveHandle, this);
			}
		}

		private moveHandle(): void {
			for(let i in this._imgArray){
				let tempImg: eui.Image = this._imgArray[i];
				tempImg.y += this._scrollSpeed;
				if(tempImg.y>this._stage.stageHeight){
					tempImg.y = this._imgArray[0].y - this._mapHeight;
					this._imgArray.pop();
					this._imgArray.unshift(tempImg);
				}
			}
		}

		public stopMap(): void{
			if (this.hasEventListener(egret.Event.ENTER_FRAME)) {
				this.removeEventListener(egret.Event.ENTER_FRAME, this.moveHandle, this);
			}
		}



	}
}