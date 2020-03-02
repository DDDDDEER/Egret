module egret {
	/**
	 * 数据层
	 */
	export class GameData extends egret.EventDispatcher{

		private static _instance: GameData = null;
		public static getInstance(): GameData{
			return GameData._instance ||(GameData._instance = new GameData());
		}

		public constructor() {
			super();
		}

		private _score: number;


		public set score(num:number){
			this._score = num;
		}

		public get score(): number{
			return this._score;
		}

		public addScore(score: number): void{
			if(score){
				this.score += score;
				// this.dispatchEvent(new GameEvent(GameEvent.SCORE_CHANGE));
			}
		}

		public resetScore(): void{
			this.score = 0;
		}
	}
}