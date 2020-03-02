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
     * 子弹
     */
    var Bullet = (function (_super) {
        __extends(Bullet, _super);
        function Bullet(texture) {
            var _this = _super.call(this) || this;
            if (texture.length > 0) {
                RES.getResByUrl("resource/assets/fly/" + texture, _this.loadComplete, _this);
                _this.bulletTexture = texture;
            }
            return _this;
        }
        Bullet.prototype.loadComplete = function (img) {
            this.content = new egret.Bitmap(img);
            this.addChild(this.content);
            this.width = this.content.width;
            this.height = this.content.height;
        };
        Bullet.factory = function (texture) {
            if (Bullet.cache[texture] == undefined) {
                Bullet.cache[texture] = [];
            }
            var dic = Bullet.cache[texture];
            var bullet;
            if (dic.length > 0) {
                bullet = dic.pop();
            }
            else {
                bullet = new Bullet(texture);
            }
            return bullet;
        };
        Bullet.recover = function (bullet) {
            if (Bullet.cache[bullet.bulletTexture] == undefined) {
                Bullet.cache[bullet.bulletTexture] = [];
            }
            var dic = Bullet.cache[bullet.bulletTexture];
            if (dic.indexOf(bullet) < 0) {
                dic.push(bullet);
            }
        };
        Bullet.cache = {};
        return Bullet;
    }(egret.DisplayObjectContainer));
    egret.Bullet = Bullet;
    __reflect(Bullet.prototype, "egret.Bullet");
})(egret || (egret = {}));
//# sourceMappingURL=Bullet.js.map