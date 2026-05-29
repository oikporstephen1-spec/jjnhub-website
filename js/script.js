function openOrderForm(){

document
.getElementById(
"orderPopup"
)
.style.display="block";

}

function closeOrderForm(){

document
.getElementById(
"orderPopup"
)
.style.display="none";

}


window.onclick=function(event){

let popup=

document
.getElementById(
"orderPopup"
);

if(

event.target===popup

){

popup.style.display="none";

}

}
<script>

function openOrderForm(vehicle){

document
.getElementById(
"selectedVehicle"
)

.value=vehicle;


document
.getElementById(
"orderPopup"
)

.style.display="block";

}


function closeOrderForm(){

document
.getElementById(
"orderPopup"
)

.style.display="none";

}


function openImage(img){

document
.getElementById(
"imagePopup"
)

.style.display="flex";


document
.getElementById(
"popupImage"
)

.src=img.src;

}


function closeImage(){

document
.getElementById(
"imagePopup"
)

.style.display="none";

}

</script>