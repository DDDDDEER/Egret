var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var egret;
(function (egret) {
    var GameUtil = (function () {
        function GameUtil() {
        }
        GameUtil.getInstance = function () {
            return GameUtil._instance || (GameUtil._instance = new GameUtil());
        };
        GameUtil.createImage = function (image, texture, callback, target, params) {
            var resourcePath = "resource/assets/fly/";
            RES.getResByUrl(resourcePath + texture, function (img) {
                image.texture = img;
                if (callback) {
                    callback.apply(target, params);
                }
            }, this);
        };
        GameUtil.prototype.drwaRect = function (obj) {
            var rect = obj.getBounds();
            rect.x = obj.x;
            rect.y = obj.y;
            return rect;
        };
        GameUtil.prototype.hitTest = function (objA, objB) {
            var rectA = this.drwaRect(objA);
            var rectB = this.drwaRect(objB);
            return rectA.intersects(rectB);
        };
        GameUtil.prototype.hitTestByRect = function (rect1, rect2) {
            return rect1.intersects(rect2);
        };
        GameUtil.remove = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var length = args.length;
            for (var i = 0; i < length; i++) {
                var displayObject = args[i];
                if (displayObject && displayObject.parent) {
                    displayObject.parent.removeChild(displayObject);
                }
            }
        };
        GameUtil._instance = null;
        return GameUtil;
    }());
    egret.GameUtil = GameUtil;
    __reflect(GameUtil.prototype, "egret.GameUtil");
})(egret || (egret = {}));
//# sourceMappingURL=GameUtil.js.map