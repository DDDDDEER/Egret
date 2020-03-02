module egret {
	/**
	 * 子弹
	 */
	export class Bullet extends egret.DisplayObjectContainer{

		public static cache:Object = {};

		public content: egret.Bitmap

		public bulletTexture: string;

		public constructor(texture:string) {
            super();
			if(texture.length>0){
				RES.getResByUrl("resource/assets/fly/"+texture,this.loadComplete,this);
				this.bulletTexture = texture;
			}
			
        }

		private loadComplete(img:egret.Texture){
			this.content = new Bitmap(img);
			this.addChild(this.content);
			this.width = this.content.width;
			this.height = this.content.height;
		}

		public static factory(texture:string): Bullet{
			if(Bullet.cache[texture] == undefined){
				Bullet.cache[texture] = [];
			}
			let dic:Array<Bullet> = Bullet.cache[texture];
			let bullet: Bullet;
			if(dic.length>0){
				bullet = dic.pop();
			}
			else{
				bullet = new Bullet(texture);
			}
			return bullet;
		}

		public static recover(bullet: Bullet): void{
			if(Bullet.cache[bullet.bulletTexture] == undefined){
				Bullet.cache[bullet.bulletTexture] = [];
			}
			let dic:Array<Bullet> = Bullet.cache[bullet.bulletTexture];
			if(dic.indexOf(bullet)<0){
				dic.push(bullet);
			}
		}
	}
}