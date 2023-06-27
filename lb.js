import { CURTAIN_OPACITY, USE_FULL_SCREEN_BY_DEFAULT } from './preferencies';
import galleryCtrl from './gallerycontrols';
import SVG from './svgs';

const lb = {

    ...galleryCtrl,

    images: [],

    currImg:-1,

    // Established by initState function
    // state: {
    //     showFull:false,
    //     preloaderOn: false,
    //     img: { z:{w:0,h:0}, pos:{left:0, top:0} },
    //     mode: { controls:true, touchControls:true },
    //     imgSrc: SVG.loading,
    //     leftGhost: { src:'', z:{w:100,h:100}, pos:{left:0,top:0} },
    //     rightGhost: { src:'', z:{w:0,h:0}, pos:{left:0,top:0} }
    // },



    fullscreen: { on: false, dontHandleResize: false, dontHandleFullscreen: false },

    area: { 
        W:Math.max(document.documentElement.clientWidth, window.innerWidth || 0), 
        H:Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
        ar:1,
        dragLimit:{ top:50, right:50, bottom:1000, left:1000 }
    },

    img: { realDim:{w:0,h:0,wasLoaded:0 }, startDim:{w:0,h:0}, z:{w:0,h:0}, pos:{left:0, top:0}, center:{x:0, y:0}, zm:1, ar:1 },
    touch: { isTouchDevice:'ontouchstart' in window ? true : false, mode:0, drag:false },
    touch1: { id:0, pos:{x:0,y:0}, t:0, prevtap:{ pos:{x:0,y:0},t:0} },
    touch2: { id:0, pos:{x:0,y:0}, t:0 },
    touchesMiddle: { pos:{x:0, y:0}, distance:0, startDistance:0, startZm:1 },
    anim: { 
        on:false, 
        speed:{x:0,y:0,zm:1}, 
        start:{x:0,y:0,zm:1}, 
        target:{x:0,y:0,zm:1}, 
        previous:{x:0,y:0,ts:0}, 
        prePrevious:{x:0,y:0,ts:0} 
    },
    zoomAnim: {
        id:0,
        lastTimestamp:0
    },
    leftGhost: { src:'', z:{w:100,h:100}, pos:{left:0,top:0} },
    rightGhost: { src:'', z:{w:0,h:0}, pos:{left:0,top:0} },


    mode: { zoom:false, horizontal:true, downOnCurtainFlag:false },
    count: { tick:0, j:0 },
    curtainOpacity: CURTAIN_OPACITY,

    imgDOM: null,
    widgetBlock: null,

    imgMems: [],

    wc: null, // widget context (object within visual component with framework-native functions, controlling component state)

    init(imgDOM, widgetBlock, widgetContext){
        this.imgDOM = imgDOM;
        this.widgetBlock = widgetBlock;
        this.wc = widgetContext;
        this.initState();
    },

    setState(st){  // mockup
        console.log('st');
    },

    initState(){
        // state: {
        //     showFull:false,
        //     preloaderOn: false,
        //     img: { z:{w:0,h:0}, pos:{left:0, top:0} },
        //     mode: { controls:true, touchControls:true },
        //     imgSrc: SVG.loading,
        //     leftGhost: { src:'', z:{w:100,h:100}, pos:{left:0,top:0} },
        //     rightGhost: { src:'', z:{w:0,h:0}, pos:{left:0,top:0} }
        // },
        Object.defineProperty(this, 'state', {
            configurable: true,
            value: Object.create({})
        });
        Object.defineProperties(this.state, {
            'showFull_': {
                value:false,
                configurable:true
            },
            'showFull': {
                get(){ return this.showFull_; },
                set(newValue){
                    Object.defineProperty(this, 'showFull_', { value:newValue });
                    lb.wc.setState('showFull', newValue);
                },
                enumerable: true
            },
            'preloaderOn_' : {
                value:false,
                configurable:true
            },
            'preloaderOn' : {
                get(){ return this.preloaderOn_; },
                set(newValue){
                    Object.defineProperty(this, 'preloaderOn_', { value:newValue });
                    lb.wc.setState('preloaderOn', newValue);
                },
            },
            'img_': {
                value: { z:{w:0,h:0}, pos:{left:0, top:0} },
                configurable:true
            },
            'img': {
                get(){ return this.img_; },
                set(newValue){
                    Object.defineProperty(this, 'img_', { value:newValue });
                    lb.wc.setState('img', newValue);
                },
                enumerable: true
            },
            'mode_': {
                value: { controls:true, touchControls:true },
                configurable:true
            },
            'mode': {
                get(){ return this.mode_; },
                set(newValue){
                    Object.defineProperty(this, 'mode_', { value:newValue });
                    lb.wc.setState('mode', newValue);
                },
                enumerable: true
            },
            'imgSrc_': {
                value: SVG.loading,
                configurable:true
            },
            'imgSrc': {
                get(){ return this.imgSrc_; },
                set(newValue){
                    Object.defineProperty(this, 'imgSrc_', { value:newValue });
                    lb.wc.setState('imgSrc', newValue);
                },
                enumerable: true
            },
            'leftGhost_': { 
                value: { src:'', z:{w:100,h:100}, pos:{left:0,top:0} },
                configurable:true
            },
            'leftGhost': {
                get(){ return this.leftGhost_; },
                set(newValue){
                    Object.defineProperty(this, 'leftGhost_', { value:newValue });
                    lb.wc.setState('leftGhost', newValue);
                },
                enumerable: true
            },
            'rightGhost_': { 
                value: { src:'', z:{w:0,h:0}, pos:{left:0,top:0} },
                configurable:true
            },
            'rightGhost': {
                get(){ return this.rightGhost_; },
                set(newValue){
                    Object.defineProperty(this, 'rightGhost_', { value:newValue });
                    lb.wc.setState('rightGhost', newValue);
                },
                enumerable: true
            }
        });

        // console.log('INIT STATE: ', this.state);

    },



    // =============================================================================================
    // =============================================================================================
    // =============================================================================================
    // =============================================================================================

    clearImgMems() {
        this.imgMems.forEach((mem,i) => {
            mem.st0.removeEventListener('load',(e) => this.stageLoaded(i, 0)); // обработчик загрузки нулевой стадии
            mem.st0.removeEventListener('error',(e) => this.stageLoadError(i, 0)); // обработчик ошибки загрузки нулевой стадии
            mem.st1.removeEventListener('load',(e) => this.stageLoaded(i, 1)); // обработчик загрузки первой стадии
            mem.st1.removeEventListener('error',(e) => this.stageLoadError(i, 1)); // обработчик ошибки загрузки первой стадии
            mem.st2.removeEventListener('load',(e) => this.stageLoaded(i, 2)); // обработчик загрузки второй стадии
            mem.st2.removeEventListener('error',(e) => this.stageLoadError(i, 2)); // обработчик ошибки загрузки второй стадии
        });
        this.imgMems = [];
    },

    openInLightbox(e, items) {
        this.clearImgMems();
        this.resetLightBoxParams();
        let curr = -1;
        items.forEach((item,i) => {
            let it = {};
            it.src = (new URL(item.src.split('?')[0], document.location)).href;
            if(it.src === e.target.src.split('?')[0]) curr = i;
            this.images.push(it);
        });
        //console.log('FROM LIGHTBOX: this.images: ',this.images,' target url: ',e.target.src.split('?')[0],' curr: ',curr);

        this.setStagesAndListeners({ i:curr, w:e.target.naturalWidth, h:e.target.naturalHeight });

        if (curr > -1) this.clickGalleryImage(curr);
    },

    setStagesAndListeners(targetDim = null) {
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
    },

    // componentDidMount() {
    //     this.setAreaParams();
    //     window.addEventListener('resize',this.resize);
    //     document.addEventListener('fullscreenchange',this.fullscreenChange);        
    // },

    // componentWillUnmount(){ //console.log('COMPONENT UNMOUNTED!');
    //     window.removeEventListener('resize',this.resize);
    //     document.removeEventListener('fullscreenchange',this.fullscreenChange);
    // },

    previewLoaded(e, i) {
        if(this.imgMems[i].currWidth === 0) {
            this.imgMems[i].currWidth = e.target.width;
            this.imgMems[i].currHeight = e.target.height;
            let gs = this.getGhosts();
            if(gs.left===i) this.setGhost('left');
            else if(gs.right===i) this.setGhost('right');
        }
    },

    stageLoaded(id, st) {
        let sr = st===0 ? this.imgMems[id].st0.src : 
                            st===1 ? this.imgMems[id].st1.src : 
                            this.imgMems[id].st2.src; // выбор источника в зависимости от стадии
        if (id === this.currImg) {
            this.state.imgSrc = sr; // если это стадия текущего изображения, она подставляется в виджет 
            // this.setState({ imgSrc: sr }); 
        } 
        this.state.preloaderOn = false;
        // this.setState({ preloaderOn:false });
    },

    lowerStage() {
        if(this.imgMems[this.currImg].st1.width!==0) this.state.imgSrc = this.imgMems[this.currImg].st1.src; // this.setState({ imgSrc: this.imgMems[this.currImg].st1.src });
        else if(this.imgMems[this.currImg].st0.width!==0) this.state.imgSrc = this.imgMems[this.currImg].st0.src; // this.setState({ imgSrc: this.imgMems[this.currImg].st0.src });
        else this.state.imgSrc = this.images[this.currImg].src; // this.setState({ imgSrc: this.images[this.currImg].src });
    },

    upperStage() {
        if(this.imgMems[this.currImg].st2.width!==0) this.state.imgSrc = this.imgMems[this.currImg].st2.src; // this.setState({ imgSrc: this.imgMems[this.currImg].st2.src });
        else this.loadStage2();
    },

    stageLoadError(id, st) {
        this.state.preloaderOn = false; // this.setState({ preloaderOn:false });
        console.log('Stage ',st,' is not loaded: ', id); 
        // image.src = this.g.imgEls[id].src;
    },

    resize() {
        if(!lb.fullscreen.dontHandleResize) {
            //console.log('RESIZE  HANDLED');
            lb.setAreaParams();
            lb.setSizeAndPosition();
            lb.setGhosts();
        }
        else { //console.log('RESIZE SKIPPED');
            lb.fullscreen.dontHandleResize = false;
        }
    },

    fullscreenChange() {
        if(!lb.fullscreen.dontHandleFullscreen) {
            lb.fullscreen.on = document.fullscreenElement ? true : false;
            //console.log('FULLSCREENCHANGE HANDLED');
            lb.setAreaParams();
            lb.setSizeAndPosition();
        }
        else { //console.log('FULLSCREENCHANGE SKIPPED');
            lb.fullscreen.dontHandleFullscreen = false;
        }
    },

    downOnCurtain(e) {  
        e.stopPropagation(); 
        e.preventDefault(); 
        this.mode.downOnCurtainFlag=true;
    },

    upOnCurtain(e) {
        e.preventDefault(); 
        if(this.mode.downOnCurtainFlag){
            this.mode.downOnCurtainFlag=false;
            this.closeLightbox(); 
        }
        
    },
 
    imgMousedown(e) { 
        e.stopPropagation(); 
        e.preventDefault(); 
        this.mode.downOnCurtainFlag=false;
        this.anim.on=false;
        this.mode.timer=setTimeout(()=>{
            if(Math.abs(this.anim.previous.x-this.anim.start.x)<=3&&Math.abs(this.anim.previous.y-this.anim.start.y)<=3)this.imgLongclick();
        },1000);
        if(this.mode.zoom){
            this.anim.start={x:e.clientX, y:e.clientY, zm:1 }; this.anim.previous=this.anim.start; this.anim.prePrevious=this.anim.start;
            window.addEventListener('mouseup', this.zmMouseUpAfterDrag );
            window.addEventListener('mousemove', this.zmDragOnMouseMove );
        }
        else {
            this.count.j=0;
            this.anim.start={x:e.clientX, y:e.clientY}; 
            this.anim.previous={x:this.anim.start.x, y:this.anim.start.y, ts:Date.now()}; 
            this.anim.prePrevious=this.anim.previous;
            window.addEventListener('mouseup', this.mouseUpAfterDrag );
            window.addEventListener('mousemove', this.dragOnMouseMove ); 
        }
    },

    zmMouseUpAfterDrag(e) {
        e.stopPropagation();
        clearTimeout(lb.mode.timer);
        if(e.target==lb.imgDOM){ 
            e.preventDefault();
            lb.anim.speed = (Date.now() - lb.anim.previous.ts) > 100 ? 
                {x:0,y:0} :
                {x:(lb.anim.previous.x-lb.anim.prePrevious.x)/3, y:(lb.anim.previous.y-lb.anim.prePrevious.y)/3};
            lb.anim.on=true; 
            lb.inertion();
        }
        window.removeEventListener('mousemove',lb.zmDragOnMouseMove);
        window.removeEventListener('mouseup',lb.zmMouseUpAfterDrag);
    },

    zmDragOnMouseMove(event) {
        event.preventDefault();
        var newCenterX=lb.img.center.x-lb.anim.previous.x+event.clientX;
        var newCenterY=lb.img.center.y-lb.anim.previous.y+event.clientY;;
        if(newCenterX-lb.img.z.w/2<lb.area.dragLimit.right&&newCenterX+lb.img.z.w/2>lb.area.dragLimit.left)
            lb.img.center.x-=lb.anim.previous.x-event.clientX;
        if(newCenterY-lb.img.z.h/2<lb.area.dragLimit.bottom&&newCenterY+lb.img.z.h/2>lb.area.dragLimit.top)
            lb.img.center.y-=lb.anim.previous.y-event.clientY;
        requestAnimationFrame(lb.setdom);
        lb.anim.prePrevious=lb.anim.previous; 
        lb.anim.previous={x:event.clientX, y:event.clientY, ts:Date.now()};
    },

    dragOnMouseMove(event) { 
        event.preventDefault();
        if(lb.mode.horizontal) {
            lb.img.center.x-=lb.anim.previous.x-event.clientX; 
            lb.leftGhost.pos.left-=lb.anim.previous.x-event.clientX;
            lb.rightGhost.pos.left-=lb.anim.previous.x-event.clientX;
        }
        else lb.img.center.y-=lb.anim.previous.y-event.clientY;
        requestAnimationFrame(lb.ssetdom);
        lb.count.j++;
        if(lb.count.j==2){
            if(Math.abs(lb.anim.prePrevious.x-event.clientX)>Math.abs(lb.anim.prePrevious.y-event.clientY)) lb.mode.horizontal=true;
            else  lb.mode.horizontal=false;
        }
        lb.anim.prePrevious=lb.anim.previous; 
        lb.anim.previous={x:event.clientX, y:event.clientY, ts:Date.now()};
    },

    mouseUpAfterDrag(e) { 
        e.stopPropagation();
        e.preventDefault();
        clearTimeout(lb.mode.timer);
        if(lb.img.center.x<lb.area.W/4)lb.moveTo('left');
        else if(lb.img.center.x>3*lb.area.W/4)lb.moveTo('right');
        else if(lb.img.center.y>3*lb.area.H/4)lb.moveTo('down');
        else if(lb.img.center.y<lb.area.H/4)lb.moveTo('up');
        else lb.moveTo('center');
        window.removeEventListener('mousemove',lb.dragOnMouseMove);
        window.removeEventListener('mouseup',lb.mouseUpAfterDrag);
    },

    imgLongclick() {
        if(this.touch.isTouchDevice) {
            let ctr = this.state.mode.touchControls;
            this.state.mode = { ...this.state.mode, touchControls: !ctr };
            // this.setState( { mode: { touchControls: !ctr } } );
        } 
        else {
            let ctr = this.state.mode.controls;
            this.state.mode = { ...this.state.mode, controls: !ctr };
            // this.setState( { mode: { controls: !ctr } } );
        }
    },

    mouseWheel(e) { 
        e.stopPropagation(); 
        //console.log('mousewheel: ',e);
        //e.preventDefault(); 
        this.mode.zoom=true;
        this.state.mode = { ...this.state.mode, controls: false };
        // this.setState( { mode: { controls: false } } );
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
    },

    handle(delta, event) { 
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
                lb.img.center.x+=speed.x; lb.img.center.y+=speed.y;
                lb.img.zm-=speed.zm;
                lb.setdom();
                //console.log('animation ',animId,' zm: ', lb.img.zm);
                if( i<zmAnimRes && lb.anim.on===true && lb.zoomAnim.id === animId ) requestAnimationFrame(animate);
            };
            animate();
        }
    },

    dblclick(e) {
        e.stopPropagation(); 
        e.preventDefault(); 
        this.mode.zoom=false;
        this.anim.on=false;
        let ctrl = this.touch.isTouchDevice ? false : true;
        this.state.mode = { ...this.state.mode, controls: ctrl };
        // this.setState({ mode: { controls: ctrl }});
        this.img.zm=1;
        this.img.center={x:this.area.W/2, y:this.area.H/2};
        this.img.z={w:this.img.startDim.w, h:this.img.startDim.h};
        this.setSizeAndPosition();
    },

    touchStart(e) { 
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
    },

    dragOnTouchMove(e) {
        if(lb.touch.mode==1){ 
            e.preventDefault();
            lb.touch1.pos={x:e.touches[0].clientX, y:e.touches[0].clientY};
            if(lb.mode.horizontal) { 
                lb.img.center.x-=lb.anim.previous.x-lb.touch1.pos.x;
                lb.leftGhost.pos.left-=lb.anim.previous.x-lb.touch1.pos.x;
                lb.rightGhost.pos.left-=lb.anim.previous.x-lb.touch1.pos.x;    
            }
            else lb.img.center.y-=lb.anim.previous.y-lb.touch1.pos.y;
            requestAnimationFrame(lb.ssetdom);
            lb.count.j++;
            if(lb.count.j==2){
                if(Math.abs(lb.anim.prePrevious.x-lb.touch1.pos.x)>Math.abs(lb.anim.prePrevious.y-lb.touch1.pos.y)) lb.mode.horizontal=true;
                else  lb.mode.horizontal=false;
            }
            lb.anim.prePrevious=lb.anim.previous; 
            lb.anim.previous={x:lb.touch1.pos.x, y:lb.touch1.pos.y, ts:Date.now()};
        }
    },

    touchUpAfterDrag(e) {
        if(lb.touch.mode==1){
          e.preventDefault();
          clearTimeout(lb.mode.timer);
          window.removeEventListener('touchmove',lb.dragOnTouchMove);
          window.removeEventListener('touchend',lb.touchUpAfterDrag);
          if(lb.itWasDoubleTap(e)){
            if(!lb.mode.zoom){
              lb.mode.zoom=true;
              lb.handle(1);
            }
          }
          else {
            if(lb.img.center.x<lb.area.W/4)lb.moveTo('left');
            else if(lb.img.center.x>3*lb.area.W/4)lb.moveTo('right');
            else if(lb.img.center.y>3*lb.area.H/4)lb.moveTo('down');
            else if(lb.img.center.y<lb.area.H/4)lb.moveTo('up');
            else lb.moveTo('center');
          }
          lb.touch.mode=0;
        }
    },

    zmDragOnTouchMove(e) {
        if(lb.touch.mode==2){
          e.preventDefault();
          var tch1=Array.from(e.touches).filter((item)=>{ return item.identifier==lb.touch1.id })[0];
          var tch2=Array.from(e.touches).filter((item)=>{ return item.identifier==lb.touch2.id })[0];
          lb.touch1.pos={x:tch1.clientX, y:tch1.clientY};
          lb.touch2.pos={x:tch2.clientX, y:tch2.clientY};
          lb.touchesMiddle.pos={ x:(lb.touch1.pos.x+lb.touch2.pos.x)/2, y:(lb.touch1.pos.y+lb.touch2.pos.y)/2 };
          lb.touchesMiddle.distance=Math.sqrt((lb.touch1.pos.x-lb.touch2.pos.x)*(lb.touch1.pos.x-lb.touch2.pos.x)+(lb.touch1.pos.y-lb.touch2.pos.y)*(lb.touch1.pos.y-lb.touch2.pos.y));
          //console.log(lb.touchesMiddle.distance/lb.touchesMiddle.startDistance);
          var zm=lb.img.zm;
          lb.img.zm=lb.touchesMiddle.startZm*lb.touchesMiddle.distance/lb.touchesMiddle.startDistance;

          if( lb.img.zm >3 ) lb.upperStage();
          else lb.lowerStage();

          // var eventPoint=lb.touch.isTouchDevice ? { x:lb.area.W/2, y:lb.area.H/2 } : { x:event.clientX, y:event.clientY }
            var targ={x:lb.touchesMiddle.pos.x-(lb.touchesMiddle.pos.x-lb.img.center.x)*lb.img.zm/zm, y:lb.touchesMiddle.pos.y-(lb.touchesMiddle.pos.y-lb.img.center.y)*lb.img.zm/zm};
          lb.img.center=targ;
          requestAnimationFrame(lb.setdom);
        }
        if(lb.touch.mode==1){ 
          e.preventDefault();
          lb.touch1.pos={x:e.touches[0].clientX, y:e.touches[0].clientY};
  
          var newCenterX=lb.img.center.x-lb.anim.previous.x+lb.touch1.pos.x;
          var newCenterY=lb.img.center.y-lb.anim.previous.y+lb.touch1.pos.y;;
          if(newCenterX-lb.img.z.w/2<lb.area.dragLimit.right&&newCenterX+lb.img.z.w/2>lb.area.dragLimit.left)
            lb.img.center.x-=lb.anim.previous.x-lb.touch1.pos.x;
          if(newCenterY-lb.img.z.h/2<lb.area.dragLimit.bottom&&newCenterY+lb.img.z.h/2>lb.area.dragLimit.top)
            lb.img.center.y-=lb.anim.previous.y-lb.touch1.pos.y;
  
          requestAnimationFrame(lb.setdom);
          lb.anim.prePrevious=lb.anim.previous; 
          lb.anim.previous={x:lb.touch1.pos.x, y:lb.touch1.pos.y, ts:Date.now()};
        }
    },
    
    zmTouchUpAfterDrag(e) { 
        if(lb.touch.mode==2){   
          if(Array.from(e.touches).filter((item)=>{ return item.identifier==lb.touch1.id }).length==0) {
            clearTimeout(lb.mode.timer);
            window.removeEventListener('touchmove',lb.zmDragOnTouchMove);
            window.removeEventListener('touchend',lb.zmTouchUpAfterDrag);
            lb.touch.mode=0;
          }
          else if(Array.from(e.touches).filter((item)=>{ return item.identifier==lb.touch2.id }).length==0) {
            lb.anim.previous={x:lb.touch1.pos.x, y:lb.touch1.pos.y, ts:Date.now()};
            lb.anim.prePrevious=lb.anim.previous;    
            lb.touch.mode=1;
          } 
        }
        else if(lb.touch.mode==1){
          if(lb.itWasDoubleTap(e)){
            if(lb.mode.zoom){
              lb.mode.zoom=false;
              if(lb.img.zm>3)lb.lowerStage();
              lb.img.zm=1;
              lb.img.center={x:lb.area.W/2, y:lb.area.H/2};
              lb.img.z={w:lb.img.startDim.w, h:lb.img.startDim.h};
              lb.anim.on=false;
            }
          }
          clearTimeout(lb.mode.timer);
          if(e.target==lb.imgDOM){
            e.preventDefault();
            lb.anim.speed = (Date.now() - lb.anim.previous.ts) > 100 || (Math.abs(lb.anim.previous.x-lb.anim.prePrevious.x) < 5 && Math.abs(lb.anim.previous.y-lb.anim.prePrevious.y) < 5) ? 
                {x:0, y:0} :
                {x:(lb.anim.previous.x-lb.anim.prePrevious.x)/2, y:(lb.anim.previous.y-lb.anim.prePrevious.y)/2};
            lb.anim.on=true; 
            lb.inertion();
          }
          window.removeEventListener('touchmove',lb.zmDragOnTouchMove);
          window.removeEventListener('touchend',lb.zmTouchUpAfterDrag);
  
  
          lb.touch.mode=0;
        }
    },

    itWasDoubleTap(e) {
        //if there are touches but no first touch between them 
        // if(this.touch.mode!=0&&Array.from(e.touches).filter((item)=>{ return item.identifier==this.touch1.id }).length==0) {
        //  this.anim.on=false; //stop animation
        
        // if if was a tap?
        let wft = false;
        if(Date.now()-this.touch1.t<200&&Math.abs(this.touch1.pos.x-e.changedTouches[0].clientX)<5&&Math.abs(this.touch1.pos.y-e.changedTouches[0].clientY)<5){
        if(Date.now()-this.touch1.prevtap.t<400&&Math.abs(this.touch1.prevtap.pos.x-e.changedTouches[0].clientX)<10&&Math.abs(this.touch1.prevtap.pos.y-e.changedTouches[0].clientY)<10){
            if(this.timout!=-1)window.clearTimeout(this.timout);
            wft = true; //console.log('DOUBLETAP');
        }
        else {
            this.timout=window.setTimeout(()=>{
            //console.log('TAP'); code for single tap here
            this.timout=-1;
            },300);
        } 
        this.touch1.prevtap.pos={ x:this.touch1.pos.x, y:this.touch1.pos.y };
        this.touch1.prevtap.t=this.touch1.t;
        }
        return wft;
    },

    ctrlZm(e, delta) {
        e.stopPropagation();
        this.mode.zoom=true;
        this.handle(delta);
    },
  

    loadStage2() {
        if(this.imgMems[this.currImg].st2.width==0) { 
            //console.log('ST2 loading...');
            this.state.preloaderOn = true;
            // this.setState({ preloaderOn:true });
            this.imgMems[this.currImg].st2.src = this.getStageUrls(this.currImg).st2; // попытка скачать стадию 2, в случае успеха работает обработчик stageLoaded
        }
    },
    
    getStageUrls(i) {
        // let tempUrl = this.props.images[this.currImg].src;
        let tempUrl = this.images[i].src;
        let st0 = tempUrl.substring(0, tempUrl.lastIndexOf("."))+'.st0'+tempUrl.substring(tempUrl.lastIndexOf("."),tempUrl.length);
        let st1 = tempUrl.substring(0, tempUrl.lastIndexOf("."))+'.st1'+tempUrl.substring(tempUrl.lastIndexOf("."),tempUrl.length);
        let st2 = tempUrl.substring(0, tempUrl.lastIndexOf("."))+'.st2'+tempUrl.substring(tempUrl.lastIndexOf("."),tempUrl.length);
        return { st0: st0, st1: st1, st2: st2 };
    },

    setAreaParams(forFullscreen = false) {
        this.area.W = forFullscreen ? window.screen.width : Math.max(document.documentElement.clientWidth, window.innerWidth || 0); 
        this.area.H = forFullscreen ? window.screen.height : Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.area.ar = this.touch.isTouchDevice ? this.area.W/this.area.H : (this.area.W-200)/(this.area.H-200);
        this.area.dragLimit = { 
            top: this.touch.isTouchDevice ? this.area.H/2 : 50, 
            right: this.touch.isTouchDevice ? this.area.W/2 : this.area.W-50,
            bottom: this.touch.isTouchDevice ? this.area.H/2 : this.area.H-50, 
            left: this.touch.isTouchDevice ? this.area.W/2 : 50 
        }      
    },

    resetLightBoxParams() { // обнуление  всех параметров лайтбокса
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
        this.currImg = -1;

        this.state.showFull = false;
        this.state.preloaderOn = false;
        this.state.img = { z:{w:0,h:0}, pos:{left:0, top:0} };
        this.state.mode = { controls:true, touchControls:true };
        // this.setState({
        //     showFull:false,
        //     preloaderOn:false,
        //     img: { z:{w:0,h:0}, pos:{left:0, top:0} },
        //     mode: { controls:true, touchControls:true }
        // });

        this.mode = { zoom:false, horizontal:true, downOnCurtainFlag:false };
        this.count = { tick:0, j:0 };
        this.curtainOpacity = CURTAIN_OPACITY;  
    },


    flushLightBoxParams() { // обнуление оперативных параметров лайтбокса
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
        this.currImg = -1;

        this.state.showFull = false;
        this.state.preloaderOn = false;
        this.state.img = { z:{w:0,h:0}, pos:{left:0, top:0} };
        this.state.mode = { controls:true, touchControls:true };
        // this.setState({
        //     showFull:false,
        //     preloaderOn:false,
        //     img: { z:{w:0,h:0}, pos:{left:0, top:0} },
        //     mode: { controls:true, touchControls:true }
        // });
    },

    countSizeAndPosition() { 
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
        this.state.mode = { ...this.state.mode, controls: ctrl };
        //this.setState({ mode: { controls: ctrl }});
    },

    setSizeAndPosition() { 
        this.countSizeAndPosition();
        this.setdom();
    },

    openWidget: async function(i) {
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

        // this.setState({ showFull:true }); 
        this.state.showFull = true; // show the whole thing
    },

    getGhosts() {
        let currImg = this.currImg;
        let imgsNum = this.imgMems.length;
        let leftGhostImg = 0, rightGhostImg = 0;
        if(imgsNum > 1) {
            if(currImg===0) { leftGhostImg = imgsNum-1; rightGhostImg = currImg+1; }
            else if(currImg===imgsNum-1) { leftGhostImg = currImg-1; rightGhostImg = 0; }
            else { leftGhostImg = currImg-1; rightGhostImg = currImg+1; }
        }
        return { left:leftGhostImg, right:rightGhostImg };
    },

    setGhost(side = 'left') {
        let g = this.getGhosts();
        if(side==='left'){
            let sp = this.ghostSizeAndPosition(g.left, 'left');
            this.leftGhost = { src: this.imgMems[g.left].preview.src, z:{w:sp.z.w,h:sp.z.h}, pos:{left:sp.pos.left,top:sp.pos.top} };
            this.state.leftGhost = { src: this.imgMems[g.left].preview.src, z:{w:sp.z.w,h:sp.z.h}, pos:{left:sp.pos.left,top:sp.pos.top} };
            // this.setState({ leftGhost: { src: this.imgMems[g.left].preview.src, z:{w:sp.z.w,h:sp.z.h}, pos:{left:sp.pos.left,top:sp.pos.top} } });
        }
        else if (side==='right') {
            let sp = this.ghostSizeAndPosition(g.right, 'right');
            this.rightGhost = { src: this.imgMems[g.right].preview.src, z:{w:sp.z.w,h:sp.z.h}, pos:{left:sp.pos.left,top:sp.pos.top} };
            this.state.rightGhost = { src: this.imgMems[g.right].preview.src, z:{w:sp.z.w,h:sp.z.h}, pos:{left:sp.pos.left,top:sp.pos.top} };
            // this.setState({ rightGhost: { src: this.imgMems[g.right].preview.src, z:{w:sp.z.w,h:sp.z.h}, pos:{left:sp.pos.left,top:sp.pos.top} } });
        }   
    },

    setGhosts() {
        this.setGhost('left');
        this.setGhost('right');
    },

    ghostSizeAndPosition(n, side = 'left') {
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
    },

    // set image i as current and read real image dimension
    // setImage: async function(i) {
    setImage(i) {
        this.currImg =i;
        this.state.imgSrc = this.imgMems[i].preview.src;
        // await this.setState({ imgSrc: this.imgMems[i].preview.src }); //console.log('this.currImg: ', this.currImg); 
        let w = this.imgMems[i].currWidth;
        this.img.realDim = { w: w, h: this.imgMems[i].currHeight };
        this.setSizeAndPosition();
        this.getInitialStages(i);
        setTimeout(()=>{ this.setGhosts(); },100);
    },

    getInitialStages(i=-1) {
        let cI = i===-1 ? this.currImg : i;
        let stage = this.getStageUrls(cI);
        //console.log("setImage CTRLS1: ", this.state.mode.controls);
        this.state.preloaderOn = true;
        // this.setState({ preloaderOn:true });
        this.imgMems[cI].st0.src = stage.st0; // попытка скачать стадию 0, в случае успеха работает обработчик stageLoaded
        this.imgMems[cI].st1.src = stage.st1; // попытка скачать стадию 1, в случае успеха работает обработчик stageLoaded
        //console.log("setImage CTRLS2: ", this.state.mode.controls);
    },

    setImage_: async (i) => {
        this.flushLightBoxParams();
        this.currImg = i;
        let w = this.imgMems[i].currWidth; 
        this.img.realDim = { w: w, h: this.imgMems[i].currHeight };
        document.body.classList.add('class-for-finally-lightbox');
        this.setSizeAndPosition();
        this.state.showFull = true;        
        // this.setState({ showFull:true });

        let stage = this.getStageUrls(this.currImg);

        //console.log('ST0 loading...');
        //console.log("setImage CTRLS1: ", this.state.mode.controls);
        this.state.preloaderOn = true;
        //this.setState({ preloaderOn:true });
        this.imgMems[this.currImg].st0.src = stage.st0; // попытка скачать стадию 0, в случае успеха работает обработчик stageLoaded
        //console.log('ST1 loading...');
        this.imgMems[this.currImg].st1.src = stage.st1; // попытка скачать стадию 1, в случае успеха работает обработчик stageLoaded
        //console.log("setImage CTRLS2: ", this.state.mode.controls);
    },

    clickGalleryImage: async function(id) {
        await this.openWidget(id);
    },

    getCurrImg() {
        // return this.props.images[this.currImg];
        return this.images[this.currImg];
    },

    moveTo(direction, numberOfSteps=10) {
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
            //let c=lb.slowDown(i,numberOfSteps);
            lb.img.center.x+=lb.anim.speed.x; lb.img.center.y+=lb.anim.speed.y;
            // lb.leftGhost.pos.left+=lb.anim.speed.x; lb.rightGhost.pos.left+=lb.anim.speed.x;
            lb.leftGhost.pos.left+=leftGhostSpeed.x; 
            lb.rightGhost.pos.left+=rightGhostSpeed.x;

            lb.ssetdom();
            i++;
            if(lb.anim.on){
                if(i<numberOfSteps)requestAnimationFrame(moveit);
                else {
                    lb.anim.on=false;
                    if(direction=='up'||direction=='down')lb.closeLightbox();
                    else if(direction!='center') { 
                        if(direction=='right') {
                            // let ci = lb.currImg==0 ? lb.props.images.length-1 : lb.currImg-1;
                            let ci = lb.currImg==0 ? lb.images.length-1 : lb.currImg-1;
                            lb.setImage(ci);
                        } 
                        if(direction=='left') {
                            // let ci = lb.currImg==lb.props.images.length-1 ? 0 : lb.currImg+1;
                            let ci = lb.currImg==lb.images.length-1 ? 0 : lb.currImg+1;
                            lb.setImage(ci);
                        }
                    }
                }
            }
        }
        requestAnimationFrame(moveit);	
    },

    inertion() {
        lb.img.center.x+=lb.anim.speed.x; lb.img.center.y+=lb.anim.speed.y;
        lb.setdom();
        if(lb.anim.on){
            if(lb.img.center.x+lb.img.z.w/2<lb.area.dragLimit.left||lb.img.center.x-lb.img.z.w/2>lb.area.dragLimit.right){ lb.anim.speed.x=-lb.anim.speed.x; lb.inertionStop(); }
            else if (lb.img.center.y+lb.img.z.h/2<lb.area.dragLimit.top||lb.img.center.y-lb.img.z.h/2>lb.area.dragLimit.bottom){ lb.anim.speed.y=-lb.anim.speed.y; lb.inertionStop(); }
            else requestAnimationFrame(lb.inertion); 
        }
    },

    inertionStop(numberOfSteps=60) {
        var i=0;
        var moveit=()=>{
            let c=lb.slowDown(i,numberOfSteps);
            lb.img.center.x+=lb.anim.speed.x*c; lb.img.center.y+=lb.anim.speed.y*c;
            lb.setdom();
            i++;
            if(lb.img.center.x+lb.img.z.w/2<lb.area.dragLimit.left||lb.img.center.x-lb.img.z.w/2>lb.area.dragLimit.right) lb.anim.speed.x=-lb.anim.speed.x;
            if(lb.img.center.y+lb.img.z.h/2<lb.area.dragLimit.top||lb.img.center.y-lb.img.z.h/2>lb.area.dragLimit.bottom) lb.anim.speed.y=-lb.anim.speed.y;
            if(lb.anim.on){
                if(i<numberOfSteps)requestAnimationFrame(moveit);
                else lb.anim.on=false;
            }
        }
        moveit();
    },

    slowDown(step,numberOfSteps=60) {
        let x=step*2.5/numberOfSteps;
        return 2/(2*x+1.5)-0.3;
    },

    setdom() {
        lb.img.z = { w: lb.img.startDim.w * lb.img.zm, h: lb.img.startDim.h * lb.img.zm }; 
        lb.img.pos = { left: lb.img.center.x - lb.img.z.w/2, top: lb.img.center.y - lb.img.z.h/2 };
        lb.state.img = { z: {w: lb.img.z.w, h: lb.img.z.h }, pos: { left: lb.img.pos.left, top: lb.img.pos.top } };
        // this.setState({
        //     img: { z: {w: this.img.z.w, h: this.img.z.h }, pos: { left: this.img.pos.left, top: this.img.pos.top } }
        // });
    },

    ssetdom() { 
        lb.img.pos={left:lb.img.center.x-lb.img.z.w/2, top:lb.img.center.y-lb.img.z.h/2};
        lb.state.img = { z: {w: lb.img.z.w, h: lb.img.z.h }, pos: { left: lb.img.pos.left, top: lb.img.pos.top } };
        // this.setState({
        //     img: { z: {w: this.img.z.w, h: this.img.z.h }, pos: { left: this.img.pos.left, top: this.img.pos.top } }
        // });
        lb.state.leftGhost = { ...lb.state.leftGhost, pos:lb.leftGhost.pos };
        // this.setState({ leftGhost: { ...this.state.leftGhost, pos:this.leftGhost.pos } });
        lb.state.rightGhost = { ...lb.state.rightGhost, pos:lb.rightGhost.pos };
        //this.setState({ rightGhost: { ...this.state.rightGhost, pos:this.rightGhost.pos } });
        lb.curtainOpacity=CURTAIN_OPACITY*(4*Math.max(Math.min(lb.img.center.y,lb.area.H/2),lb.area.H/4)/lb.area.H-1)*(3-4*Math.max(Math.min(lb.img.center.y,3*lb.area.H/4),lb.area.H/2)/lb.area.H);
    },

    toggleControlsTouch() {
        let ctr = this.state.mode.touchControls;
        this.state.mode = { ...this.state.mode, touchControls: !ctr };
        // this.setState( { mode: { touchControls: !ctr }} );
    }

}

export default lb;
