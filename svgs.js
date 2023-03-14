const SVG = {
    loading: `
    data:image/svg+xml;utf8,
    <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
    viewBox='0 0 1000 1000' style='enable-background:new 0 0 1000 1000;' xml:space='preserve'>
    <style type='text/css'>
    .st0{opacity:0.58;fill:%23FFFFFE;}
    .st1{fill:%23464646;}
    </style>
    <circle class='st0' cx='499.6' cy='505.7' r='70.8'/>
    <path class='st1' d='M547,465.7c-0.8-0.3-1.7-0.1-2.2,0.4l-8.6,8.6c-9-10.7-22.4-17-36.5-17c-26.4,0-47.9,21.5-47.9,47.9
    c0,26.4,21.5,47.9,47.9,47.9c19.5,0,36.9-11.7,44.3-29.7c1.6-4-0.3-8.5-4.2-10.1c-4-1.6-8.5,0.3-10.1,4.2c-5,12.2-16.8,20.1-30,20.1
    c-17.9,0-32.4-14.5-32.4-32.4c0-17.9,14.5-32.4,32.4-32.4c10,0,19.4,4.6,25.6,12.5L515,495.9c-0.6,0.6-0.8,1.5-0.4,2.2
    c0.3,0.8,1.1,1.3,1.9,1.3h29.7c1.1,0,2.1-0.9,2.1-2.1v-29.7C548.3,466.8,547.8,466,547,465.7z'/>
    </svg>
   `,
    notFound: `
    data:image/svg+xml;utf8,
    <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
    viewBox='0 0 75 55' style='enable-background:new 0 0 75 55;' xml:space='preserve'>
    <style type='text/css'>
    .st0{fill-rule:evenodd;clip-rule:evenodd;fill:%23424242;}
    .st1{fill:%23FFFFFF;}
    </style>
    <path class='st0' d='M68.2,52H6.8C4.7,52,3,50.3,3,48.2V6.8C3,4.7,4.7,3,6.8,3h61.5C70.3,3,72,4.7,72,6.8v41.5
    C72,50.3,70.3,52,68.2,52z'/>
    <g>
    <path class='st1' d='M29.9,33.2v2.4h-3.1v-2.4h-7v-2.5L25.1,19h3.3l-5.2,11.5h3.5v-4.8h3.1v4.8h1.4v2.8H29.9z'/>
    <path class='st1' d='M43.6,31.3c0,0.8-0.2,1.4-0.5,2s-0.7,1-1.2,1.4c-0.5,0.4-1.1,0.6-1.7,0.8c-0.6,0.2-1.2,0.3-1.8,0.3
        c-0.6,0-1.2-0.1-1.8-0.3c-0.6-0.2-1.2-0.4-1.7-0.8c-0.5-0.4-0.9-0.8-1.2-1.4s-0.5-1.2-0.5-2v-8c0-0.8,0.2-1.4,0.5-2
        c0.3-0.6,0.7-1,1.2-1.4c0.5-0.4,1.1-0.6,1.7-0.8c0.6-0.2,1.2-0.3,1.8-0.3c0.6,0,1.2,0.1,1.8,0.3c0.6,0.2,1.2,0.5,1.7,0.8
        c0.5,0.4,0.9,0.8,1.2,1.4c0.3,0.6,0.5,1.2,0.5,2V31.3z M40.5,23.9c0-0.4-0.1-0.7-0.2-1c-0.1-0.3-0.3-0.5-0.5-0.7
        c-0.2-0.2-0.4-0.3-0.7-0.4s-0.5-0.1-0.8-0.1c-0.2,0-0.5,0-0.8,0.1s-0.5,0.2-0.7,0.4c-0.2,0.2-0.4,0.4-0.5,0.7
        c-0.1,0.3-0.2,0.6-0.2,1v6.8c0,0.4,0.1,0.7,0.2,1c0.1,0.3,0.3,0.5,0.5,0.7c0.2,0.2,0.4,0.3,0.7,0.4c0.3,0.1,0.5,0.1,0.8,0.1
        c0.3,0,0.5,0,0.8-0.1c0.3-0.1,0.5-0.2,0.7-0.4c0.2-0.2,0.4-0.4,0.5-0.7c0.1-0.3,0.2-0.6,0.2-1V23.9z'/>
    <path class='st1' d='M55.6,33.2v2.4h-3.1v-2.4h-7v-2.5L50.9,19h3.3L49,30.5h3.5v-4.8h3.1v4.8H57v2.8H55.6z'/>
    </g>
    </svg>
    `,
    closeCross: `
    data:image/svg+xml;utf8,
    <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
    viewBox='0 0 50 50' style='enable-background:new 0 0 50 50;' xml:space='preserve'>
    <style type='text/css'>
    .st0{fill:rgba(0,0,0,0.5);}
    .st1{fill:none;stroke:%23FFFFFF;stroke-width:4;stroke-linecap:round;stroke-miterlimit:10;}
    </style>
    <circle class='st0' cx='25' cy='25' r='22.6'/>
    <line class='st1' x1='14.6' y1='14.6' x2='35.4' y2='35.4'/>
    <line class='st1' x1='35.4' y1='14.6' x2='14.6' y2='35.4'/>
    </svg>    
    `,
    closeCrossTouch: `
    data:image/svg+xml;utf8,
    <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
    viewBox='0 0 40 40' style='enable-background:new 0 0 40 40;' xml:space='preserve'>
    <style type='text/css'>
    .st0{fill:none;stroke:%23FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;}
    </style>
    <line class='st0' x1='7.8' y1='7.8' x2='32.2' y2='32.2'/>
    <line class='st0' x1='32.2' y1='7.8' x2='7.8' y2='32.2'/>
    </svg>
    `,
    nextArrow: `
    data:image/svg+xml;utf8,
    <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
         width='40px' height='40px' viewBox='0 0 50 50' enable-background='new 0 0 50 50' xml:space='preserve'>
    <circle fill='rgba(0,0,0,0.5)' cx='25' cy='25' r='22.58'/>
    <polyline fill='none' stroke='%23FFFFFF' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' points='
        21.615,12.563 31.037,25 21.641,37.396 '/>
    </svg>
    `,
    nextArrowTouche: `
    data:image/svg+xml;utf8,
    <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
    viewBox='0 0 40 40' style='enable-background:new 0 0 40 40;' xml:space='preserve'>
    <style type='text/css'>
    .st0{fill:none;stroke:%23FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;}
    </style>
    <polyline class='st0' points='13.9,7.8 26.1,20 13.9,32.2 '/>
    </svg>
    `,
    previousArrow: `
    data:image/svg+xml;utf8,
    <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
        width='40px' height='40px' viewBox='0 0 50 50' enable-background='new 0 0 50 50' xml:space='preserve'>
    <circle fill='rgba(0,0,0,0.5)' cx='25' cy='25' r='22.58'/>
    <polyline fill='none' stroke='%23FFFFFF' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' points='
    28.711,12.563 19.289,25 28.686,37.396 '/>
    </svg>
    `,
    previousArrowTouch: `
    data:image/svg+xml;utf8,
    <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
    viewBox='0 0 40 40' style='enable-background:new 0 0 40 40;' xml:space='preserve'>
    <style type='text/css'>
    .st0{fill:none;stroke:%23FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;}
    </style>
    <polyline class='st0' points='26.1,32.2 13.9,20 26.1,7.8 '/>
    </svg>
    `,
    zoomMinusTouch: `
    data:image/svg+xml;utf8,
    <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
        viewBox='0 0 40 40' style='enable-background:new 0 0 40 40;' xml:space='preserve'>
    <style type='text/css'>
    .st0{fill:none;stroke:%23FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;}
    </style>
    <line class='st0' x1='10.3' y1='20' x2='29.7' y2='20'/>
    </svg>
    `,
    zoomPlusTouch: `
    data:image/svg+xml;utf8,
    <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
        viewBox='0 0 40 40' style='enable-background:new 0 0 40 40;' xml:space='preserve'>
    <style type='text/css'>
    .st0{fill:none;stroke:%23FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;}
    </style>
    <line class='st0' x1='7.9' y1='20' x2='32.1' y2='20'/>
    <line class='st0' x1='20' y1='7.9' x2='20' y2='32.1'/>
    </svg>
    `,
    toggleTouchControls: `
    data:image/svg+xml;utf8,
    <svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
        viewBox='0 0 40 30' style='enable-background:new 0 0 40 30;' xml:space='preserve'>
    <style type='text/css'>
        .st0{fill:none;stroke:%23FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;}
    </style>
    <path class='st0' d='M14,15.9l6,4.7l6-4.8 M26,10.3l-6-4.7l-6,4.8'/>
    </svg>
    `,
}

export default SVG;