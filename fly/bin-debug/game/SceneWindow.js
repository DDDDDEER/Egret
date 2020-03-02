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
     * 游戏场景
     */
    var SceneWindow = (function (_super) {
        __extends(SceneWindow, _super);
        function SceneWindow() {
            var _this = _super.call(this) || this;
            _this._myBullet = [];
            _this._enemyBullet = [];
            _this._enemyArray = [];
            _this._enemyCreateSpeed = 2000;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.open, _this);
            return _this;
        }
        SceneWindow.getInstance = function () {
            return SceneWindow._instance || (SceneWindow._instance = new SceneWindow());
        };
        Object.defineProperty(SceneWindow.prototype, "width", {
            get: function () {
                return SceneWindow.stage.stageWidth;
            },
            enumerable: true,
            configurable: true
        });
        SceneWindow.prototype.open = function () {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.open, this);
            if (!SceneWindow.stage) {
                SceneWindow.stage = this.stage;
            }
            this._map = new egret.MapBase();
            this.addChild(this._map);
            this._scoreText = new egret.TextField();
            this._scoreText.size = 30;
            this._scoreText.textColor = 0x000000;
            this._scoreText.bold = true;
            this._scoreText.width = this.width;
            this._scoreText.textAlign = egret.HorizontalAlign.CENTER;
            this.addChild(this._scoreText);
            this.startGame();
        };
        SceneWindow.prototype.startGame = function () {
            egret.GameData.getInstance().resetScore();
            this._scoreText.text = "分数:" + egret.GameData.getInstance().score;
            this._map.moveMap();
            this.initRole();
            this._enemyTimer = new egret.Timer(this._enemyCreateSpeed);
            this._enemyTimer.addEventListener(egret.TimerEvent.TIMER, this.initEnemy, this);
            this._enemyTimer.start();
            this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.freshView, this);
            // this.addEventListener(GameEvent.SCORE_CHANGE,this.updateScore,this);
        };
        SceneWindow.prototype.stopGame = function () {
        };
        SceneWindow.prototype.overGame = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.freshView, this);
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveHandler, this);
            // this.removeEventListener(GameEvent.SCORE_CHANGE,this.updateScore,this);
            this._map.stopMap();
            this._enemyTimer.stop();
        };
        SceneWindow.prototype.touchBegin = function (e) {
            var target = this;
            egret.Tween.get(this._role).to({ x: e.stageX, y: e.stageY }, 400).call(function () {
                target.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, target.touchMoveHandler, target);
            }, this);
        };
        SceneWindow.prototype.touchMoveHandler = function (e) {
            this._role.x = Math.min(e.stageX, this.width - this._role.width / 2);
            this._role.y = e.stageY;
        };
        SceneWindow.prototype.initRole = function () {
            this._role = egret.Plane.factory("hero1.png");
            this._role.x = this.width / 2;
            this._role.y = SceneWindow.stage.stageHeight - this._role.height / 2 - 50;
            this.addChild(this._role);
            this._role.addEventListener(egret.GameEvent.SHOT, this.shot, this);
            this._role.fire();
        };
        SceneWindow.prototype.initEnemy = function () {
            var random = Math.floor(Math.random() * 4 + 1);
            var source = "enemy" + random + ".png";
            var plane = egret.Plane.factory(source);
            plane.addEventListener(egret.GameEvent.SHOT, this.shot, this);
            plane.fire(500);
            plane.x = Math.max(Math.floor(Math.random() * (this.width - plane.width / 2) + plane.width / 2), 120);
            plane.y = -plane.height;
            this.addChild(plane);
            this._enemyArray.push(plane);
        };
        SceneWindow.prototype.freshView = function () {
            for (var i = 0; i < this._myBullet.length; i++) {
                var tempBullet = this._myBullet[i];
                tempBullet.y -= 20;
                if (tempBullet.y < -tempBullet.height) {
                    egret.GameUtil.remove(tempBullet);
                    egret.Bullet.recover(tempBullet);
                    this._myBullet.splice(this._myBullet.indexOf(tempBullet), 1);
                    i--;
                }
            }
            for (var j = 0; j < this._enemyBullet.length; j++) {
                tempBullet = this._enemyBullet[j];
                tempBullet.y += 10;
                if (tempBullet.y > SceneWindow.stage.stageHeight + tempBullet.height) {
                    egret.GameUtil.remove(tempBullet);
                    egret.Bullet.recover(tempBullet);
                    this._enemyBullet.splice(this._enemyBullet.indexOf(tempBullet), 1);
                    j--;
                }
            }
            for (var k = 0; k < this._enemyArray.length; k++) {
                var tempEnemy = this._enemyArray[k];
                tempEnemy.y += 5;
                if (tempEnemy.y > SceneWindow.stage.stageHeight + tempEnemy.height) {
                    egret.GameUtil.remove(tempEnemy);
                    tempEnemy.stopFire();
                    tempEnemy.removeEventListener(egret.GameEvent.SHOT, this.shot, this);
                    egret.Plane.recover(tempEnemy);
                    this._enemyArray.splice(this._enemyArray.indexOf(tempEnemy), 1);
                    k--;
                }
            }
            this.hitCheck();
        };
        SceneWindow.prototype.shot = function (e) {
            if (e.target == this._role) {
                var bullet = egret.Bullet.factory("bullet1.png");
                bullet.x = this._role.x - bullet.width / 2;
                bullet.y = this._role.y - this._role.height / 2 - bullet.height;
                this.addChild(bullet);
                this._myBullet.push(bullet);
            }
            else if (e.target.parent) {
                var plane = e.target;
                var source = plane.planeTexture;
                switch (source) {
                    case "enemy1.png":
                    case "enemy2.png":
                        bullet = egret.Bullet.factory("bullet2.png");
                        break;
                    case "enemy3.png":
                        bullet = egret.Bullet.factory("bullet3.png");
                        break;
                    case "enemy4.png":
                        bullet = egret.Bullet.factory("bullet4.png");
                        break;
                }
                if (bullet) {
                    bullet.x = e.target.x - bullet.width / 2;
                    bullet.y = e.target.y + e.target.height / 2;
                    this.addChild(bullet);
                    this._enemyBullet.push(bullet);
                }
            }
        };
        SceneWindow.prototype.hitCheck = function () {
            var target = this;
            for (var i = 0; i < this._myBullet.length; i++) {
                var bullet = this._myBullet[i];
                for (var j = 0; j < this._enemyArray.length; j++) {
                    var enemy = this._enemyArray[j];
                    var rect1 = egret.GameUtil.getInstance().drwaRect(bullet);
                    var rect2 = egret.GameUtil.getInstance().drwaRect(enemy);
                    rect2.x = rect2.x - enemy.width / 2;
                    rect2.y = rect2.y - enemy.height / 2;
                    if (egret.GameUtil.getInstance().hitTestByRect(rect1, rect2)) {
                        egret.GameData.getInstance().addScore(10);
                        this.updateScore();
                        enemy.explode();
                        enemy.setExplodeEndHandler(function (child) {
                            egret.GameUtil.remove(child);
                        }, this, [enemy]);
                        enemy.removeEventListener(egret.GameEvent.SHOT, this.shot, this);
                        enemy.stopFire();
                        egret.Plane.recover(enemy);
                        this._enemyArray.splice(this._enemyArray.indexOf(enemy), 1);
                        j--;
                    }
                }
            }
            for (var i = 0; i < this._enemyBullet.length; i++) {
                bullet = this._enemyBullet[i];
                rect1 = egret.GameUtil.getInstance().drwaRect(bullet);
                rect2 = egret.GameUtil.getInstance().drwaRect(this._role);
                rect2.x = this._role.x - this._role.width / 2;
                rect2.y = this._role.y - this._role.height / 2;
                if (egret.GameUtil.getInstance().hitTestByRect(rect1, rect2)) {
                    this._role.explode();
                    this._role.removeEventListener(egret.GameEvent.SHOT, this.shot, this);
                    this._role.stopFire();
                    egret.Plane.recover(this._role);
                    this.overGame();
                }
            }
            for (var i in this._enemyArray) {
                enemy = this._enemyArray[i];
                if (enemy.parent) {
                    rect1 = egret.GameUtil.getInstance().drwaRect(enemy);
                    rect2 = egret.GameUtil.getInstance().drwaRect(this._role);
                    rect1.x = enemy.x - enemy.width / 2;
                    rect1.y = enemy.y - enemy.height / 2;
                    rect2.x = this._role.x - this._role.width / 2;
                    rect2.y = this._role.y - this._role.height / 2;
                    if (egret.GameUtil.getInstance().hitTestByRect(rect1, rect2)) {
                        this._role.explode();
                        this._role.stopFire();
                        this._role.removeEventListener(egret.GameEvent.SHOT, this.shot, this);
                        egret.Plane.recover(this._role);
                        this.overGame();
                    }
                }
            }
        };
        SceneWindow.prototype.updateScore = function () {
            this._scoreText.text = "分数:" + egret.GameData.getInstance().score;
        };
        SceneWindow._instance = null;
        SceneWindow.stage = null;
        return SceneWindow;
    }(egret.DisplayObjectContainer));
    egret.SceneWindow = SceneWindow;
    __reflect(SceneWindow.prototype, "egret.SceneWindow");
})(egret || (egret = {}));
//# sourceMappingURL=SceneWindow.js.map