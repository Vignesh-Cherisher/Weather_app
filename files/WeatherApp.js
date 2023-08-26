const scrollable = document.getElementsByClassName('card-self');
const scrollOverlay = document.getElementsByClassName('card-overlay');
const scrollRack = document.querySelector('.cards-rack');

function yScroll( x , y) {
    x.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        if(evt.deltaY != 0){
            window.scrollBy({
                top: evt.deltaY ,
            });
        }
        if(evt.deltaX != 0){ 
            y.scrollLeft += evt.deltaX;
        }
    })
}

for(var i = 0 ; i < scrollable.length ; i++) {
    yScroll(scrollable[i],scrollRack);    
}

yScroll(scrollOverlay[0], scrollRack)