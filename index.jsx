import { useEffect, useState, createRef } from 'react';
import './style.css';
import SVG from './svgs';
import lb from './lb';

const Lightbox = ({lightboxReference}) => {
    const stateCtrl = {
        setState(name,value){
            switch(name) {
                case 'showFull':
                    setShowFull(value)
                break;
                case 'preloaderOn':
                    setPreloaderOn(value)
                break;
                case 'img':
                    setImg(value)
                break;

                case 'mode':
                    setMode(value)
                break;

                case 'imgSrc':
                    setImgSrc(value)
                break;
                case 'leftGhost':
                    setLeftGhost(value)
                break;
                case 'rightGhost':
                    setRightGhost(value)
                break;
            }
        }
    };
    
    const [showFull, setShowFull] = useState(false);
    const [preloaderOn, setPreloaderOn] = useState(false);
    const [img, setImg] = useState( { z:{w:0,h:0}, pos:{left:0, top:0} } );
    const [mode, setMode] = useState( { controls:true, touchControls:false } );
    const [imgSrc, setImgSrc] = useState(SVG.loading);
    const [leftGhost, setLeftGhost] = useState( { src:'', z:{w:100,h:100}, pos:{left:0,top:0} } );
    const [rightGhost, setRightGhost] = useState( { src:'', z:{w:0,h:0}, pos:{left:0,top:0} } );

    const imgDOM = createRef();
    const widgetBlock = createRef();

    useEffect(() => {
        lb.init(imgDOM.current, widgetBlock.current, stateCtrl);
        lb.setAreaParams();
        window.addEventListener('resize',lb.resize);
        document.addEventListener('fullscreenchange',lb.fullscreenChange);
        return () => {
            window.removeEventListener('resize',lb.resize);
            document.removeEventListener('fullscreenchange',lb.fullscreenChange);    
        }      
    }, []);


    const [n, setN] = useState(0); // --------------------- 

    const openInLightbox = (e,items) => {
        lb.openInLightbox(e, items);
    }
    lightboxReference.current.openInLightbox = openInLightbox;

    // ==============  TEMPLATE ==============  

    let controls = !mode.controls ? '' :
    <div className="controls">
        <div className="button_previous" onMouseUp={ e=>lb.prevImage(e) }><img src={SVG.previousArrow} /></div>
        <div className="button_next" onMouseUp={ e=>lb.nextImage(e) } ><img src={SVG.nextArrow} /></div>
        <div className="button_close" 
            onMouseUp={e=>lb.closeLightbox(e)}
        >
            <img src={SVG.closeCross} />
        </div>
    </div>;

    let controlsTouch = !(lb.touch.isTouchDevice&&mode.touchControls) ? '' :
    <div className="touch_controls">
        <div className="touch_control button_zoomplus" 
            onTouchStart = { (e)=>{ e.stopPropagation(); } }
            onTouchEnd = { (e)=>{ e.stopPropagation(); } }
            onTouchMove = { (e)=>{ e.stopPropagation(); } }
            onClick = { (e)=>{ e.stopPropagation(); lb.ctrlZm(e,1); } }
        >
            <img src={SVG.zoomPlusTouch} />
        </div>
        <div className="touch_control button_zoomminus" 
            onTouchStart = { (e)=>{ e.stopPropagation(); } }
            onTouchEnd = { (e)=>{ e.stopPropagation(); } }
            onTouchMove = { (e)=>{ e.stopPropagation(); } }
            onClick = { (e)=>{ e.stopPropagation(); lb.ctrlZm(e,-1); } }
        >
            <img src={SVG.zoomMinusTouch} />
        </div>
        <div className="touch_control button_previous" 
            onTouchStart = { (e)=>{ e.stopPropagation(); } }
            onTouchEnd = { (e)=>{ e.stopPropagation(); } }
            onTouchMove = { (e)=>{ e.stopPropagation(); } }            
            onClick = { (e) =>{ e.stopPropagation(); lb.prevImage(); }}
        >
            <img src={SVG.previousArrowTouch} />
        </div>
        <div className="touch_control button_next" 
            onTouchStart = { (e)=>{ e.stopPropagation(); } }
            onTouchEnd = { (e)=>{ e.stopPropagation(); } }
            onTouchMove = { (e)=>{ e.stopPropagation(); } }
            onClick={ (e) =>{ e.stopPropagation(); lb.nextImage(); }}
        >
            <img src={SVG.nextArrowTouche} />
        </div>
        <div className="touch_control button_close" 
            onTouchStart = { (e)=>{ e.stopPropagation(); } }
            onTouchEnd = { (e)=>{ e.stopPropagation(); } }
            onTouchMove = { (e)=>{ e.stopPropagation(); } }
            onClick = { (e)=>{ e.stopPropagation(); lb.closeLightbox(); } }
        >
            <img src={SVG.closeCrossTouch} />
        </div>
    </div>;

    let controlsTouchButton = !lb.touch.isTouchDevice ? '' :
    <div className="touch_control_button"
            onTouchStart = { (e)=>{ e.stopPropagation(); } }
            onTouchEnd = { (e)=>{ e.stopPropagation(); } }
            onTouchMove = { (e)=>{ e.stopPropagation(); } }
            onClick = { (e)=>{ e.stopPropagation(); lb.toggleControlsTouch(); } }        
    >
        <img src={SVG.toggleTouchControls} />
    </div>;

    let preloader = 
    <div className={ preloaderOn ? 'preloader' : 'preloader hidden' }>
        Loading next stage...
    </div>;

    let info = 
    <div className='preloader'>
        W:{ img.z.w }   H: { img.z.h }
    </div>;


    return(
        <>
        {/* <div>weraa{lb.ololo}, state n: {n}</div> */}
        <div ref={ widgetBlock } className={ showFull ? 'finally-lightbox-widget-block' : 'finally-lightbox-widget-block hidden'} 
            style={{ backgroundColor: 'rgba(0,0,0,'+lb.curtainOpacity+')' }}
            onTouchStart={ (e) => { e.preventDefault(); } }
        >
            <div className="lightbox_wrapper" onMouseDown={e=>lb.downOnCurtain(e)} onMouseUp={e=>lb.upOnCurtain(e)}  >
                    <div className="lightbox">
                        <img ref={imgDOM} 
                            // style={{ width: this.state.img.z.w, height: this.state.img.z.h, top: this.state.img.pos.top, left: this.state.img.pos.left }}
                            style={{ 
                                width: img.z.w, 
                                height: img.z.h,
                                // top: 0, 
                                // left: 0,
                                // transform: `translate(${this.state.img.pos.left}px, ${this.state.img.pos.top}px) scale(${this.img.zm})`
                                transform: `translate(${ img.pos.left }px, ${ img.pos.top }px)` 
                            }}
                            
                            // src={ typeof this.props.images[this.state.currImg] === 'undefined' ? SVG.loading : this.props.images[this.state.currImg].src  }
                            // src={ typeof this.images[this.state.currImg] === 'undefined' ? SVG.loading : this.images[this.state.currImg].src  }
                            src={ imgSrc  }    
                            onMouseDown={ e=>lb.imgMousedown(e) }
                            onTouchStart={ e=>lb.touchStart(e) }
                            onWheel={ e=>lb.mouseWheel(e) }
                            onDoubleClick={ e=>lb.dblclick(e) }
                        />
                        {   !lb.mode.zoom &&
                            <>
                            <img className='left_ghost'
                                style={{ 
                                    width: leftGhost.z.w,
                                    height: leftGhost.z.h,
                                    transform: `translate(${ leftGhost.pos.left }px, ${ leftGhost.pos.top }px)` 
                                }}
                                src={ leftGhost.src }    
                            />
                            <img className='righ_ghost'
                                style={{ 
                                    width:  rightGhost.z.w, 
                                    height:  rightGhost.z.h,
                                    transform: `translate(${ rightGhost.pos.left }px, ${ rightGhost.pos.top }px)`
                                }}
                                src={ rightGhost.src }    
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


export default Lightbox;