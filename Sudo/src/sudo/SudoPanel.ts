class SudoPanel extends egret.DisplayObjectContainer {

    public static _instance: SudoPanel = null;

    public static getInstance(): SudoPanel {
        return SudoPanel._instance || (SudoPanel._instance = new SudoPanel())
    }

    private _tempArr: Array<Array<number>> = new Array<Array<number>>();
    private _gameArr: Array<Array<number>> = new Array<Array<number>>();
    private _anserArr: Array<Array<number>> = new Array<Array<number>>();
    private _sudoArr: Array<Array<number>> = new Array<Array<number>>();

    private _randomCount: number = 10;
    private _digCount: number = 48;

    private _isDFS: boolean = false;

    public constructor() {
        super();
        this.initData();
        this.randomArr();
        this._isDFS = true;
        this.DFS(this._tempArr, 0, false);
        this.printTest(this._anserArr, "第一次DFS anser:");
        this.printTest(this._sudoArr, "第一次DFS sudo:");
        this.digSudo();
        this._isDFS = false;
        this.printTest(this._anserArr, "游戏答案");
        this.printTest(this._gameArr, "游戏终盘");

        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.addToStage, this);

    }

    private addToStage(): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.addToStage, this);
        this.initUI();
    }

    /**
     * 初始化游戏数组
     */
    private initData(): void {
        this._tempArr.length = 0;
        this._gameArr.length = 0;
        this._anserArr.length = 0;
        this._sudoArr.length = 0;
        for (let i = 0; i < 9; i++) {
            this._tempArr.push(new Array<number>());
            this._gameArr.push(new Array<number>());
            this._anserArr.push(new Array<number>());
            this._sudoArr.push(new Array<number>());
            for (let j = 0; j < 9; j++) {
                this._tempArr[i][j] = 0;
                this._gameArr[i][j] = 0;
                this._anserArr[i][j] = 0;
                this._sudoArr[i][j] = 0;
            }
        }
    }

    /**
     * 随机放入this._randomCount数量的随机数字在数组中
     */
    private randomArr(): void {
        let col: number;
        let row: number;
        let value: number;
        if (!this._tempArr) {
            console.error("未初始化数据");
            return;
        }
        let count: number = this._randomCount;
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
    }

    /**
     * 检验数字在数组中是否可填
     * @param arr 数组
     * @param col 列 x
     * @param row 行 y
     * @param value 填入的值
     */
    private checkTrue(arr: Array<Array<number>>, col: number, row: number, value: number): boolean {
        let scol: number = Math.floor(col / 3) * 3;
        let srow: number = Math.floor(row / 3) * 3;
        for (let r = srow; r < srow + 3; r++) {
            for (let c = scol; c < scol + 3; c++) {
                if (arr[r][c] == value) {
                    return false;
                }
            }
        }
        for (let i = 0; i < 9; i++) {
            if ((arr[i][col] == value) || (arr[row][i] == value)) {
                return false;
            }
        }
        return true;
    }

    /**得出唯一解的标志 */
    private flag: boolean = false;

    /**
     * dfs数独二维数组 得出唯一终盘 this._anserArr
     * @param arr 
     * @param value 
     */
    private DFS(arr: Array<Array<number>>, value: number, all: boolean) {
        // console.log("value:", value);
        if (value < 81) {
            if (this.flag == true && all == false) {
                return;
            }
            if (arr[Math.floor(value / 9)][value % 9] == 0) {
                for (let i = 1; i < 10; i++) {
                    if (this.checkTrue(arr, value % 9, Math.floor(value / 9), i)) {
                        arr[Math.floor(value / 9)][value % 9] = i;
                        this.DFS(arr, value + 1, all);

                        arr[Math.floor(value / 9)][value % 9] = 0;
                    }
                    if (i == 10) {
                        console.log("error");
                    }
                }
            } else {
                this.DFS(arr, value + 1, all);
            }

        }
        else {// 解完81个格子
            if (all == false) {
                this.flag = true;
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        this._sudoArr[i][j] = arr[i][j];
                        this._anserArr[i][j] = arr[i][j];
                    }
                }
            }
            else {
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        if (this._anserArr[i][j] != arr[i][j]) {
                            this._gameArr[i][j] = this._anserArr[i][j];
                            return;
                        }
                    }
                }
            }

        }
    }

    /**
     * 挖空终盘数独数组，生成游戏
     */
    private digSudo(): void {
        let count: number = this._digCount;
        while (count > 0) {
            let randomX: number = Math.floor(Math.random() * 9);
            let randomY: number = Math.floor(Math.random() * 9);
            if (this._sudoArr[randomY][randomX] != 0) {
                this._sudoArr[randomY][randomX] = 0;
                count--;
            }
        }
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this._gameArr[i][j] = this._sudoArr[i][j];
            }
        }
        this.DFS(this._sudoArr, 0, true);
    }

    public getXY(index: number): egret.Point {
        let result: egret.Point = new egret.Point();
        let x: number = index % 9;
        let y: number = Math.floor(index / 9);
        result.x = x;
        result.y = y;
        return result;
    }

    private printTest(arr: Array<any>, message: string = "") {
        console.log(message, arr);
    }

    /***********************************************************UI***********************************************************/

    private _list: eui.List;
    private _content: egret.DisplayObjectContainer;
    private _listData: Array<SudoLo> = [];
    private _buttonArr: Array<SudoButton> = [];

    private _selectedItem: SudoItem;
    private _selectedIndex: number;

    private _sourcePath: string = "resource/assets/sudo/";

    private _startBtn: egret.Bitmap;
    private _btnSprite: egret.Sprite;
    private _btnText: egret.TextField;

    private _restartBtn: egret.Bitmap;
    private _cleanBtn: egret.Bitmap;

    private initUI(): void {

        let bg: egret.Bitmap = new egret.Bitmap();
        this.addChild(bg);
        RES.getResByUrl(this._sourcePath + "ui_sd_ditu.jpg", (img) => {
            bg.texture = img;
            // bg.scale9Grid = new egret.Rectangle(5, 5, 5, 5);
            bg.width = this.stage.stageWidth;
            bg.height = this.stage.stageHeight;
        }, this);

        this._btnSprite = new egret.Sprite();
        this.addChild(this._btnSprite);
        this._btnSprite.touchChildren = true;
        this._startBtn = new egret.Bitmap();
        this._startBtn.touchEnabled = true;
        this._btnSprite.addChild(this._startBtn);
        RES.getResByUrl(this._sourcePath + "ui_sd_anniu.png", (img) => {
            this._startBtn.texture = img;
            this._btnSprite.x = this.stage.stageWidth / 2 - this._startBtn.width / 2;
            this._btnSprite.y = this.stage.stageHeight / 2 - this._startBtn.height / 2;
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

        let listBg:egret.Bitmap = new egret.Bitmap();
        this._content.addChild(listBg);
        RES.getResByUrl(this._sourcePath+"bg_kuang01.png",(img)=>{
            listBg.texture = img;
            listBg.scale9Grid = new egret.Rectangle(19,19,1,1);
            listBg.width = 578;
            listBg.height = 585;
        },this);
        listBg.x = -14;
        listBg.y = -16;

        let temp:Array<egret.Bitmap> = [];
        for (let i = 0; i < 9; i++) {
                let blockBg: egret.Bitmap = new egret.Bitmap();
                this._content.addChild(blockBg);
                temp.push(blockBg);
        }
        RES.getResByUrl(this._sourcePath + "ui_sd_di.jpg", (img) => {
            for(let i = 0; i < 9; i++){
                temp[i].texture = img
                temp[i].x = Math.floor(i % 3) * temp[i].width;
                temp[i].y = Math.floor(i / 3) * temp[i].height;
            }
        }, this);

        this._list = new eui.List();
        this._list.itemRenderer = SudoItem;
        this._list.width = this._list.height = 184 * 3;
        let layout: eui.TileLayout = new eui.TileLayout();
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

        let gap: number = 1
        for (let i = 0; i < 9; i++) {
            let button: SudoButton = new SudoButton(i + 1);
            button.x = i * button.width + i * gap;
            button.y = 50 + 184 * 3;
            this._content.addChild(button);
            this._buttonArr.push(button);
        }

        let sprite1: egret.Sprite = new egret.Sprite();
        sprite1.touchChildren = true;
        this._content.addChild(sprite1);
        this._restartBtn = new egret.Bitmap();
        sprite1.addChild(this._restartBtn);
        this._restartBtn.touchEnabled = true;
        let btnText1 = new egret.TextField();
        sprite1.addChild(btnText1);
        btnText1.size = 30;
        btnText1.textColor = 0x000000;
        btnText1.text = "重新开始";
        btnText1.touchEnabled = false;
        btnText1.width = 188;
        btnText1.height = 64;
        btnText1.textAlign = egret.HorizontalAlign.CENTER;
        btnText1.verticalAlign = egret.VerticalAlign.MIDDLE;
        RES.getResByUrl(this._sourcePath + "ui_sd_anniu.png", (img) => {
            this._restartBtn.texture = img;
            sprite1.x = 0;
            sprite1.y = 120 + 184 * 3;
        }, this);

        let sprite2: egret.Sprite = new egret.Sprite();
        sprite2.touchChildren = true;
        this._content.addChild(sprite2);
        this._cleanBtn = new egret.Bitmap();
        sprite2.addChild(this._cleanBtn);
        this._cleanBtn.touchEnabled = true;
        let btnText2 = new egret.TextField();
        sprite2.addChild(btnText2);
        btnText2.size = 30;
        btnText2.textColor = 0x000000;
        btnText2.text = "清除方格";
        btnText2.touchEnabled = false;
        btnText2.width = 188;
        btnText2.height = 64;
        btnText2.textAlign = egret.HorizontalAlign.CENTER;
        btnText2.verticalAlign = egret.VerticalAlign.MIDDLE;
        RES.getResByUrl(this._sourcePath + "ui_sd_anniu.png", (img) => {
            this._cleanBtn.texture = img;
            sprite2.x = this._content.width - this._cleanBtn.width;
            sprite2.y = 120 + 184 * 3;
        }, this);

        let icon:egret.Bitmap = new egret.Bitmap();
        this._content.addChild(icon);
        RES.getResByUrl(this._sourcePath+"icon.jpg",(img)=>{
            icon.texture = img;
            icon.width = icon.height = 100;
        },this);
        icon.y = 220+184*3;

        let textSprite:egret.Sprite = new egret.Sprite();
        this._content.addChild(textSprite);
        let textBg:egret.Bitmap = new egret.Bitmap();
        textSprite.addChild(textBg);
        RES.getResByUrl(this._sourcePath+"ui_sd_baidi.png",(img)=>{
            textBg.texture = img;
            textBg.scale9Grid = new egret.Rectangle(5,5,5,5);
            textBg.width = 305;
            textBg.height = 105;
        },this)
        let text1: egret.TextField = new egret.TextField();
        textSprite.addChild(text1);
        text1.width = 305;
        text1.height = 105;
        text1.y = 15;
        text1.size = 30;
        text1.textColor = 0x000000;
        text1.text = "梦幻神剑";
        text1.textAlign = egret.HorizontalAlign.CENTER;
        text1.verticalAlign = egret.VerticalAlign.TOP;

        let text2: egret.TextField = new egret.TextField();
        textSprite.addChild(text2);
        text2.width = 305;
        text2.height = 90;
        text2.size = 30;
        text2.textColor = 0x000000;
        text2.text = "休闲数独小游戏";
        text2.textAlign = egret.HorizontalAlign.CENTER;
        text2.verticalAlign = egret.VerticalAlign.BOTTOM;

        textSprite.x = icon.x + 100 + 40;
        textSprite.y = 220+184*3;

        this.tip = new egret.TextField();
        this.tip.width = this.stage.stageWidth;
        this.tip.height = this.stage.stageHeight;
        this.tip.size = 25;
        this.tip.textColor = 0xFF0000;
        this.tip.textAlign = egret.HorizontalAlign.CENTER;
        this.tip.verticalAlign = egret.VerticalAlign.MIDDLE;

        this.onOpen();
    }

    private updateList(): void {
        this._listData.length = 0;
        for (let i in this._gameArr) {
            for (let j in this._gameArr[i]) {
                let lo: SudoLo = new SudoLo();
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
    }

    /**
     * 开始游戏
     * @param initData 是否初始化数据
     */
    private startGame(initData: boolean = false): void {
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

    }

    private endGame(): void {
        if (this._content.parent) {
            this.removeChild(this._content);
        }
        if (!this._btnSprite.parent) {
            this.addChild(this._btnSprite);
        }
        this._btnText.text = "再玩一次";
    }

    public onOpen(): void {
        for (let i in this._buttonArr) {
            if (!this._buttonArr[i].hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
                this._buttonArr[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchButton, this);
            }
        }

        if (!this._list.hasEventListener(eui.ItemTapEvent.ITEM_TAP)) {
            this._list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.selecetHandler, this);
        }
        // this._list.addEventListener(egret.Event.CHANGE,this.listChange,this);
        this._startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        this._restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.restarGame,this);
        this._cleanBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clearBlock,this);
    }

    private touchTime: number = egret.getTimer();
    private tip:egret.TextField;

    private restarGame(e: egret.TouchEvent) {
        let time = egret.getTimer();
        if(time<this.touchTime){
            let s = Math.ceil((this.touchTime-time)/1000);
            this.showTip(`请${s}秒后再试`);
        }
        else{
            this.touchTime = time+5000;
            this.startGame(true);
        }
        
    }
    private showTip(message:string){
        if(this.tip.parent){
            return ;
        }
        this.tip.text = message;
        this.addChild(this.tip);
        this.tip.alpha = 1;
        this.tip.y = 0;
        let target:any = this;
        egret.Tween.get(this.tip).wait(500).to({alpha:0,y:-10},500).call(()=>{
            this.removeChild(this.tip);
        },this);
        
    }

    private clearBlock(e:egret.TouchEvent){
        if(this._isDFS){
            return ;
        }
        if(this._selectedItem){
            let lo: SudoLo = this._selectedItem.data;
            if(!lo.data){
                return ;
            }
            if (!lo.status) {
                lo.data = 0;
                let point: egret.Point = this.getXY(this._selectedIndex);
                this._gameArr[point.y][point.x] = lo.data;
                this._list.updateRenderer(this._selectedItem, this._selectedIndex, lo);
            }
        }
    }

    private touchHandler(e: egret.TouchEvent) {
        if (this._btnText.text == "开始游戏") {
            this.startGame();
        } else {
            this.startGame(true);
        }
    }

    private touchButton(e: egret.TouchEvent) {
        if(this._isDFS){
            return ;
        }
        let button: SudoButton = e.target as SudoButton;
        if (this._selectedItem) {
            let lo: SudoLo = this._selectedItem.data;
            if (lo.data == button.data) {
                return;
            }
            if (!lo.status) {
                lo.data = button.data;
                let point: egret.Point = this.getXY(this._selectedIndex);
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
    }

    private listChange(e: egret.Event): void {

    }

    private selecetHandler(e: eui.ItemTapEvent) {
        if(this._isDFS){
            return ;
        }
        if (this._selectedItem) {
            this._list.updateRenderer(this._selectedItem, this._selectedIndex, this._selectedItem.data);
        }
        this._selectedItem = e.itemRenderer as SudoItem;
        this._selectedIndex = e.itemIndex;
        this._list.updateRenderer(this._selectedItem, this._selectedIndex, this._selectedItem.data);
    }

    public onClose(): void {
        for (let i in this._buttonArr) {
            if (this._buttonArr[i].hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
                this._buttonArr[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchButton, this);
            }
        }
        if (!this._list.hasEventListener(eui.ItemTapEvent.ITEM_TAP)) {
            this._list.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.selecetHandler, this);
        }
        this._startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        // this._list.removeEventListener(egret.Event.CHANGE,this.listChange,this);
        this._restartBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.restarGame,this);
        this._cleanBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.clearBlock,this);
    }
}

class SudoButton extends egret.DisplayObjectContainer {

    public number: egret.TextField;
    public data: number;

    public constructor(number: number) {
        super();
        let bg:egret.Bitmap = new egret.Bitmap();
        this.addChild(bg);
        RES.getResByUrl("resource/assets/sudo/"+"ui_sd_gezi3.jpg",(img)=>{
            bg.texture = img;
            bg.x = this.width/2 - bg.width/2;
            bg.y = this.height/2 - bg.height/2;
        },this);
        this.data = number;
        this.number = new egret.TextField();
        this.number.width = this.width;
        this.number.height = this.height;
        this.number.textAlign = egret.HorizontalAlign.CENTER;
        this.number.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.number.textColor = 0x000000;
        this.number.size = 30;
        this.number.text = number.toString();
        this.addChild(this.number);

        this.touchEnabled = true;
        this.touchChildren = true;
    }

    public get width() {
        return 60;
    }
    public get height() {
        return 60;
    }
}

class SudoLo {
    public data: number;
    /**
     * 1: 固定数据 0:空白格
     */
    public status: number = 0;
    /**
     * 是否为正确值
     */
    public isTrue: boolean = true;

}

class SudoItem extends eui.ItemRenderer {
    public itemBg: egret.Bitmap;
    public valueText: egret.TextField;

    public constructor() {
        super();
    }
    public childrenCreated() {
        this.removeChildren();

        this.itemBg = new egret.Bitmap();
        this.addChild(this.itemBg);
        RES.getResByUrl("resource/assets/sudo/" + "ui_sd_gezi.jpg", (img) => {
            this.itemBg.texture = img;
        },this);

        this.valueText = new egret.TextField();
        this.valueText.width = 60;
        this.valueText.height = 60;
        this.valueText.textAlign = egret.HorizontalAlign.CENTER;
        this.valueText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.valueText.textColor = 0x000000;
        this.valueText.size = 30;
        this.addChild(this.valueText);
    }

    public get width(): number {
        return 60;
    }

    public get height(): number {
        return 60;
    }

    public dataChanged(): void {
        let data: SudoLo = this.data as SudoLo;
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
            RES.getResByUrl("resource/assets/sudo/" + "ui_sd_gezi2.jpg", (img) => {
                this.itemBg.texture = img;
            },this);
        }
        else {
            RES.getResByUrl("resource/assets/sudo/" + "ui_sd_gezi.jpg", (img) => {
                this.itemBg.texture = img;
            },this);
        }
    }
}