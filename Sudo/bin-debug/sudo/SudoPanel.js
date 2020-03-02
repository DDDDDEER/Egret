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
var SudoPanel = (function (_super) {
    __extends(SudoPanel, _super);
    function SudoPanel() {
        var _this = _super.call(this) || this;
        _this._tempArr = new Array();
        _this._gameArr = new Array();
        _this._anserArr = new Array();
        _this._sudoArr = new Array();
        _this._randomCount = 10;
        _this._digCount = 48;
        _this._isDFS = false;
        /**得出唯一解的标志 */
        _this.flag = false;
        _this._listData = [];
        _this._buttonArr = [];
        _this._sourcePath = "resource/assets/sudo/";
        _this.touchTime = egret.getTimer();
        _this.initData();
        _this.randomArr();
        _this._isDFS = true;
        _this.DFS(_this._tempArr, 0, false);
        _this.printTest(_this._anserArr, "第一次DFS anser:");
        _this.printTest(_this._sudoArr, "第一次DFS sudo:");
        _this.digSudo();
        _this._isDFS = false;
        _this.printTest(_this._anserArr, "游戏答案");
        _this.printTest(_this._gameArr, "游戏终盘");
        _this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, _this.addToStage, _this);
        return _this;
    }
    SudoPanel.getInstance = function () {
        return SudoPanel._instance || (SudoPanel._instance = new SudoPanel());
    };
    SudoPanel.prototype.addToStage = function () {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.addToStage, this);
        this.initUI();
    };
    /**
     * 初始化游戏数组
     */
    SudoPanel.prototype.initData = function () {
        this._tempArr.length = 0;
        this._gameArr.length = 0;
        this._anserArr.length = 0;
        this._sudoArr.length = 0;
        for (var i = 0; i < 9; i++) {
            this._tempArr.push(new Array());
            this._gameArr.push(new Array());
            this._anserArr.push(new Array());
            this._sudoArr.push(new Array());
            for (var j = 0; j < 9; j++) {
                this._tempArr[i][j] = 0;
                this._gameArr[i][j] = 0;
                this._anserArr[i][j] = 0;
                this._sudoArr[i][j] = 0;
            }
        }
    };
    /**
     * 随机放入this._randomCount数量的随机数字在数组中
     */
    SudoPanel.prototype.randomArr = function () {
        var col;
        var row;
        var value;
        if (!this._tempArr) {
            console.error("未初始化数据");
            return;
        }
        var count = this._randomCount;
        while (count > 0) {
            col = Math.floor(Math.random() * 9);
            row = Math.floor(Math.random() * 9);
            value = Math.floor(Math.random() * 9) + 1;
            if (this._tempArr[row][col] == 0) {
                if (this.checkTrue(this._tempArr, col, row, value)) {
                    this._tempArr[row][col] = value;
                    count--;
                }
            }
        }
        this.printTest(this._tempArr, "随机数组");
    };
    /**
     * 检验数字在数组中是否可填
     * @param arr 数组
     * @param col 列 x
     * @param row 行 y
     * @param value 填入的值
     */
    SudoPanel.prototype.checkTrue = function (arr, col, row, value) {
        var scol = Math.floor(col / 3) * 3;
        var srow = Math.floor(row / 3) * 3;
        for (var r = srow; r < srow + 3; r++) {
            for (var c = scol; c < scol + 3; c++) {
                if (arr[r][c] == value) {
                    return false;
                }
            }
        }
        for (var i = 0; i < 9; i++) {
            if ((arr[i][col] == value) || (arr[row][i] == value)) {
                return false;
            }
        }
        return true;
    };
    /**
     * dfs数独二维数组 得出唯一终盘 this._anserArr
     * @param arr
     * @param value
     */
    SudoPanel.prototype.DFS = function (arr, value, all) {
        // console.log("value:", value);
        if (value < 81) {
            if (this.flag == true && all == false) {
                return;
            }
            if (arr[Math.floor(value / 9)][value % 9] == 0) {
                for (var i = 1; i < 10; i++) {
                    if (this.checkTrue(arr, value % 9, Math.floor(value / 9), i)) {
                        arr[Math.floor(value / 9)][value % 9] = i;
                        this.DFS(arr, value + 1, all);
                        arr[Math.floor(value / 9)][value % 9] = 0;
                    }
                    if (i == 10) {
                        console.log("error");
                    }
                }
            }
            else {
                this.DFS(arr, value + 1, all);
            }
        }
        else {
            if (all == false) {
                this.flag = true;
                for (var i = 0; i < 9; i++) {
                    for (var j = 0; j < 9; j++) {
                        this._sudoArr[i][j] = arr[i][j];
                        this._anserArr[i][j] = arr[i][j];
                    }
                }
            }
            else {
                for (var i = 0; i < 9; i++) {
                    for (var j = 0; j < 9; j++) {
                        if (this._anserArr[i][j] != arr[i][j]) {
                            this._gameArr[i][j] = this._anserArr[i][j];
                            return;
                        }
                    }
                }
            }
        }
    };
    /**
     * 挖空终盘数独数组，生成游戏
     */
    SudoPanel.prototype.digSudo = function () {
        var count = this._digCount;
        while (count > 0) {
            var randomX = Math.floor(Math.random() * 9);
            var randomY = Math.floor(Math.random() * 9);
            if (this._sudoArr[randomY][randomX] != 0) {
                this._sudoArr[randomY][randomX] = 0;
                count--;
            }
        }
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                this._gameArr[i][j] = this._sudoArr[i][j];
            }
        }
        this.DFS(this._sudoArr, 0, true);
    };
    SudoPanel.prototype.getXY = function (index) {
        var result = new egret.Point();
        var x = index % 9;
        var y = Math.floor(index / 9);
        result.x = x;
        result.y = y;
        return result;
    };
    SudoPanel.prototype.printTest = function (arr, message) {
        if (message === void 0) { message = ""; }
        console.log(message, arr);
    };
    SudoPanel.prototype.initUI = function () {
        var _this = this;
        var bg = new egret.Bitmap();
        this.addChild(bg);
        RES.getResByUrl(this._sourcePath + "ui_sd_ditu.jpg", function (img) {
            bg.texture = img;
            // bg.scale9Grid = new egret.Rectangle(5, 5, 5, 5);
            bg.width = _this.stage.stageWidth;
            bg.height = _this.stage.stageHeight;
        }, this);
        this._btnSprite = new egret.Sprite();
        this.addChild(this._btnSprite);
        this._btnSprite.touchChildren = true;
        this._startBtn = new egret.Bitmap();
        this._startBtn.touchEnabled = true;
        this._btnSprite.addChild(this._startBtn);
        RES.getResByUrl(this._sourcePath + "ui_sd_anniu.png", function (img) {
            _this._startBtn.texture = img;
            _this._btnSprite.x = _this.stage.stageWidth / 2 - _this._startBtn.width / 2;
            _this._btnSprite.y = _this.stage.stageHeight / 2 - _this._startBtn.height / 2;
        }, this);
        this._btnText = new egret.TextField();
        this._btnSprite.addChild(this._btnText);
        this._btnText.size = 30;
        this._btnText.textColor = 0x000000;
        this._btnText.text = "开始游戏";
        this._btnText.touchEnabled = false;
        this._btnText.width = 188;
        this._btnText.height = 64;
        this._btnText.textAlign = egret.HorizontalAlign.CENTER;
        this._btnText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this._content = new egret.DisplayObjectContainer();
        this._content.touchChildren = true;
        this._content.width = 184 * 3;
        // this._content.height = 184*3;
        this._content.x = this.stage.stageWidth / 2 - this._content.width / 2;
        this._content.y = 80;
        var listBg = new egret.Bitmap();
        this._content.addChild(listBg);
        RES.getResByUrl(this._sourcePath + "bg_kuang01.png", function (img) {
            listBg.texture = img;
            listBg.scale9Grid = new egret.Rectangle(19, 19, 1, 1);
            listBg.width = 578;
            listBg.height = 585;
        }, this);
        listBg.x = -14;
        listBg.y = -16;
        var temp = [];
        for (var i = 0; i < 9; i++) {
            var blockBg = new egret.Bitmap();
            this._content.addChild(blockBg);
            temp.push(blockBg);
        }
        RES.getResByUrl(this._sourcePath + "ui_sd_di.jpg", function (img) {
            for (var i = 0; i < 9; i++) {
                temp[i].texture = img;
                temp[i].x = Math.floor(i % 3) * temp[i].width;
                temp[i].y = Math.floor(i / 3) * temp[i].height;
            }
        }, this);
        this._list = new eui.List();
        this._list.itemRenderer = SudoItem;
        this._list.width = this._list.height = 184 * 3;
        var layout = new eui.TileLayout();
        layout.requestedColumnCount = 9;
        layout.requestedRowCount = 9;
        layout.columnWidth = layout.rowHeight = 60;
        layout.verticalGap = layout.horizontalGap = 1;
        // layout.paddingBottom = layout.paddingLeft = layout.paddingRight = layout.paddingTop = 1;
        layout.horizontalAlign = egret.HorizontalAlign.LEFT;
        layout.verticalAlign = egret.VerticalAlign.TOP;
        layout.target = this._list;
        this._list.layout = layout;
        this.updateList();
        this._list.x = 2;
        this._list.y = 2;
        this._content.addChild(this._list);
        var gap = 1;
        for (var i = 0; i < 9; i++) {
            var button = new SudoButton(i + 1);
            button.x = i * button.width + i * gap;
            button.y = 50 + 184 * 3;
            this._content.addChild(button);
            this._buttonArr.push(button);
        }
        var sprite1 = new egret.Sprite();
        sprite1.touchChildren = true;
        this._content.addChild(sprite1);
        this._restartBtn = new egret.Bitmap();
        sprite1.addChild(this._restartBtn);
        this._restartBtn.touchEnabled = true;
        var btnText1 = new egret.TextField();
        sprite1.addChild(btnText1);
        btnText1.size = 30;
        btnText1.textColor = 0x000000;
        btnText1.text = "重新开始";
        btnText1.touchEnabled = false;
        btnText1.width = 188;
        btnText1.height = 64;
        btnText1.textAlign = egret.HorizontalAlign.CENTER;
        btnText1.verticalAlign = egret.VerticalAlign.MIDDLE;
        RES.getResByUrl(this._sourcePath + "ui_sd_anniu.png", function (img) {
            _this._restartBtn.texture = img;
            sprite1.x = 0;
            sprite1.y = 120 + 184 * 3;
        }, this);
        var sprite2 = new egret.Sprite();
        sprite2.touchChildren = true;
        this._content.addChild(sprite2);
        this._cleanBtn = new egret.Bitmap();
        sprite2.addChild(this._cleanBtn);
        this._cleanBtn.touchEnabled = true;
        var btnText2 = new egret.TextField();
        sprite2.addChild(btnText2);
        btnText2.size = 30;
        btnText2.textColor = 0x000000;
        btnText2.text = "清除方格";
        btnText2.touchEnabled = false;
        btnText2.width = 188;
        btnText2.height = 64;
        btnText2.textAlign = egret.HorizontalAlign.CENTER;
        btnText2.verticalAlign = egret.VerticalAlign.MIDDLE;
        RES.getResByUrl(this._sourcePath + "ui_sd_anniu.png", function (img) {
            _this._cleanBtn.texture = img;
            sprite2.x = _this._content.width - _this._cleanBtn.width;
            sprite2.y = 120 + 184 * 3;
        }, this);
        var icon = new egret.Bitmap();
        this._content.addChild(icon);
        RES.getResByUrl(this._sourcePath + "icon.jpg", function (img) {
            icon.texture = img;
            icon.width = icon.height = 100;
        }, this);
        icon.y = 220 + 184 * 3;
        var textSprite = new egret.Sprite();
        this._content.addChild(textSprite);
        var textBg = new egret.Bitmap();
        textSprite.addChild(textBg);
        RES.getResByUrl(this._sourcePath + "ui_sd_baidi.png", function (img) {
            textBg.texture = img;
            textBg.scale9Grid = new egret.Rectangle(5, 5, 5, 5);
            textBg.width = 305;
            textBg.height = 105;
        }, this);
        var text1 = new egret.TextField();
        textSprite.addChild(text1);
        text1.width = 305;
        text1.height = 105;
        text1.y = 15;
        text1.size = 30;
        text1.textColor = 0x000000;
        text1.text = "梦幻神剑";
        text1.textAlign = egret.HorizontalAlign.CENTER;
        text1.verticalAlign = egret.VerticalAlign.TOP;
        var text2 = new egret.TextField();
        textSprite.addChild(text2);
        text2.width = 305;
        text2.height = 90;
        text2.size = 30;
        text2.textColor = 0x000000;
        text2.text = "休闲数独小游戏";
        text2.textAlign = egret.HorizontalAlign.CENTER;
        text2.verticalAlign = egret.VerticalAlign.BOTTOM;
        textSprite.x = icon.x + 100 + 40;
        textSprite.y = 220 + 184 * 3;
        this.tip = new egret.TextField();
        this.tip.width = this.stage.stageWidth;
        this.tip.height = this.stage.stageHeight;
        this.tip.size = 25;
        this.tip.textColor = 0xFF0000;
        this.tip.textAlign = egret.HorizontalAlign.CENTER;
        this.tip.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.onOpen();
    };
    SudoPanel.prototype.updateList = function () {
        this._listData.length = 0;
        for (var i in this._gameArr) {
            for (var j in this._gameArr[i]) {
                var lo = new SudoLo();
                lo.data = this._gameArr[i][j];
                if (lo.data) {
                    lo.status = 1;
                }
                this._listData.push(lo);
            }
        }
        this._list.selectedItem = null;
        this._list.selectedIndex = -1;
        this._list.dataProvider = new eui.ArrayCollection(this._listData);
    };
    /**
     * 开始游戏
     * @param initData 是否初始化数据
     */
    SudoPanel.prototype.startGame = function (initData) {
        if (initData === void 0) { initData = false; }
        if (initData) {
            this.flag = false;
            this.initData();
            this.randomArr();
            this._isDFS = true;
            this.DFS(this._tempArr, 0, false);
            this.digSudo();
            this._isDFS = false;
            this.printTest(this._anserArr, "游戏答案");
            this.printTest(this._gameArr, "游戏终盘");
            this._selectedIndex = -1;
            this._selectedItem = null;
            this.updateList();
        }
        if (!this._content.parent) {
            this.addChild(this._content);
        }
        if (this._btnSprite.parent) {
            this.removeChild(this._btnSprite);
        }
    };
    SudoPanel.prototype.endGame = function () {
        if (this._content.parent) {
            this.removeChild(this._content);
        }
        if (!this._btnSprite.parent) {
            this.addChild(this._btnSprite);
        }
        this._btnText.text = "再玩一次";
    };
    SudoPanel.prototype.onOpen = function () {
        for (var i in this._buttonArr) {
            if (!this._buttonArr[i].hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
                this._buttonArr[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchButton, this);
            }
        }
        if (!this._list.hasEventListener(eui.ItemTapEvent.ITEM_TAP)) {
            this._list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.selecetHandler, this);
        }
        // this._list.addEventListener(egret.Event.CHANGE,this.listChange,this);
        this._startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        this._restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restarGame, this);
        this._cleanBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clearBlock, this);
    };
    SudoPanel.prototype.restarGame = function (e) {
        var time = egret.getTimer();
        if (time < this.touchTime) {
            var s = Math.ceil((this.touchTime - time) / 1000);
            this.showTip("\u8BF7" + s + "\u79D2\u540E\u518D\u8BD5");
        }
        else {
            this.touchTime = time + 5000;
            this.startGame(true);
        }
    };
    SudoPanel.prototype.showTip = function (message) {
        var _this = this;
        if (this.tip.parent) {
            return;
        }
        this.tip.text = message;
        this.addChild(this.tip);
        this.tip.alpha = 1;
        this.tip.y = 0;
        var target = this;
        egret.Tween.get(this.tip).wait(500).to({ alpha: 0, y: -10 }, 500).call(function () {
            _this.removeChild(_this.tip);
        }, this);
    };
    SudoPanel.prototype.clearBlock = function (e) {
        if (this._isDFS) {
            return;
        }
        if (this._selectedItem) {
            var lo = this._selectedItem.data;
            if (!lo.data) {
                return;
            }
            if (!lo.status) {
                lo.data = 0;
                var point = this.getXY(this._selectedIndex);
                this._gameArr[point.y][point.x] = lo.data;
                this._list.updateRenderer(this._selectedItem, this._selectedIndex, lo);
            }
        }
    };
    SudoPanel.prototype.touchHandler = function (e) {
        if (this._btnText.text == "开始游戏") {
            this.startGame();
        }
        else {
            this.startGame(true);
        }
    };
    SudoPanel.prototype.touchButton = function (e) {
        if (this._isDFS) {
            return;
        }
        var button = e.target;
        if (this._selectedItem) {
            var lo = this._selectedItem.data;
            if (lo.data == button.data) {
                return;
            }
            if (!lo.status) {
                lo.data = button.data;
                var point = this.getXY(this._selectedIndex);
                if (!this.checkTrue(this._gameArr, point.x, point.y, lo.data)) {
                    lo.isTrue = false;
                }
                else {
                    lo.isTrue = true;
                }
                this._gameArr[point.y][point.x] = lo.data;
                this._list.updateRenderer(this._selectedItem, this._selectedIndex, lo);
                // 游戏结束
                if (this._gameArr.toString() == this._anserArr.toString()) {
                    console.log("游戏结束！你获胜了！");
                    this.endGame();
                }
            }
        }
    };
    SudoPanel.prototype.listChange = function (e) {
    };
    SudoPanel.prototype.selecetHandler = function (e) {
        if (this._isDFS) {
            return;
        }
        if (this._selectedItem) {
            this._list.updateRenderer(this._selectedItem, this._selectedIndex, this._selectedItem.data);
        }
        this._selectedItem = e.itemRenderer;
        this._selectedIndex = e.itemIndex;
        this._list.updateRenderer(this._selectedItem, this._selectedIndex, this._selectedItem.data);
    };
    SudoPanel.prototype.onClose = function () {
        for (var i in this._buttonArr) {
            if (this._buttonArr[i].hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
                this._buttonArr[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchButton, this);
            }
        }
        if (!this._list.hasEventListener(eui.ItemTapEvent.ITEM_TAP)) {
            this._list.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.selecetHandler, this);
        }
        this._startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        // this._list.removeEventListener(egret.Event.CHANGE,this.listChange,this);
        this._restartBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.restarGame, this);
        this._cleanBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clearBlock, this);
    };
    SudoPanel._instance = null;
    return SudoPanel;
}(egret.DisplayObjectContainer));
__reflect(SudoPanel.prototype, "SudoPanel");
var SudoButton = (function (_super) {
    __extends(SudoButton, _super);
    function SudoButton(number) {
        var _this = _super.call(this) || this;
        var bg = new egret.Bitmap();
        _this.addChild(bg);
        RES.getResByUrl("resource/assets/sudo/" + "ui_sd_gezi3.jpg", function (img) {
            bg.texture = img;
            bg.x = _this.width / 2 - bg.width / 2;
            bg.y = _this.height / 2 - bg.height / 2;
        }, _this);
        _this.data = number;
        _this.number = new egret.TextField();
        _this.number.width = _this.width;
        _this.number.height = _this.height;
        _this.number.textAlign = egret.HorizontalAlign.CENTER;
        _this.number.verticalAlign = egret.VerticalAlign.MIDDLE;
        _this.number.textColor = 0x000000;
        _this.number.size = 30;
        _this.number.text = number.toString();
        _this.addChild(_this.number);
        _this.touchEnabled = true;
        _this.touchChildren = true;
        return _this;
    }
    Object.defineProperty(SudoButton.prototype, "width", {
        get: function () {
            return 60;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SudoButton.prototype, "height", {
        get: function () {
            return 60;
        },
        enumerable: true,
        configurable: true
    });
    return SudoButton;
}(egret.DisplayObjectContainer));
__reflect(SudoButton.prototype, "SudoButton");
var SudoLo = (function () {
    function SudoLo() {
        /**
         * 1: 固定数据 0:空白格
         */
        this.status = 0;
        /**
         * 是否为正确值
         */
        this.isTrue = true;
    }
    return SudoLo;
}());
__reflect(SudoLo.prototype, "SudoLo");
var SudoItem = (function (_super) {
    __extends(SudoItem, _super);
    function SudoItem() {
        return _super.call(this) || this;
    }
    SudoItem.prototype.childrenCreated = function () {
        var _this = this;
        this.removeChildren();
        this.itemBg = new egret.Bitmap();
        this.addChild(this.itemBg);
        RES.getResByUrl("resource/assets/sudo/" + "ui_sd_gezi.jpg", function (img) {
            _this.itemBg.texture = img;
        }, this);
        this.valueText = new egret.TextField();
        this.valueText.width = 60;
        this.valueText.height = 60;
        this.valueText.textAlign = egret.HorizontalAlign.CENTER;
        this.valueText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.valueText.textColor = 0x000000;
        this.valueText.size = 30;
        this.addChild(this.valueText);
    };
    Object.defineProperty(SudoItem.prototype, "width", {
        get: function () {
            return 60;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SudoItem.prototype, "height", {
        get: function () {
            return 60;
        },
        enumerable: true,
        configurable: true
    });
    SudoItem.prototype.dataChanged = function () {
        var _this = this;
        var data = this.data;
        if (!data.data) {
            this.valueText.text = "";
        }
        else {
            this.valueText.text = data.data.toString();
        }
        if (data.status) {
            this.valueText.textColor = 0x000000;
        }
        else {
            if (data.isTrue) {
                this.valueText.textColor = 0x58ACFA;
            }
            else {
                this.valueText.textColor = 0xDF0101;
            }
        }
        if (this.selected) {
            RES.getResByUrl("resource/assets/sudo/" + "ui_sd_gezi2.jpg", function (img) {
                _this.itemBg.texture = img;
            }, this);
        }
        else {
            RES.getResByUrl("resource/assets/sudo/" + "ui_sd_gezi.jpg", function (img) {
                _this.itemBg.texture = img;
            }, this);
        }
    };
    return SudoItem;
}(eui.ItemRenderer));
__reflect(SudoItem.prototype, "SudoItem");
//# sourceMappingURL=SudoPanel.js.map