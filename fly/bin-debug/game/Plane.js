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
     * 飞机
     */
    var Plane = (function (_super) {
        __extends(Plane, _super);
        function Plane(source) {
            var _this = _super.call(this) || this;
            // 毫秒数
            _this.shotSpeed = 300;
            if (source.length > 0) {
                _this.planeTexture = source;
                // RES.getResAsync(source,this.loadComplete,this);
                RES.getResByUrl("resource/assets/fly/" + source, _this.loadComplete, _this);
            }
            _this._fireTimer = new egret.Timer(_this.shotSpeed, 0);
            _this._fireTimer.addEventListener(egret.TimerEvent.TIMER, _this.shot, _this);
            return _this;
        }
        Plane.prototype.loadComplete = function (img) {
            this._bodyImg = new egret.Bitmap(img);
            this.addChild(this._bodyImg);
            this.width = this._bodyImg.width;
            this.height = this._bodyImg.height;
            this.anchorOffsetX = this._bodyImg.width / 2;
            this.anchorOffsetY = this._bodyImg.height / 2;
        };
        Plane.prototype.fire = function (delay) {
            if (delay === void 0) { delay = 300; }
            this._fireTimer.delay = delay;
            this._fireTimer.start();
        };
        Plane.prototype.stopFire = function () {
            this._fireTimer.stop();
        };
        Plane.prototype.explode = function () {
            var data = RES.getRes("explode_eff_mc_json");
            var txtr = RES.getRes("explode_eff_tex_png");
            if (!data || !txtr) {
                if (this._explodeEndHandler) {
                    this._explodeEndHandler.apply(this._funTarget, this._funParam);
                    this._explodeEndHandler = null;
                }
                return;
            }
            var mcFanctory = new egret.MovieClipDataFactory(data, txtr);
            this._explodeMc = new egret.MovieClip(mcFanctory.generateMovieClipData());
            this._explodeMc.x = this.width / 2;
            this._explodeMc.y = this.height / 2;
            egret.GameUtil.remove(this._bodyImg);
            this.addChild(this._explodeMc);
            this._explodeMc.play(1);
            var target = this;
            this._explodeMc.addEventListener(egret.Event.COMPLETE, function () {
                target._explodeMc.stop();
                egret.GameUtil.remove(target._explodeMc);
                if (target._explodeEndHandler) {
                    target._explodeEndHandler.apply(target._funTarget, target._funParam);
                    target._explodeEndHandler = null;
                }
            }, this);
        };
        Plane.prototype.setExplodeEndHandler = function (callback, target, param) {
            this._explodeEndHandler = callback;
            this._funTarget = target;
            if (param) {
                this._funParam = param;
            }
        };
        Plane.prototype.shot = function () {
            this.dispatchEvent(new egret.GameEvent(egret.GameEvent.SHOT));
        };
        Plane.prototype.reset = function () {
            if (!this._bodyImg.parent) {
                this.addChild(this._bodyImg);
            }
        };
        Plane.factory = function (texture) {
            if (Plane.cache[texture] == undefined) {
                Plane.cache[texture] = [];
            }
            var dic = Plane.cache[texture];
            if (dic.length > 0) {
                var plane = dic.pop();
                plane.reset();
            }
            else {
                plane = new Plane(texture);
            }
            return plane;
        };
        Plane.recover = function (plane) {
            if (Plane.cache[plane.planeTexture] == undefined) {
                Plane.cache[plane.planeTexture] = [];
            }
            var dic = Plane.cache[plane.planeTexture];
            if (dic.indexOf(plane) < 0) {
                dic.push(plane);
            }
        };
        Plane.cache = {};
        return Plane;
    }(egret.DisplayObjectContainer));
    egret.Plane = Plane;
    __reflect(Plane.prototype, "egret.Plane");
})(egret || (egret = {}));
//# sourceMappingURL=Plane.js.map