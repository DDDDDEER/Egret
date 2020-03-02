module egret {
	export class GameUtil {

		private static _instance: GameUtil = null;
		public static getInstance(): GameUtil {
			return GameUtil._instance || (GameUtil._instance = new GameUtil());
		}

		public constructor() {
		}

		public static createImage(image: egret.Bitmap, texture: string, callback?: Function, target?: any, params?: Array<any>): void {
			let resourcePath: string = "resource/assets/fly/";
			RES.getResByUrl(resourcePath + texture, (img) => {
				image.texture = img;
				if (callback) {
					callback.apply(target, params);
				}
			}, this);
		}

		public drwaRect(obj:egret.DisplayObject):Rectangle{
			let rect: egret.Rectangle = obj.getBounds();
			rect.x = obj.x;
			rect.y = obj.y;
			return rect;
		}

		public hitTest(objA:egret.DisplayObject,objB:egret.DisplayObject): boolean{
			let rectA: egret.Rectangle = this.drwaRect(objA);
            let rectB: egret.Rectangle = this.drwaRect(objB);
            return rectA.intersects(rectB);
		}

		public hitTestByRect(rect1:egret.Rectangle,rect2:egret.Rectangle): boolean{
			return rect1.intersects(rect2);
		}

		public static remove(...args):void{
			var length:number = args.length;
			for(var i:number = 0;i < length;i++){
				var displayObject:DisplayObject = args[i];
				if(displayObject && displayObject.parent){
					displayObject.parent.removeChild(displayObject);
				}		
			}
		}
	}
}