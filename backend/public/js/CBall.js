function CBall(iXPos, iYPos, oSprite, iID, oParentContainer) {

    var _oParentContainer;
    var _oContainer;
    var _oBall;
    var _oShadow;
    var _oStartPos;
    var _vPos;
    var _vPrevPos;
    var _vCurForce;
    var _iID;
    var _iRadius;
    var _iHalfRadius;
    var _iRadiusQuadro;
    var _iBufferTime = 0;
    var _iFrame = 0;
    var _oUserData;
    var _oBallTrajectory;

    this._init = function (iXPos, iYPos, oSprite, iID) {
        console.log('init')
        _oContainer = new createjs.Container();
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;

        _oBallTrajectory = new CBallTrajectory(_oParentContainer);

        _oBall = createBitmap(oSprite,oSprite.width, oSprite.height);
        _oBall.regX = oSprite.width/2;
        _oBall.regY = oSprite.height/2;
        _oContainer.addChild(_oBall);

        _vPos = new CVector2();
        _vPos.set(_oContainer.x, _oContainer.y);
        _vPrevPos = new CVector2();
        _vPrevPos.set(0, 0);

        _iID = iID;

        _oStartPos = {x: iXPos, y: iYPos};

        _iRadius = (oSprite.width * 0.5);
        _iHalfRadius = _iRadius*0.5;
        _iRadiusQuadro = _iRadius * _iRadius;

        _vCurForce = new CVector2(0,0);

        _oParentContainer.addChild(_oContainer);

    };

    this.unload = function () {
        _oParentContainer.removeChild(_oContainer);
    };

    this.setVisible = function (bVisible) {
        _oContainer.visible = bVisible;
    };

    this.setPosition = function (iXPos, iYPos) {
        console.log(iXPos,'setPosition',iYPos)
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
    };

    this.resetPos = function () {
        console.log('resetPos')
        _oContainer.x = _oStartPos.x;
        _oContainer.y = _oStartPos.y;
        _vPos.set(_oContainer.x, _oContainer.y);
        _vCurForce.set(0, 0);
    };

    this.setAngle = function (iAngle) {
        console.log('setAngle')
        _oBall.rotation = iAngle;
    };

    this.getHalfRadius = function(){
        return _iHalfRadius;
    };

    this.getX = function () {
        //console.log('getX')
        return _oContainer.x;
    };
    
    this.setUserData = function(oObject){
       _oUserData = oObject; 
    };
    
    this.getUserData = function(){
       return _oUserData; 
    };

    this.getY = function () {
        //console.log('getY')
        return _oContainer.y;
    };
    
    this.checkGoalTop = function(){
        if (_oContainer.y <=0){
            return true;
        }else{
            return false;
        }
    };
    
    this.checkGoalBottom = function(){
        if (_oContainer.y >=CANVAS_HEIGHT){
            return true;
        }else{
            return false;
        }
    };

    this.scale = function (fValue) {
        _oContainer.scaleX = fValue;
        _oContainer.scaleY = fValue;
    };

    this.getScale = function () {
        return _oContainer.scaleX;
    };

    this.type = function () {
        return BALL;
    };

    this.vCurForce = function () {
        return _vCurForce;
    };

    this.vPos = function () {
        return _vPos;
    };

    this.setPos = function (vPos) {
        console.log('setPos')
        _vPos.setV(vPos);
    };

    this.vPrevPos = function () {
        return _vPrevPos;
    };

    this.getRadius = function () {
        return _iRadius;
    };

    this.getRadiusQuadro = function () {
        return _iRadiusQuadro;
    };

    this.remoteUpdateSpritePosition = function (xVal,yVal) {
        
        _oContainer.x = xVal;
        _oContainer.y = yVal;

    }

    this.updateSpritePosition = function () {
        
        _oContainer.x = _vPos.getX();
        _oContainer.y = _vPos.getY();
        if(ballMoveInProgress){
            //console.log(_oContainer.x,'updateSpritePosition',_oContainer.y)
            socket.emit("gamePlay",{move:'updateSpritePosition', gameData:{xVal:0 , yVal:0}, playerUserName:playerUserName, playerType:playerType,gameId:gameId,roomId:roomId,x:_oContainer.x,y:_oContainer.y});
        }
    };

    this.isGoalKeeper = function () {
        return false;
    };

    this.getID = function () {
        return _iID;
    };


    this.getChildIndex = function () {
        _oParentContainer.getChildIndex(_oContainer);
    };

    this.setChildIndex = function (iValue) {
        _oParentContainer.setChildIndex(_oContainer, iValue);
    };

    this.getObject = function () {
        return _oContainer;
    };
    
    this.updateTrajectory = function(){
       // console.log('updateTrajectory');
       _oBallTrajectory.update(_vPos);
    };

    _oParentContainer = oParentContainer;

    this._init(iXPos, iYPos, oSprite, iID);

    return this;
}
