function CAreYouSurePanel(oFunction) {

    var _oButYes;
    var _oButNo;
    var _oFade;
    var _oPanelContainer;
    var _oParent;
    
    var _pStartPanelPos;
    
    this._init = function (oFunction) {
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oFade.on("mousedown",function(){});
        s_oStage.addChild(_oFade);
        
        new createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        new createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2 },500, createjs.Ease.quartIn);
        
        var iWidth = oSprite.width-50;
        var iHeight = 120;
        var iX = 0;
        var iY = -oSprite.height/2 + 120;
        
        new CTLText(_oPanelContainer, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    54, "center", "#4ce700", PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_ARE_SURE,
                    true, true, true,
                    false );

        _oButYes = new CGfxButton(110, 120, s_oSpriteLibrary.getSprite('but_yes_big'), _oPanelContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);

        _oButNo = new CGfxButton(-110, 120, s_oSpriteLibrary.getSprite('but_exit'), _oPanelContainer);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onButNo, this);
        _oButNo.pulseAnimation();
    };

    this._onButYes = function () {
        _oButNo.setClickable(false);
        _oButYes.setClickable(false);
        
        new createjs.Tween.get(_oFade).to({alpha:0},500);
        new createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){

            _oParent.unload();
            oFunction();
            
        }); 
    };

    this._onButNo = function () {
        _oButNo.setClickable(false);
        _oButYes.setClickable(false);
        
        new createjs.Tween.get(_oFade).to({alpha:0},500);
        new createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){
            _oParent.unload();
            
        }); 
    };

    this.unload = function () {
        _oButNo.unload();
        _oButYes.unload();

        s_oStage.removeChild(_oFade);
        s_oStage.removeChild(_oPanelContainer);

        _oFade.removeAllEventListeners();
    };

    _oParent = this;
    this._init(oFunction);
}

