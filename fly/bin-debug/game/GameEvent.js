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
    var GameEvent = (function (_super) {
        __extends(GameEvent, _super);
        function GameEvent(type, bubbles, cancelable, data) {
            return _super.call(this, type, bubbles, cancelable, data) || this;
        }
        GameEvent.SHOT = "shot";
        GameEvent.SCORE_CHANGE = "score_change";
        return GameEvent;
    }(egret.Event));
    egret.GameEvent = GameEvent;
    __reflect(GameEvent.prototype, "egret.GameEvent");
})(egret || (egret = {}));
//# sourceMappingURL=GameEvent.js.map