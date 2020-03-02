var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var egret;
(function (egret) {
    /**
     * 数据层
     */
    var GameData = (function (_super) {
        __extends(GameData, _super);
        function GameData() {
            return _super.call(this) || this;
        }
        GameData.getInstance = function () {
            return GameData._instance || (GameData._instance = new GameData());
        };
        Object.defineProperty(GameData.prototype, "score", {
            get: function () {
                return this._score;
            },
            set: function (num) {
                this._score = num;
            },
            enumerable: true,
            configurable: true
        });
        GameData.prototype.addScore = function (score) {
            if (score) {
                this.score += score;
                // this.dispatchEvent(new GameEvent(GameEvent.SCORE_CHANGE));
            }
        };
        GameData.prototype.resetScore = function () {
            this.score = 0;
        };
        GameData._instance = null;
        return GameData;
    }(egret.EventDispatcher));
    egret.GameData = GameData;
    __reflect(GameData.prototype, "egret.GameData");
})(egret || (egret = {}));
//# sourceMappingURL=GameData.js.map