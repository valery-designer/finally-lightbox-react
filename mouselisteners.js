function mouseListeners(){
    return {
        zmMouseUpAfterDrag: (e) => {
			clearTimeout(this.mode.timer);
			if(e.target==this.$refs.img){
				e.preventDefault();
				this.anim.speed={x:(this.anim.previous.x-this.anim.prePrevious.x)/3, y:(this.anim.previous.y-this.anim.prePrevious.y)/3};
				this.anim.on=true; 
				this.inertion();
			}
			window.removeEventListener('mousemove',this.zmDragOnMouseMove);
			window.removeEventListener('mouseup',this.zmMouseUpAfterDrag);
		},
        zmDragOnMouseMove(event){
			event.preventDefault();
            var newCenterX=this.img.center.x-this.anim.previous.x+event.clientX;
            var newCenterY=this.img.center.y-this.anim.previous.y+event.clientY;;
            if(newCenterX-this.img.z.w/2<this.area.dragLimit.right&&newCenterX+this.img.z.w/2>this.area.dragLimit.left)
                this.img.center.x-=this.anim.previous.x-event.clientX;
            if(newCenterY-this.img.z.h/2<this.area.dragLimit.bottom&&newCenterY+this.img.z.h/2>this.area.dragLimit.top)
                this.img.center.y-=this.anim.previous.y-event.clientY;
            requestAnimationFrame(this.render);
            this.anim.prePrevious=this.anim.previous; 
            this.anim.previous={x:event.clientX, y:event.clientY};
		},

		dragOnMouseMove: (event) => { 
			event.preventDefault();
			if(this.mode.horizontal)this.img.center.x-=this.anim.previous.x-event.clientX;
			else this.img.center.y-=this.anim.previous.y-event.clientY;
			requestAnimationFrame(this.sRender);
			this.count.j++;
			if(this.count.j==2){
				if(Math.abs(this.anim.prePrevious.x-event.clientX)>Math.abs(this.anim.prePrevious.y-event.clientY)) this.mode.horizontal=true;
				else  this.mode.horizontal=false;
			}
			this.anim.prePrevious=this.anim.previous; 
			this.anim.previous={x:event.clientX, y:event.clientY};
		},
        mouseUpAfterDrag(e){ 
			e.preventDefault();
			clearTimeout(this.mode.timer);
			if(this.img.center.x<this.area.W/4)this.moveTo('left');
			else if(this.img.center.x>3*this.area.W/4)this.moveTo('right');
			else if(this.img.center.y>3*this.area.H/4)this.moveTo('down');
			else if(this.img.center.y<this.area.H/4)this.moveTo('up');
			else this.moveTo('center');
			window.removeEventListener('mousemove',this.dragOnMouseMove);
			window.removeEventListener('mouseup',this.mouseUpAfterDrag);
		},

    }
}