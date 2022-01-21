function CRoomPanel(){
    var urlParams = getUrlVars();
    console.log('ADVANCED_MODE',ADVANCED_MODE)
    socket = io.connect("http://localhost:3000");
    //socket = io.connect("https://test-4-nkdjg.ondigitalocean.app:8443");
    socket.emit("joinRoom",{user:urlParams['user'],email:urlParams['email'],roomid:urlParams['roomid'],gameId:urlParams['gameId'],role:urlParams['role'],advanceMode:ADVANCED_MODE});
    var _oFade;
    var _oPanelContainer;
    var _oButExit;
    var _oButPlay;
    var _oLogo;
    var _msgText;


    
    var _pStartPanelPos;
    
    
    console.log('urlParams',urlParams)
    this._init = function(){
        
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
        oPanel.scaleX = 1.5;
        oPanel.scaleY = 1.5;
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        new createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2 - 40},500, createjs.Ease.quartIn);
        
        var iWidth = oSprite.width-100;
        var iHeight = 120;
        var iX = 0;
        var iY = -oSprite.height/2 + 90;
        
        /*new CTLText(_oPanelContainer, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    40, "center", "#4ce700", PRIMARY_FONT, 1,
                    2, 2,
                    "ember",
                    true, true, false,
                    false );*/

        new CTLText(_oPanelContainer, 
                    -320, -440, iWidth, iHeight, 
                    40, "center", "#ffffff", PRIMARY_FONT, 1,
                    2, 2,
                    "ember",
                    true, true, false,
                    false );

        var oSprite = s_oSpriteLibrary.getSprite('logo0');
        _oLogo = createBitmap(oSprite);
        _oLogo.on("click",this._onLogoButRelease);
        _oLogo.x = 35;
        _oLogo.y = -400;
        _oLogo.scaleX = 0.7;
        _oLogo.scaleY = 0.7;
        _oLogo.regX = oSprite.width/2;
        _oLogo.regY = oSprite.height/2;
        _oPanelContainer.addChild(_oLogo);
        _oLogo.on("mouseover",this.changePointer,this);
                    

        _msgText = new CTLText(_oPanelContainer, 
                    -320, -240, iWidth, iHeight, 
                    40, "center", "#4ce700", PRIMARY_FONT, 1,
                    2, 2,
                    "message",
                    true, true, false,
                    false );



        var iWidth = oSprite.width-100;
        var iHeight = 120;
        var iX = 0;
        var iY = 105;
        
        /*new CTLText(_oPanelContainer, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    40, "center", "#4ce700", PRIMARY_FONT, 1,
                    2, 2,
                    "www.codethislab.com",
                    true, true, false,
                    false );*/
        
        
      
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(415, -280, oSprite, _oPanelContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
        _oButExit.setVisible(false);

        oSprite = s_oSpriteLibrary.getSprite('skip_arrow');
        _oButPlay = new CGfxButton(15, 350, oSprite, _oPanelContainer);
        _oButPlay.addEventListener(ON_MOUSE_UP, this.play, this);

        _oButPlay.setVisible(false);

    };
    
    this.changePointer = function(evt){
        if (s_bMobile===false){
            evt.target.cursor = "pointer";  
        }
    };

    this.play = function(){
        s_b2Players = true;
        this.unload();        
        START_PROGRESSIVE_BALL_VELOCITY = ARRAY_BALL_SPEED[1].start_speed;
        PROGRESSIVE_STEP_BALL_VELOCITY = ARRAY_BALL_SPEED[1].step;
        LIMIT_SPEED = ARRAY_BALL_SPEED[1].limit;
        INDEX_DIFFICULT = 1;
        s_oMain.gotoGame();

        

    }
    
    this.unload = function(){
        console.log('exit')
        
        _oButExit.setClickable(false);
        
        new createjs.Tween.get(_oFade).to({alpha:0},500);
        new createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){
            s_oStage.removeChild(_oFade);
            s_oStage.removeChild(_oPanelContainer);

            _oButExit.unload();
        }); 
        
        _oFade.removeAllEventListeners();
        _oLogo.removeAllEventListeners();
        
        
    };
    
    this._onLogoButRelease = function(){
       // window.open("http://www.codethislab.com/index.php?&l=en");
    };
    
    this._onMoreGamesReleased = function(){
       // window.open("http://codecanyon.net/collections/5409142-games");
    };
    
    this._init();
    
    socket.on('autoStartGame', (message) => {
      console.log('autoStartGame',message);
      s_oTutorial.onAutoGameStart();

     });

    socket.on('onGamePlay', (message) => {
      //console.log('onGamePlay',message);
      if(message.move == 'mousedown'){
        s_oGame.onMouseDownMsg(message.gameData.xVal, message.gameData.yVal);
      }else if(message.move == 'updateSpritePosition'){
        
      }else if(message.move == 'moveStick'){
        console.log('onGamePlay',message);
        s_oGame.updateRemote(message);
      }

     });
    
    socket.on('message', (message) => {
      console.log('message',message);
      _msgText.setText(message.text);
      if(message.text == 'full'){
        _msgText.setText('text');
        return;
      }else if(message.text == "user2 has joined the game"){
        _oButPlay.setVisible(true);
        return;
      }else if(message.text == "Hello user2 Welcome to ember gaming engine!"){
        this.play();
        return;
      }
      else{

      }
      
    });
    
};


