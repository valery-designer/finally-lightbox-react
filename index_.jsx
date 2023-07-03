import React from 'react';
import 'finally-lightbox-react/style.css';
import SVG from 'finally-lightbox-react/svgs';
import { CURTAIN_OPACITY, USE_FULL_SCREEN_BY_DEFAULT } from 'finally-lightbox-react/preferencies';
import galleryCtrl from 'finally-lightbox-react/galleryctrl';

class Lightbox extends React.Component { 

    // constructor(props) {
    //     super(props);
    constructor() {
        super();
    
        // const { images } = props;
        this.images = [];
        this.state = {
            showFull:false,
            currImg:-1,
            preloaderOn: false,
            img: { z:{w:0,h:0}, pos:{left:0, top:0} },
            mode: { controls:true, touchControls:true },
            imgSrc: SVG.loading,
            leftGhost: { src:'', z:{w:100,h:100}, pos:{left:0,top:0} },
            rightGhost: { src:'', z:{w:0,h:0}, pos:{left:0,top:0} }
        };

        this.fullscreen = { on: false, dontHandleResize: false, dontHandleFullscreen: false };

        this.area= { 
            W:Math.max(document.documentElement.clientWidth, window.innerWidth || 0), 
            H:Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
            ar:1,
            dragLimit:{ top:50, right:50, bottom:1000, left:1000 }
        };

        this.img = { realDim:{w:0,h:0,wasLoaded:0 }, startDim:{w:0,h:0}, z:{w:0,h:0}, pos:{left:0, top:0}, center:{x:0, y:0}, zm:1, ar:1 };
        this.touch = { isTouchDevice:'ontouchstart' in window ? true : false, mode:0, drag:false };
        this.touch1 = { id:0, pos:{x:0,y:0}, t:0, prevtap:{ pos:{x:0,y:0},t:0} };
        this.touch2 = { id:0, pos:{x:0,y:0}, t:0 };
        this.touchesMiddle = { pos:{x:0, y:0}, distance:0, startDistance:0, startZm:1 };
        this.anim = { 
            on:false, 
            speed:{x:0,y:0,zm:1}, 
            start:{x:0,y:0,zm:1}, 
            target:{x:0,y:0,zm:1}, 
            previous:{x:0,y:0,ts:0}, 
            prePrevious:{x:0,y:0,ts:0} 
        };
        this.zoomAnim = {
            id:0,
            lastTimestamp:0
        };
        this.leftGhost = { src:'', z:{w:100,h:100}, pos:{left:0,top:0} };
        this.rightGhost = { src:'', z:{w:0,h:0}, pos:{left:0,top:0} };


        this.mode = { zoom:false, horizontal:true, downOnCurtainFlag:false };
        this.count = { tick:0, j:0 };
        this.curtainOpacity = CURTAIN_OPACITY;

        this.imgDOM = React.createRef();
        this.widgetBlock = React.createRef();

        this.imgMems = [];
        // this.props.images.forEach((image,i) => {
        // this.images.forEach((image,i) => {
        //     let mem = {
        //         st0:new Image(),
        //         st1:new Image(),
        //         st2:new Image(),
        //         currWidth:0, // aspect ratio (предполагается одинаковым на всех стадиях)
        //         currHeight:0
        //     };
        //     this.imgMems[i] = mem;  // формирование массива информации об изображениях
        //     //console.log('IMAGE ',i,': ',this.imgMems[i]);
        //     this.imgMems[i].st0.addEventListener('load',(e) => this.stageLoaded(i, 0)); // обработчик загрузки нулевой стадии
        //     this.imgMems[i].st0.addEventListener('error',(e) => this.stageLoadError(i, 0)); // обработчик ошибки загрузки нулевой стадии
        //     this.imgMems[i].st1.addEventListener('load',(e) => this.stageLoaded(i, 1)); // обработчик загрузки первой стадии
        //     this.imgMems[i].st1.addEventListener('error',(e) => this.stageLoadError(i, 1)); // обработчик ошибки загрузки первой стадии
        //     this.imgMems[i].st2.addEventListener('load',(e) => this.stageLoaded(i, 2)); // обработчик загрузки второй стадии
        //     this.imgMems[i].st2.addEventListener('error',(e) => this.stageLoadError(i, 2)); // обработчик ошибки загрузки второй стадии
        // });
        //this.setStagesAndListeners();

        this.gc = galleryCtrl.bind(this);
        this.galleryCtrl = this.gc();
        Lightbox.instance = this;
    }

    clearImgMems = () => {
        this.imgMems.forEach((mem,i) => {
            mem.st0.removeEventListener('load',(e) => this.stageLoaded(i, 0)); // обработчик загрузки нулевой стадии
            mem.st0.removeEventListener('error',(e) => this.stageLoadError(i, 0)); // обработчик ошибки загрузки нулевой стадии
            mem.st1.removeEventListener('load',(e) => this.stageLoaded(i, 1)); // обработчик загрузки первой стадии
            mem.st1.removeEventListener('error',(e) => this.stageLoadError(i, 1)); // обработчик ошибки загрузки первой стадии
            mem.st2.removeEventListener('load',(e) => this.stageLoaded(i, 2)); // обработчик загрузки второй стадии
            mem.st2.removeEventListener('error',(e) => this.stageLoadError(i, 2)); // обработчик ошибки загрузки второй стадии
        });
        this.imgMems = [];
    }

    openInLightbox = (e, items) => {
        this.clearImgMems();
        this.resetLightBoxParams();
        let curr = -1;
        items.forEach((item,i) => {
            let it = {};
            it.src = (new URL(item.src.split('?')[0], document.location)).href;
            if(it.src === e.target.src.split('?')[0]) curr = i;
            this.images.push(it);
        });
        console.log('FROM LIGHTBOX: this.images: ',this.images,' target url: ',e.target.src.split('?')[0],' curr: ',curr);

        this.setStagesAndListeners({ i:curr, w:e.target.naturalWidth, h:e.target.naturalHeight });

        if (curr > -1) this.clickGalleryImage(curr);
    }

    setStagesAndListeners = (targetDim = null) => {
        this.images.forEach((image,i) => {
            let mem = {
                preview:new Image(),
                st0:new Image(),
                st1:new Image(),
                st2:new Image(),
                currWidth:0, // aspect ratio (предполагается одинаковым на всех стадиях)
                currHeight:0
            };
            this.imgMems[i] = mem;  // формирование массива информации об изображениях
            this.imgMems[i].preview.addEventListener('load',(e) => this.previewLoaded(e, i));// обработчик загрузки превью
            this.imgMems[i].preview.src = image.src;
            this.imgMems[i].st0.addEventListener('load',(e) => this.stageLoaded(i, 0)); // обработчик загрузки нулевой стадии
            this.imgMems[i].st0.addEventListener('error',(e) => this.stageLoadError(i, 0)); // обработчик ошибки загрузки нулевой стадии
            this.imgMems[i].st1.addEventListener('load',(e) => this.stageLoaded(i, 1)); // обработчик загрузки первой стадии
            this.imgMems[i].st1.addEventListener('error',(e) => this.stageLoadError(i, 1)); // обработчик ошибки загрузки первой стадии
            this.imgMems[i].st2.addEventListener('load',(e) => this.stageLoaded(i, 2)); // обработчик загрузки второй стадии
            this.imgMems[i].st2.addEventListener('error',(e) => this.stageLoadError(i, 2)); // обработчик ошибки загрузки второй стадии
        });
        if(targetDim && typeof(targetDim.i) === 'number' && targetDim.i<this.imgMems.length) { 
            this.imgMems[targetDim.i].currWidth = targetDim.w;
            this.imgMems[targetDim.i].currHeight = targetDim.h;
        } 
    }

    componentDidMount() {
        this.setAreaParams();
        window.addEventListener('resize',this.resize);
        document.addEventListener('fullscreenchange',this.fullscreenChange); 
        document.addEventListener('backbutton',(e)=>{
            e.stopPropagation(); 
            e.preventDefault(); 
            console.log('BACKBUTTON EVENT: ', e);
        });
        
    }

    componentWillUnmount(){ console.log('COMPONENT UNMOUNTED!');
        window.removeEventListener('resize',this.resize);
        document.removeEventListener('fullscreenchange',this.fullscreenChange);
    }

    previewLoaded = (e, i) => {
        if(this.imgMems[i].currWidth === 0) {
            this.imgMems[i].currWidth = e.target.width;
            this.imgMems[i].currHeight = e.target.height;
            let gs = this.getGhosts();
            if(gs.left===i) this.setGhost('left');
            else if(gs.right===i) this.setGhost('right');
        }
    }

    stageLoaded = (id, st) => { console.log('stageLoaded is working: id=',id, ' st=',st);
        let sr = st===0 ? this.imgMems[id].st0.src : 
                            st===1 ? this.imgMems[id].st1.src : 
                            this.imgMems[id].st2.src; // выбор источника в зависимости от стадии
        if (id === this.state.currImg) this.setState({ imgSrc: sr }); // если это стадия текущего изображения, она подставляется в виджет
        this.setState({ preloaderOn:false });
    }

    lowerStage = () => {
        if(this.imgMems[this.state.currImg].st1.width!==0) this.setState({ imgSrc: this.imgMems[this.state.currImg].st1.src });
        else if(this.imgMems[this.state.currImg].st0.width!==0) this.setState({ imgSrc: this.imgMems[this.state.currImg].st0.src });
        else this.setState({ imgSrc: this.images[this.state.currImg].src });
    }

    upperStage = () => {
        if(this.imgMems[this.state.currImg].st2.width!==0) this.setState({ imgSrc: this.imgMems[this.state.currImg].st2.src });
        else this.loadStage2();
    }

    // stageLoaded = (id, st) => {
    //     let sr = st==0 ? this.imgMems[id].st0.src : 
    //                         st==1 ? this.imgMems[id].st1.src : 
    //                         this.imgMems[id].st2.src; // выбор источника в зависимости от стадии
    //     if (id == this.state.currImg) this.imgDOM.current.src = sr; // если это стадия текущего изображения, она подставляется в виджет
    //     this.setState({ preloaderOn:false });
    // }

    // lowerStage = () => {
    //     if(this.imgMems[this.state.currImg].st1.width!=0) this.imgDOM.current.src = this.imgMems[this.state.currImg].st1.src;
    //     else if(this.imgMems[this.state.currImg].st0.width!=0) this.imgDOM.current.src = this.imgMems[this.state.currImg].st0.src;
    //     // else this.imgDOM.current.src = this.props.images[this.state.currImg].src;
    //     else this.imgDOM.current.src = this.images[this.state.currImg].src;
    // }

    // upperStage = () => {
    //     if(this.imgMems[this.state.currImg].st2.width!=0) this.imgDOM.current.src = this.imgMems[this.state.currImg].st2.src;
    //     else this.loadStage2();
    // }
    
    stageLoadError = (id, st) => {
        this.setState({ preloaderOn:false });
        console.log('Stage ',st,' is not loaded: ', id); 
        // image.src = this.g.imgEls[id].src;
    }

    resize = () => {
        if(!this.fullscreen.dontHandleResize) {
            //console.log('RESIZE  HANDLED');
            this.setAreaParams();
            this.setSizeAndPosition();
            this.setGhosts();
        }
        else { //console.log('RESIZE SKIPPED');
            this.fullscreen.dontHandleResize = false;
        }
    }

    fullscreenChange = () => {
        if(!this.fullscreen.dontHandleFullscreen) {
            this.fullscreen.on = document.fullscreenElement ? true : false;
            console.log('FULLSCREENCHANGE HANDLED');
            this.setAreaParams();
            this.setSizeAndPosition();
        }
        else { console.log('FULLSCREENCHANGE SKIPPED');
            this.fullscreen.dontHandleFullscreen = false;
        }
    }

    downOnCurtain = (e) => {  
        e.stopPropagation(); 
        e.preventDefault(); 
        this.mode.downOnCurtainFlag=true;
    }

    upOnCurtain = (e) => {
        e.preventDefault(); 
        if(this.mode.downOnCurtainFlag){
            this.mode.downOnCurtainFlag=false;
            this.galleryCtrl.closeLightbox(); 
        }
        
    }
 
    imgMousedown = (e) => { 
        e.stopPropagation(); 
        e.preventDefault(); 
        this.mode.downOnCurtainFlag=false;
        this.anim.on=false;
        this.mode.timer=setTimeout(()=>{
            if(Math.abs(this.anim.previous.x-this.anim.start.x)<=3&&Math.abs(this.anim.previous.y-this.anim.start.y)<=3)this.imgLongclick();
        },1000);
        if(this.mode.zoom){
            this.anim.start={x:e.clientX, y:e.clientY, zm:1 }; this.anim.previous=this.anim.start; this.anim.prePrevious=this.anim.start;
            window.addEventListener('mouseup',this.zmMouseUpAfterDrag);
            window.addEventListener('mousemove',this.zmDragOnMouseMove);
        }
        else {
            this.count.j=0;
            this.anim.start={x:e.clientX, y:e.clientY}; 
            this.anim.previous={x:this.anim.start.x, y:this.anim.start.y, ts:Date.now()}; 
            this.anim.prePrevious=this.anim.previous;
            window.addEventListener('mouseup',this.mouseUpAfterDrag);
            window.addEventListener('mousemove',this.dragOnMouseMove); 
        }
    }

    zmMouseUpAfterDrag = (e) => {
        e.stopPropagation();
        clearTimeout(this.mode.timer);
        if(e.target==this.imgDOM.current){ 
            e.preventDefault();
            this.anim.speed = (Date.now() - this.anim.previous.ts) > 100 ? 
                {x:0,y:0} :
                {x:(this.anim.previous.x-this.anim.prePrevious.x)/3, y:(this.anim.previous.y-this.anim.prePrevious.y)/3};
            this.anim.on=true; 
            this.inertion();
        }
        window.removeEventListener('mousemove',this.zmDragOnMouseMove);
        window.removeEventListener('mouseup',this.zmMouseUpAfterDrag);
    }

    zmDragOnMouseMove = (event) => {
        event.preventDefault();
        var newCenterX=this.img.center.x-this.anim.previous.x+event.clientX;
        var newCenterY=this.img.center.y-this.anim.previous.y+event.clientY;;
        if(newCenterX-this.img.z.w/2<this.area.dragLimit.right&&newCenterX+this.img.z.w/2>this.area.dragLimit.left)
            this.img.center.x-=this.anim.previous.x-event.clientX;
        if(newCenterY-this.img.z.h/2<this.area.dragLimit.bottom&&newCenterY+this.img.z.h/2>this.area.dragLimit.top)
            this.img.center.y-=this.anim.previous.y-event.clientY;
        requestAnimationFrame(this.setdom);
        this.anim.prePrevious=this.anim.previous; 
        this.anim.previous={x:event.clientX, y:event.clientY, ts:Date.now()};
    }

    dragOnMouseMove = (event) => { 
        event.preventDefault();
        if(this.mode.horizontal) {
            this.img.center.x-=this.anim.previous.x-event.clientX; 
            this.leftGhost.pos.left-=this.anim.previous.x-event.clientX;
            this.rightGhost.pos.left-=this.anim.previous.x-event.clientX;
        }
        else this.img.center.y-=this.anim.previous.y-event.clientY;
        requestAnimationFrame(this.ssetdom);
        this.count.j++;
        if(this.count.j==2){
            if(Math.abs(this.anim.prePrevious.x-event.clientX)>Math.abs(this.anim.prePrevious.y-event.clientY)) this.mode.horizontal=true;
            else  this.mode.horizontal=false;
        }
        this.anim.prePrevious=this.anim.previous; 
        this.anim.previous={x:event.clientX, y:event.clientY, ts:Date.now()};
    }

    mouseUpAfterDrag = (e) => { 
        e.stopPropagation();
        e.preventDefault();
        clearTimeout(this.mode.timer);
        if(this.img.center.x<this.area.W/4)this.moveTo('left');
        else if(this.img.center.x>3*this.area.W/4)this.moveTo('right');
        else if(this.img.center.y>3*this.area.H/4)this.moveTo('down');
        else if(this.img.center.y<this.area.H/4)this.moveTo('up');
        else this.moveTo('center');
        window.removeEventListener('mousemove',this.dragOnMouseMove);
        window.removeEventListener('mouseup',this.mouseUpAfterDrag);
    }

    imgLongclick = () => {
        if(this.touch.isTouchDevice) {
            let ctr = this.state.mode.touchControls;
            this.setState( { mode: { touchControls: !ctr } } );
        } 
        else {
            let ctr = this.state.mode.controls;
            this.setState( { mode: { controls: !ctr } } );
        }
    }

    mouseWheel = (e) => { 
        e.stopPropagation(); 
        //console.log('mousewheel: ',e);
        //e.preventDefault(); 
        this.mode.zoom=true;
        this.setState( { mode: { controls: false } } );
        var delta = 0;
        if (!e) e = window.event;
        if (e.wheelDelta) { 
            delta = e.wheelDelta/120; //console.log('wheelDelta is taken: ',delta);  
        }
        else if (e.detail) { 
            delta = -e.detail/3; //console.log('detail is taken: ',delta); 
        } 
        else if (e.deltaY) { 
            delta = -e.deltaY/3; //console.log('deltaY is taken: ',delta); 
        } 
  
        if (delta)
            this.handle(delta, e);
            //if (e.preventDefault) e.preventDefault();
            e.returnValue = false;
    }

    handle = (delta, event) => { 
        const zmStep=this.touch.isTouchDevice ? 
            { level1:1, level2:2, threshold:3, minZm:1, maxZm:15 } : 
            { level1:0.4, level2:0.8, threshold:2, minZm:0.8, maxZm:15 };
        let zm=this.img.zm, targZm=this.img.zm, targ={x:this.img.center.x,y:this.img.center.y}, speed={x:0,y:0};
        let zmAnimRes = navigator.userAgent.includes('Firefox') ? 5 : 30;
        if (delta < 0){
            if(zm-zmStep.minZm>zmStep.level1) targZm=zm<zmStep.threshold ? zm-zmStep.level1 : zm-zmStep.level2;
            else targZm = zmStep.minZm;

            //console.log('zm: ',zm, 'zm-zmStep.minZm: ',zm-zmStep.minZm,'targZm: ',targZm);
        }
        else {
            if(zm<zmStep.maxZm) targZm=zm<zmStep.threshold ? zm+zmStep.level1 : zm+zmStep.level2;
        }
        var eventPoint=this.touch.isTouchDevice ? { x:this.area.W/2, y:this.area.H/2 } : { x:event.clientX, y:event.clientY };
        targ={x:eventPoint.x-(eventPoint.x-this.img.center.x)*targZm/zm, y:eventPoint.y-(eventPoint.y-this.img.center.y)*targZm/zm};
        speed={x:(targ.x-this.img.center.x)/zmAnimRes,y:(targ.y-this.img.center.y)/zmAnimRes, zm:(zm-targZm)/zmAnimRes};


        if( targZm >3 ) this.upperStage();
        else this.lowerStage();

        if(Math.abs(zm-zmStep.minZm)>0.05 || delta>0) {
            let animId = Math.floor(Math.random() * 1000);
            this.zoomAnim.id = animId;
            this.anim.on=true;
            
            var i=0; 
            var animate=()=>{ 
                i++;
                this.img.center.x+=speed.x; this.img.center.y+=speed.y;
                this.img.zm-=speed.zm;
                this.setdom();
                //console.log('animation ',animId,' zm: ', this.img.zm);
                if( i<zmAnimRes && this.anim.on===true && this.zoomAnim.id === animId ) requestAnimationFrame(animate);
            };
            animate();
        }
    }

    dblclick = (e) => {
        e.stopPropagation(); 
        e.preventDefault(); 
        this.mode.zoom=false;
        this.anim.on=false;
        let ctrl = this.touch.isTouchDevice ? false : true;
        this.setState({ mode: { controls: ctrl }});
        this.img.zm=1;
        this.img.center={x:this.area.W/2, y:this.area.H/2};
        this.img.z={w:this.img.startDim.w, h:this.img.startDim.h};
        this.setSizeAndPosition();
    }

    touchStart = (e) => { 
        e.stopPropagation();
        e.preventDefault();
        if(this.touch.mode==1){
            this.anim.on=false;
            clearTimeout(this.mode.timer);
            var touch=Array.from(e.touches).filter((item)=>{ return item.identifier!=this.touch1.id })[0];
            this.touch2={ id:touch.identifier, pos:{ x:touch.clientX, y:touch.clientY }, t:Date.now() };
            this.touchesMiddle.pos={ x:(this.touch1.pos.x+this.touch2.pos.x)/2, y:(this.touch1.pos.y+this.touch2.pos.y)/2 };
            this.touchesMiddle.distance=Math.sqrt((this.touch1.pos.x-this.touch2.pos.x)*(this.touch1.pos.x-this.touch2.pos.x)+(this.touch1.pos.y-this.touch2.pos.y)*(this.touch1.pos.y-this.touch2.pos.y));
            this.touchesMiddle.startDistance=this.touchesMiddle.distance;
            this.touchesMiddle.startZm=this.img.zm;
            if(this.mode.zoom==false){
                window.removeEventListener('touchmove',this.dragOnTouchMove);
                window.removeEventListener('touchend',this.touchUpAfterDrag);
                window.addEventListener('touchend',this.zmTouchUpAfterDrag);
                window.addEventListener('touchmove',this.zmDragOnTouchMove);
                this.mode.zoom=true;
            }
            this.touch.mode=2
        }
        if(this.touch.mode==0){
            this.touch1.id=e.touches[0].identifier;
            this.touch1.pos={x:e.touches[0].clientX, y:e.touches[0].clientY};
            this.touch1.t=Date.now();
            this.touch.mode=1;

            this.mode.downOnCurtainFlag=false;
            this.anim.on=false;
            this.mode.timer=setTimeout(()=>{
            if(Math.abs(this.anim.previous.x-this.anim.start.x)<=3&&Math.abs(this.anim.previous.y-this.anim.start.y)<=3)this.imgLongclick();
            },1000);
            if(this.mode.zoom==true){ 
                this.anim.start={x:e.touches[0].clientX, y:e.touches[0].clientY, zm:1 }; 
                this.anim.previous={ x:this.anim.start.x, y:this.anim.start.y, ts:Date.now() }; 
                this.anim.prePrevious=this.anim.previous;
                window.addEventListener('touchend',this.zmTouchUpAfterDrag);
                window.addEventListener('touchmove',this.zmDragOnTouchMove);
            }
            else {
                this.count.j=0;
                this.anim.start={x:this.touch1.pos.x, y:this.touch1.pos.y}; 
                this.anim.previous={ x:this.anim.start.x, y:this.anim.start.y, ts:Date.now() };; 
                this.anim.prePrevious=this.anim.previous;
                window.addEventListener('touchend',this.touchUpAfterDrag);
                window.addEventListener('touchmove',this.dragOnTouchMove);
            } 
        }
    }

    dragOnTouchMove = (e) => {
        if(this.touch.mode==1){ 
            e.preventDefault();
            this.touch1.pos={x:e.touches[0].clientX, y:e.touches[0].clientY};
            if(this.mode.horizontal) { 
                this.img.center.x-=this.anim.previous.x-this.touch1.pos.x;
                this.leftGhost.pos.left-=this.anim.previous.x-this.touch1.pos.x;
                this.rightGhost.pos.left-=this.anim.previous.x-this.touch1.pos.x;    
            }
            else this.img.center.y-=this.anim.previous.y-this.touch1.pos.y;
            requestAnimationFrame(this.ssetdom);
            this.count.j++;
            if(this.count.j==2){
                if(Math.abs(this.anim.prePrevious.x-this.touch1.pos.x)>Math.abs(this.anim.prePrevious.y-this.touch1.pos.y)) this.mode.horizontal=true;
                else  this.mode.horizontal=false;
            }
            this.anim.prePrevious=this.anim.previous; 
            this.anim.previous={x:this.touch1.pos.x, y:this.touch1.pos.y, ts:Date.now()};
        }
    }

    touchUpAfterDrag = (e) => {
        if(this.touch.mode==1){
          e.preventDefault();
          clearTimeout(this.mode.timer);
          window.removeEventListener('touchmove',this.dragOnTouchMove);
          window.removeEventListener('touchend',this.touchUpAfterDrag);
          if(this.itWasDoubleTap(e)){
            if(!this.mode.zoom){
              this.mode.zoom=true;
              this.handle(1);
            }
          }
          else {
            if(this.img.center.x<this.area.W/4)this.moveTo('left');
            else if(this.img.center.x>3*this.area.W/4)this.moveTo('right');
            else if(this.img.center.y>3*this.area.H/4)this.moveTo('down');
            else if(this.img.center.y<this.area.H/4)this.moveTo('up');
            else this.moveTo('center');
          }
          this.touch.mode=0;
        }
    }

    zmDragOnTouchMove = (e) => {
        if(this.touch.mode==2){
          e.preventDefault();
          var tch1=Array.from(e.touches).filter((item)=>{ return item.identifier==this.touch1.id })[0];
          var tch2=Array.from(e.touches).filter((item)=>{ return item.identifier==this.touch2.id })[0];
          this.touch1.pos={x:tch1.clientX, y:tch1.clientY};
          this.touch2.pos={x:tch2.clientX, y:tch2.clientY};
          this.touchesMiddle.pos={ x:(this.touch1.pos.x+this.touch2.pos.x)/2, y:(this.touch1.pos.y+this.touch2.pos.y)/2 };
          this.touchesMiddle.distance=Math.sqrt((this.touch1.pos.x-this.touch2.pos.x)*(this.touch1.pos.x-this.touch2.pos.x)+(this.touch1.pos.y-this.touch2.pos.y)*(this.touch1.pos.y-this.touch2.pos.y));
          // console.log(this.touchesMiddle.distance/this.touchesMiddle.startDistance);
          var zm=this.img.zm;
          this.img.zm=this.touchesMiddle.startZm*this.touchesMiddle.distance/this.touchesMiddle.startDistance;

          if( this.img.zm >3 ) this.upperStage();
          else this.lowerStage();

          // var eventPoint=this.touch.isTouchDevice ? { x:this.area.W/2, y:this.area.H/2 } : { x:event.clientX, y:event.clientY }
            var targ={x:this.touchesMiddle.pos.x-(this.touchesMiddle.pos.x-this.img.center.x)*this.img.zm/zm, y:this.touchesMiddle.pos.y-(this.touchesMiddle.pos.y-this.img.center.y)*this.img.zm/zm};
          this.img.center=targ;
          requestAnimationFrame(this.setdom);
        }
        if(this.touch.mode==1){ 
          e.preventDefault();
          this.touch1.pos={x:e.touches[0].clientX, y:e.touches[0].clientY};
  
          var newCenterX=this.img.center.x-this.anim.previous.x+this.touch1.pos.x;
          var newCenterY=this.img.center.y-this.anim.previous.y+this.touch1.pos.y;;
          if(newCenterX-this.img.z.w/2<this.area.dragLimit.right&&newCenterX+this.img.z.w/2>this.area.dragLimit.left)
            this.img.center.x-=this.anim.previous.x-this.touch1.pos.x;
          if(newCenterY-this.img.z.h/2<this.area.dragLimit.bottom&&newCenterY+this.img.z.h/2>this.area.dragLimit.top)
            this.img.center.y-=this.anim.previous.y-this.touch1.pos.y;
  
          requestAnimationFrame(this.setdom);
          this.anim.prePrevious=this.anim.previous; 
          this.anim.previous={x:this.touch1.pos.x, y:this.touch1.pos.y, ts:Date.now()};
        }
    }
    
    zmTouchUpAfterDrag = (e) => { 
        if(this.touch.mode==2){   
          if(Array.from(e.touches).filter((item)=>{ return item.identifier==this.touch1.id }).length==0) {
            clearTimeout(this.mode.timer);
            window.removeEventListener('touchmove',this.zmDragOnTouchMove);
            window.removeEventListener('touchend',this.zmTouchUpAfterDrag);
            this.touch.mode=0;
          }
          else if(Array.from(e.touches).filter((item)=>{ return item.identifier==this.touch2.id }).length==0) {
            this.anim.previous={x:this.touch1.pos.x, y:this.touch1.pos.y, ts:Date.now()};
            this.anim.prePrevious=this.anim.previous;    
            this.touch.mode=1;
          } 
        }
        else if(this.touch.mode==1){
          if(this.itWasDoubleTap(e)){
            if(this.mode.zoom){
              this.mode.zoom=false;
              if(this.img.zm>3)this.lowerStage();
              this.img.zm=1;
              this.img.center={x:this.area.W/2, y:this.area.H/2};
              this.img.z={w:this.img.startDim.w, h:this.img.startDim.h};
              this.anim.on=false;
            }
          }
          clearTimeout(this.mode.timer);
          if(e.target==this.imgDOM.current){
            e.preventDefault();
            this.anim.speed = (Date.now() - this.anim.previous.ts) > 100 || (Math.abs(this.anim.previous.x-this.anim.prePrevious.x) < 5 && Math.abs(this.anim.previous.y-this.anim.prePrevious.y) < 5) ? 
                {x:0, y:0} :
                {x:(this.anim.previous.x-this.anim.prePrevious.x)/2, y:(this.anim.previous.y-this.anim.prePrevious.y)/2};
            this.anim.on=true; 
            this.inertion();
          }
          window.removeEventListener('touchmove',this.zmDragOnTouchMove);
          window.removeEventListener('touchend',this.zmTouchUpAfterDrag);
  
  
          this.touch.mode=0;
        }
    }

    itWasDoubleTap = (e) => {
        //if there are touches but no first touch between them 
        // if(this.touch.mode!=0&&Array.from(e.touches).filter((item)=>{ return item.identifier==this.touch1.id }).length==0) {
        //  this.anim.on=false; //stop animation
        
        // if if was a tap?
        let wft = false;
        if(Date.now()-this.touch1.t<200&&Math.abs(this.touch1.pos.x-e.changedTouches[0].clientX)<5&&Math.abs(this.touch1.pos.y-e.changedTouches[0].clientY)<5){
        if(Date.now()-this.touch1.prevtap.t<400&&Math.abs(this.touch1.prevtap.pos.x-e.changedTouches[0].clientX)<10&&Math.abs(this.touch1.prevtap.pos.y-e.changedTouches[0].clientY)<10){
            if(this.timout!=-1)window.clearTimeout(this.timout);
            wft = true; // console.log('DOUBLETAP');
        }
        else {
            this.timout=window.setTimeout(()=>{
            // console.log('TAP'); code for single tap here
            this.timout=-1;
            },300);
        } 
        this.touch1.prevtap.pos={ x:this.touch1.pos.x, y:this.touch1.pos.y };
        this.touch1.prevtap.t=this.touch1.t;
        }
        return wft;
    }

    ctrlZm = (e, delta) => {
        e.stopPropagation();
        this.mode.zoom=true;
        this.handle(delta);
    }
  

    loadStage2 = () => {
        if(this.imgMems[this.state.currImg].st2.width==0) { 
            console.log('ST2 loading...');
            this.setState({ preloaderOn:true });
            this.imgMems[this.state.currImg].st2.src = this.getStageUrls(this.state.currImg).st2; // попытка скачать стадию 2, в случае успеха работает обработчик stageLoaded
        }
    }
    
    getStageUrls = (i) => { //console.log('this.images[this.state.currImg]', this.images[this.state.currImg]);
        // let tempUrl = this.props.images[this.state.currImg].src;
        let tempUrl = this.images[i].src;
        let st0 = tempUrl.substring(0, tempUrl.lastIndexOf("."))+'.st0'+tempUrl.substring(tempUrl.lastIndexOf("."),tempUrl.length);
        let st1 = tempUrl.substring(0, tempUrl.lastIndexOf("."))+'.st1'+tempUrl.substring(tempUrl.lastIndexOf("."),tempUrl.length);
        let st2 = tempUrl.substring(0, tempUrl.lastIndexOf("."))+'.st2'+tempUrl.substring(tempUrl.lastIndexOf("."),tempUrl.length);
        return { st0: st0, st1: st1, st2: st2 };
    }

    setAreaParams = (forFullscreen = false) => {
        this.area.W = forFullscreen ? window.screen.width : Math.max(document.documentElement.clientWidth, window.innerWidth || 0); 
        this.area.H = forFullscreen ? window.screen.height : Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.area.ar = this.touch.isTouchDevice ? this.area.W/this.area.H : (this.area.W-200)/(this.area.H-200);
        this.area.dragLimit = { 
            top: this.touch.isTouchDevice ? this.area.H/2 : 50, 
            right: this.touch.isTouchDevice ? this.area.W/2 : this.area.W-50,
            bottom: this.touch.isTouchDevice ? this.area.H/2 : this.area.H-50, 
            left: this.touch.isTouchDevice ? this.area.W/2 : 50 
        }      
    }

    resetLightBoxParams = () => { // обнуление  всех параметров лайтбокса
        this.images = [];
        this.fullscreen = { on: false, dontHandleResize: false, dontHandleFullscreen: false };
        this.area= { 
            W:Math.max(document.documentElement.clientWidth, window.innerWidth || 0), 
            H:Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
            ar:1,
            dragLimit:{ top:50, right:50, bottom:1000, left:1000 }
        };    
        this.img = { realDim:{w:0,h:0,wasLoaded:0 }, startDim:{w:0,h:0}, z:{w:0,h:0}, pos:{left:0, top:0}, center:{x:0, y:0}, zm:1, ar:1 };
        this.touch = { isTouchDevice:'ontouchstart' in window ? true : false, mode:0, drag:false };
        this.touch1 = { id:0, pos:{x:0,y:0}, t:0, prevtap:{ pos:{x:0,y:0},t:0} };
        this.touch2 = { id:0, pos:{x:0,y:0}, t:0 };
        this.touchesMiddle = { pos:{x:0, y:0}, distance:0, startDistance:0, startZm:1 };
        this.anim = { 
            on:false, 
            speed:{x:0,y:0,zm:1}, 
            start:{x:0,y:0,zm:1}, 
            target:{x:0,y:0,zm:1}, 
            previous:{x:0,y:0,ts:0}, 
            prePrevious:{x:0,y:0,ts:0} 
        };
        this.mode = { zoom:false, horizontal:true, downOnCurtainFlag:false };
        this.count = { tick:0, j:0 };
        this.curtainOpacity = CURTAIN_OPACITY;
        this.setState({
            showFull:false,
            currImg:-1,
            preloaderOn:false,
            img: { z:{w:0,h:0}, pos:{left:0, top:0} },
            mode: { controls:true, touchControls:true }
        });

        this.mode = { zoom:false, horizontal:true, downOnCurtainFlag:false };
        this.count = { tick:0, j:0 };
        this.curtainOpacity = CURTAIN_OPACITY;  
    }


    flushLightBoxParams = () => { // обнуление оперативных параметров лайтбокса
        this.img = { realDim:{w:0,h:0,wasLoaded:0 }, startDim:{w:0,h:0}, z:{w:0,h:0}, pos:{left:0, top:0}, center:{x:0, y:0}, zm:1, ar:1 };
        this.touch = { isTouchDevice:'ontouchstart' in window ? true : false, mode:0, drag:false };
        this.touch1 = { id:0, pos:{x:0,y:0}, t:0, prevtap:{ pos:{x:0,y:0},t:0} };
        this.touch2 = { id:0, pos:{x:0,y:0}, t:0 };
        this.touchesMiddle = { pos:{x:0, y:0}, distance:0, startDistance:0, startZm:1 };
        this.anim = { 
            on:false, 
            speed:{x:0,y:0,zm:1}, 
            start:{x:0,y:0,zm:1}, 
            target:{x:0,y:0,zm:1}, 
            previous:{x:0,y:0,ts:0}, 
            prePrevious:{x:0,y:0,ts:0} 
        };
        this.mode = { zoom:false, horizontal:true, downOnCurtainFlag:false };
        this.count = { tick:0, j:0 };
        this.curtainOpacity = CURTAIN_OPACITY;
        this.setState({
            showFull:false,
            currImg:-1,
            preloaderOn:false,
            img: { z:{w:0,h:0}, pos:{left:0, top:0} },
            mode: { controls:true, touchControls:true }
        });
    }

    countSizeAndPosition = () => { 
        this.anim.on=false;
        this.img.ar=this.img.realDim.w/this.img.realDim.h; //console.log('this.img.ar: ', this.img.ar)
        if(this.img.ar<=this.area.ar) {
            this.img.z.h=this.touch.isTouchDevice ? this.area.H : this.area.H-100; this.img.z.w=this.img.z.h*this.img.ar; 
        } 
        else {
            this.img.z.w=this.touch.isTouchDevice ? this.area.W : this.area.W-100; this.img.z.h=this.img.z.w/this.img.ar;
        }
        if (this.img.zm>3)this.lowerStage();
        this.img.zm=1; 
        this.img.center={x:this.area.W/2, y:this.area.H/2};
        this.img.startDim = { w: this.img.z.w, h: this.img.z.h };
        this.curtainOpacity=CURTAIN_OPACITY;
        this.mode.zoom=false;
        let ctrl = this.touch.isTouchDevice ? false : true;
        this.setState({ mode: { controls: ctrl }});
    }

    setSizeAndPosition = () => { 
        this.countSizeAndPosition();
        this.setdom();
    }

    openWidget = async (i) => {
        this.flushLightBoxParams();

        this.setImage(i); // set image i as current and read real image dimension

        document.body.classList.add('class-for-finally-lightbox'); 


        if((USE_FULL_SCREEN_BY_DEFAULT === 'yes' // open widget in fullscreen mode
                || (USE_FULL_SCREEN_BY_DEFAULT === 'mobile_only' && this.touch.isTouchDevice)) 
            && document.fullscreenEnabled) {
            this.fullscreen.dontHandleResize = true; // turn off standard resize handler for one time
            this.fullscreen.dontHandleFullscreen = true; // turn off standard fullscreenchange handler for one time
            this.setAreaParams(true); // set area BEFORE fullscreen request due weird behaviour of screen.width in V8 browsers in fullscreenchange handler
            this.countSizeAndPosition(); 
            if (this.widgetBlock.current.requestFullscreen) await this.widgetBlock.current.requestFullscreen();
            else if (this.widgetBlock.current.webkitRequestFullscreen) await this.widgetBlock.current.webkitRequestFullscreen(); /* Safari */
            this.fullscreen.on = document.fullscreenElement ? true : false;
            this.setdom(); 
        } else {
            this.setAreaParams();
            this.countSizeAndPosition(); 
            this.setdom(); 
        }

        this.setState({ showFull:true }); // show the whole thing
    }

    getGhosts = () => {
        let currImg = this.state.currImg;
        let imgsNum = this.imgMems.length;
        let leftGhostImg = 0, rightGhostImg = 0;
        if(imgsNum > 1) {
            if(currImg===0) { leftGhostImg = imgsNum-1; rightGhostImg = currImg+1; }
            else if(currImg===imgsNum-1) { leftGhostImg = currImg-1; rightGhostImg = 0; }
            else { leftGhostImg = currImg-1; rightGhostImg = currImg+1; }
        }
        return { left:leftGhostImg, right:rightGhostImg };
    }

    setGhost = (side = 'left') => {
        let g = this.getGhosts();
        if(side==='left'){
            let sp = this.ghostSizeAndPosition(g.left, 'left');
            this.leftGhost = { src: this.imgMems[g.left].preview.src, z:{w:sp.z.w,h:sp.z.h}, pos:{left:sp.pos.left,top:sp.pos.top} };
            this.setState({ leftGhost: { src: this.imgMems[g.left].preview.src, z:{w:sp.z.w,h:sp.z.h}, pos:{left:sp.pos.left,top:sp.pos.top} } });
        }
        else if (side==='right') {
            let sp = this.ghostSizeAndPosition(g.right, 'right');
            this.rightGhost = { src: this.imgMems[g.right].preview.src, z:{w:sp.z.w,h:sp.z.h}, pos:{left:sp.pos.left,top:sp.pos.top} };
            this.setState({ rightGhost: { src: this.imgMems[g.right].preview.src, z:{w:sp.z.w,h:sp.z.h}, pos:{left:sp.pos.left,top:sp.pos.top} } });
        }   
    }

    setGhosts = () => {
        this.setGhost('left');
        this.setGhost('right');
    }

    ghostSizeAndPosition = (n, side = 'left') => {
        let ar = this.imgMems[n].currWidth / this.imgMems[n].currHeight;
        let w = 0, h = 0, left = 0, top = 0;
        if(ar<=this.area.ar) {
            h=this.touch.isTouchDevice ? this.area.H : this.area.H-100; w=h*ar; 
        } 
        else {
            w=this.touch.isTouchDevice ? this.area.W : this.area.W-100; h=w/ar;
        }

        if(side==='left') left = -50 - w;
        else if(side==='right') left = this.area.W +50;
        top = this.area.H/2 - h/2;

        return { z:{w:w,h:h}, pos:{left:left, top:top} };
    }

    // set image i as current and read real image dimension
    setImage = async (i) => { 
        await this.setState({ currImg:i, imgSrc: this.imgMems[i].preview.src }); // console.log('this.state.currImg: ', this.state.currImg); 
        let w = this.imgMems[i].currWidth;
        this.img.realDim = { w: w, h: this.imgMems[i].currHeight };
        this.setSizeAndPosition();
        this.getInitialStages(i); // load 0 and 1st stages of image, if exist
        // this.setGhosts();
        setTimeout(()=>{ this.setGhosts(); },100);
    }

    getInitialStages = (i=-1) => {
        let cI = i===-1 ? this.state.currImg : i;
        let stage = this.getStageUrls(cI);
        //console.log("setImage CTRLS1: ", this.state.mode.controls);
        this.setState({ preloaderOn:true });
        this.imgMems[cI].st0.src = stage.st0; // попытка скачать стадию 0, в случае успеха работает обработчик stageLoaded
        this.imgMems[cI].st1.src = stage.st1; // попытка скачать стадию 1, в случае успеха работает обработчик stageLoaded
        //console.log("setImage CTRLS2: ", this.state.mode.controls);
    }

    setImage_ = async (i) => {
        this.flushLightBoxParams();
        await this.setState({ currImg:i }); 
        let w = this.imgMems[i].currWidth; 
        this.img.realDim = { w: w, h: this.imgMems[i].currHeight };
        document.body.classList.add('class-for-finally-lightbox');
        this.setSizeAndPosition();        
        this.setState({ showFull:true });

        let stage = this.getStageUrls(this.state.currImg);

        // console.log('ST0 loading...');
        console.log("setImage CTRLS1: ", this.state.mode.controls);
        this.setState({ preloaderOn:true });
        this.imgMems[this.state.currImg].st0.src = stage.st0; // попытка скачать стадию 0, в случае успеха работает обработчик stageLoaded
        // console.log('ST1 loading...');
        this.imgMems[this.state.currImg].st1.src = stage.st1; // попытка скачать стадию 1, в случае успеха работает обработчик stageLoaded
        console.log("setImage CTRLS2: ", this.state.mode.controls);
    }

    async clickGalleryImage(id) {
        await this.openWidget(id);
    }

    getCurrImg() {
        // return this.props.images[this.state.currImg];
        return this.images[this.state.currImg];
    }

    moveTo = (direction, numberOfSteps=10) => {
        let centerTarget = {x:this.area.W/2,y:this.area.H/2};
        if(direction=='center')this.anim.target={x:this.area.W/2,y:this.area.H/2};
        if(direction=='left')this.anim.target={x:-this.area.W/2,y:this.area.H/2}; 
        if(direction=='right')this.anim.target={x:this.area.W+this.area.W/2,y:this.area.H/2};
        if(direction=='up')this.anim.target={x:this.area.W/2,y:-this.area.H/2};
        if(direction=='down')this.anim.target={x:this.area.W/2,y:this.area.H+this.area.H/2};
        this.anim.speed={x:(this.anim.target.x-this.img.center.x)/numberOfSteps,y:(this.anim.target.y-this.img.center.y)/numberOfSteps}; 
        let leftGhostSpeed=this.anim.speed, rightGhostSpeed=this.anim.speed;
        if(direction=='left')rightGhostSpeed={x:(centerTarget.x-this.rightGhost.z.w/2-this.rightGhost.pos.left)/numberOfSteps,y:0};
        if(direction=='right')leftGhostSpeed={x:(centerTarget.x-this.leftGhost.z.w/2-this.leftGhost.pos.left)/numberOfSteps,y:0};
        
        this.anim.on=true;
        var i=0;
        var moveit=()=>{
            //let c=this.slowDown(i,numberOfSteps);
            this.img.center.x+=this.anim.speed.x; this.img.center.y+=this.anim.speed.y;
            // this.leftGhost.pos.left+=this.anim.speed.x; this.rightGhost.pos.left+=this.anim.speed.x;
            this.leftGhost.pos.left+=leftGhostSpeed.x; 
            this.rightGhost.pos.left+=rightGhostSpeed.x;

            this.ssetdom();
            i++;
            if(this.anim.on){
                if(i<numberOfSteps)requestAnimationFrame(moveit);
                else {
                    this.anim.on=false;
                    if(direction=='up'||direction=='down')this.galleryCtrl.closeLightbox();
                    else if(direction!='center') { 
                        if(direction=='right') {
                            // let ci = this.state.currImg==0 ? this.props.images.length-1 : this.state.currImg-1;
                            let ci = this.state.currImg==0 ? this.images.length-1 : this.state.currImg-1;
                            this.setImage(ci);
                        } 
                        if(direction=='left') {
                            // let ci = this.state.currImg==this.props.images.length-1 ? 0 : this.state.currImg+1;
                            let ci = this.state.currImg==this.images.length-1 ? 0 : this.state.currImg+1;
                            this.setImage(ci);
                        }
                    }
                }
            }
        }
        requestAnimationFrame(moveit);	
    }

    inertion = () => {
        this.img.center.x+=this.anim.speed.x; this.img.center.y+=this.anim.speed.y;
        this.setdom();
        if(this.anim.on){
            if(this.img.center.x+this.img.z.w/2<this.area.dragLimit.left||this.img.center.x-this.img.z.w/2>this.area.dragLimit.right){ this.anim.speed.x=-this.anim.speed.x; this.inertionStop(); }
            else if (this.img.center.y+this.img.z.h/2<this.area.dragLimit.top||this.img.center.y-this.img.z.h/2>this.area.dragLimit.bottom){ this.anim.speed.y=-this.anim.speed.y; this.inertionStop(); }
            else requestAnimationFrame(this.inertion); 
        }
    }

    inertionStop = (numberOfSteps=60) => {
        var i=0;
        var moveit=()=>{
            let c=this.slowDown(i,numberOfSteps);
            this.img.center.x+=this.anim.speed.x*c; this.img.center.y+=this.anim.speed.y*c;
            this.setdom();
            i++;
            if(this.img.center.x+this.img.z.w/2<this.area.dragLimit.left||this.img.center.x-this.img.z.w/2>this.area.dragLimit.right) this.anim.speed.x=-this.anim.speed.x;
            if(this.img.center.y+this.img.z.h/2<this.area.dragLimit.top||this.img.center.y-this.img.z.h/2>this.area.dragLimit.bottom) this.anim.speed.y=-this.anim.speed.y;
            if(this.anim.on){
                if(i<numberOfSteps)requestAnimationFrame(moveit);
                else this.anim.on=false;
            }
        }
        moveit();
    }

    slowDown = (step,numberOfSteps=60) => {
        let x=step*2.5/numberOfSteps;
        return 2/(2*x+1.5)-0.3;
    }

    setdom = () => {
        this.img.z = { w: this.img.startDim.w * this.img.zm, h: this.img.startDim.h * this.img.zm }; 
        this.img.pos = { left: this.img.center.x - this.img.z.w/2, top: this.img.center.y - this.img.z.h/2 };
        this.setState({
            img: { z: {w: this.img.z.w, h: this.img.z.h }, pos: { left: this.img.pos.left, top: this.img.pos.top } }
        });
    }

    ssetdom = () => { 
        this.img.pos={left:this.img.center.x-this.img.z.w/2, top:this.img.center.y-this.img.z.h/2};
        this.setState({
            img: { z: {w: this.img.z.w, h: this.img.z.h }, pos: { left: this.img.pos.left, top: this.img.pos.top } }
        });
        this.setState({ leftGhost: { ...this.state.leftGhost, pos:this.leftGhost.pos } });
        this.setState({ rightGhost: { ...this.state.rightGhost, pos:this.rightGhost.pos } });
        this.setState({ curtainOpacity: this.curtainOpacity });
        this.curtainOpacity=CURTAIN_OPACITY*(4*Math.max(Math.min(this.img.center.y,this.area.H/2),this.area.H/4)/this.area.H-1)*(3-4*Math.max(Math.min(this.img.center.y,3*this.area.H/4),this.area.H/2)/this.area.H);
    }

    toggleControlsTouch = () => {
        let ctr = this.state.mode.touchControls;
        this.setState( { mode: { touchControls: !ctr }} );
    }
    
    render() {
        let controls = !this.state.mode.controls ? '' :
        <div className="controls">
            <div className="button_previous" onMouseUp={ this.galleryCtrl.prevImage }><img src={SVG.previousArrow} /></div>
            <div className="button_next" onMouseUp={ this.galleryCtrl.nextImage } ><img src={SVG.nextArrow} /></div>
            <div className="button_close" 
                onMouseUp={this.galleryCtrl.closeLightbox}
            >
                <img src={SVG.closeCross} />
            </div>
        </div>;

        let controlsTouch = !(this.touch.isTouchDevice&&this.state.mode.touchControls) ? '' :
        <div className="touch_controls">
            <div className="touch_control button_zoomplus" 
                onTouchStart = { (e)=>{ e.stopPropagation(); } }
                onTouchEnd = { (e)=>{ e.stopPropagation(); } }
                onTouchMove = { (e)=>{ e.stopPropagation(); } }
                onClick = { (e)=>{ e.stopPropagation(); this.ctrlZm(e,1); } }
            >
                    <img src={SVG.zoomPlusTouch} />
            </div>
            <div className="touch_control button_zoomminus" 
                onTouchStart = { (e)=>{ e.stopPropagation(); } }
                onTouchEnd = { (e)=>{ e.stopPropagation(); } }
                onTouchMove = { (e)=>{ e.stopPropagation(); } }
                onClick = { (e)=>{ e.stopPropagation(); this.ctrlZm(e,-1); } }
            >
                <img src={SVG.zoomMinusTouch} />
            </div>
            <div className="touch_control button_previous" 
                onTouchStart = { (e)=>{ e.stopPropagation(); } }
                onTouchEnd = { (e)=>{ e.stopPropagation(); } }
                onTouchMove = { (e)=>{ e.stopPropagation(); } }            
                onClick = { (e) =>{ e.stopPropagation(); this.galleryCtrl.prevImage(); }}
            >
                <img src={SVG.previousArrowTouch} />
            </div>
            <div className="touch_control button_next" 
                onTouchStart = { (e)=>{ e.stopPropagation(); } }
                onTouchEnd = { (e)=>{ e.stopPropagation(); } }
                onTouchMove = { (e)=>{ e.stopPropagation(); } }
                onClick={ (e) =>{ e.stopPropagation(); this.galleryCtrl.nextImage(); }}
            >
                <img src={SVG.nextArrowTouche} />
            </div>
            <div className="touch_control button_close" 
                onTouchStart = { (e)=>{ e.stopPropagation(); } }
                onTouchEnd = { (e)=>{ e.stopPropagation(); } }
                onTouchMove = { (e)=>{ e.stopPropagation(); } }
                onClick = { (e)=>{ e.stopPropagation(); this.galleryCtrl.closeLightbox(); } }
            >
                <img src={SVG.closeCrossTouch} />
            </div>
        </div>;

        let controlsTouchButton = !this.touch.isTouchDevice ? '' :
        <div className="touch_control_button"
                onTouchStart = { (e)=>{ e.stopPropagation(); } }
                onTouchEnd = { (e)=>{ e.stopPropagation(); } }
                onTouchMove = { (e)=>{ e.stopPropagation(); } }
                onClick = { (e)=>{ e.stopPropagation(); this.toggleControlsTouch(); } }        
        >
            <img src={SVG.toggleTouchControls} />
        </div>;

        let preloader = 
        <div className={ this.state.preloaderOn ? 'preloader' : 'preloader hidden' }>
            Loading next stage...
        </div>;

        let info = 
        <div className='preloader'>
            W:{this.state.img.z.w}   H: {this.state.img.z.h}
        </div>;

        return (
        <>
        {/* <div className="finally-lightbox-image-group">
            <ul>
                { this.images.map( (image, i) =>
                    <li key={ i }>
                        <img src={ image.src } 
                            onClick={ (e)=>{ e.stopPropagation(); e.preventDefault(); this.clickGalleryImage(i); } } 
                            onLoad={(e)=>{this.previewLoaded(e, i)}}
                        />
                    </li>
                ) }
            </ul>
        </div> */}
        <div ref={this.widgetBlock} className={this.state.showFull ? 'finally-lightbox-widget-block' : 'finally-lightbox-widget-block hidden'} 
            style={{ backgroundColor: 'rgba(0,0,0,'+this.curtainOpacity+')' }}
            onTouchStart={ (e) => { e.preventDefault(); } }
        >
            <div className="lightbox_wrapper" onMouseDown={this.downOnCurtain} onMouseUp={this.upOnCurtain}  >
                    <div className="lightbox">
                        <img ref={this.imgDOM} 
                            // style={{ width: this.state.img.z.w, height: this.state.img.z.h, top: this.state.img.pos.top, left: this.state.img.pos.left }}
                            style={{ 
                                width: this.state.img.z.w, 
                                height: this.state.img.z.h,
                                // top: 0, 
                                // left: 0,
                                // transform: `translate(${this.state.img.pos.left}px, ${this.state.img.pos.top}px) scale(${this.img.zm})`
                                transform: `translate(${this.state.img.pos.left}px, ${this.state.img.pos.top}px)` 
                            }}
                            
                            // src={ typeof this.props.images[this.state.currImg] === 'undefined' ? SVG.loading : this.props.images[this.state.currImg].src  }
                            // src={ typeof this.images[this.state.currImg] === 'undefined' ? SVG.loading : this.images[this.state.currImg].src  }
                            src={ this.state.imgSrc  }    
                            onMouseDown={this.imgMousedown}
                            onTouchStart={this.touchStart}
                            onWheel={this.mouseWheel}
                            onDoubleClick={this.dblclick}
                        />
                        {   !this.mode.zoom &&
                            <>
                            <img className='left_ghost'
                                style={{ 
                                    width: this.state.leftGhost.z.w,
                                    height: this.state.leftGhost.z.h,
                                    transform: `translate(${this.state.leftGhost.pos.left}px, ${this.state.leftGhost.pos.top}px)` 
                                }}
                                src={ this.state.leftGhost.src }    
                            />
                            <img className='righ_ghost'
                                style={{ 
                                    width: this.state.rightGhost.z.w, 
                                    height: this.state.rightGhost.z.h,
                                    transform: `translate(${this.state.rightGhost.pos.left}px, ${this.state.rightGhost.pos.top}px)`
                                }}
                                src={ this.state.rightGhost.src }    
                            />
                            </>
                        }

                    </div>
            </div>
            {controls}
            {controlsTouch}
            {controlsTouchButton}
            {preloader} 
            {/* {info} */}
        </div>
        </>
        );
    }
}

export default Lightbox;