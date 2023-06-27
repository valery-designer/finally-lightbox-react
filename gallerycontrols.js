export default {
    nextImage() {
        let currIm = this.currImg;
        if(currIm<this.images.length-1) this.setImage(currIm+1);
    },
    prevImage() {
        let currIm = this.currImg;
        if(currIm>0) this.setImage(currIm-1);
    },
    closeLightbox: async function() { 
        document.body.classList.remove('class-for-finally-lightbox');
        if (this.fullscreen.on) {
            this.fullscreen.dontHandleResize = true;
            await document.exitFullscreen();
        } 
        this.state.showFull = false;
        // this.setState( {showFull: false} ); 
    }
}