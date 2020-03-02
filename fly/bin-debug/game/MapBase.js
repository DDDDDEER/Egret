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
    var MapBase = (function (_super) {
        __extends(MapBase, _super);
        function MapBase(source) {
            if (source === void 0) { source = "background.jpg"; }
            var _this = _super.call(this) || this;
            _this._imgArray = [];
            _this._mapWidth = 0;
            _this._mapHeight = 0;
            _this._scrollSpeed = 3;
            _this._stage = egret.SceneWindow.stage;
            _this._maxCount = 0;
            if (source.length > 0) {
                // RES.getResAsync(source, this.loadComplete, this);
                RES.getResByUrl("resource/assets/fly/" + source, _this.loadComplete, _this);
            }
            return _this;
        }
        MapBase.prototype.loadComplete = function (img) {
            if (img) {
                this._imgTexture = img;
                this._mapWidth = this.width = img.textureWidth;
                this._mapHeight = img.textureHeight;
            }
            this.initMap();
        };
        MapBase.prototype.initMap = function () {
            if (!this._imgTexture) {
                console.log("地图资源加载错误");
                return;
            }
            if (this._stage) {
                this._maxCount = Math.ceil(this._stage.stageHeight / this._mapHeight) + 1;
                for (var i = 0; i < this._maxCount; i++) {
                    var tempImg = new eui.Image(this._imgTexture);
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
        };
        MapBase.prototype.moveMap = function () {
            if (!this.hasEventListener(egret.Event.ENTER_FRAME)) {
                this.addEventListener(egret.Event.ENTER_FRAME, this.moveHandle, this);
            }
        };
        MapBase.prototype.moveHandle = function () {
            for (var i in this._imgArray) {
                var tempImg = this._imgArray[i];
                tempImg.y += this._scrollSpeed;
                if (tempImg.y > this._stage.stageHeight) {
                    tempImg.y = this._imgArray[0].y - this._mapHeight;
                    this._imgArray.pop();
                    this._imgArray.unshift(tempImg);
                }
            }
        };
        MapBase.prototype.stopMap = function () {
            if (this.hasEventListener(egret.Event.ENTER_FRAME)) {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.moveHandle, this);
            }
        };
        return MapBase;
    }(egret.DisplayObjectContainer));
    egret.MapBase = MapBase;
    __reflect(MapBase.prototype, "egret.MapBase");
})(egret || (egret = {}));
//# sourceMappingURL=MapBase.js.map