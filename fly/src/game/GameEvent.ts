module egret {
	export class GameEvent extends egret.Event{
		
		public static SHOT:string = "shot";

        public static SCORE_CHANGE: string = "score_change";

        public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any) {
            super(type, bubbles, cancelable, data);
        }
	}
}