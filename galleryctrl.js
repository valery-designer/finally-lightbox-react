function galleryCtrl () {
    return {
        nextImage:()=>{
            let currIm = this.state.currImg;
            // if(currIm<this.props.images.length-1) this.setImage(currIm+1);
            if(currIm<this.images.length-1) this.setImage(currIm+1);

        },
        prevImage:()=>{
            let currIm = this.state.currImg;
            if(currIm>0) this.setImage(currIm-1);
        },
        closeLightbox: async () => {
            document.body.classList.remove('class-for-finally-lightbox');
            if (this.fullscreen.on) {
                this.fullscreen.dontHandleResize = true;
                await document.exitFullscreen();
            } 
            this.setState( {showFull: false} ); 
        }
    
    }
}

export default galleryCtrl;