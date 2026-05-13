const items = {
  "item-a": {id:"item-a",name:"Item A",price:29.99,image:"https://placehold.co/600x600"},
  "item-b": {id:"item-b",name:"Item B",price:49.99,image:"https://placehold.co/600x600"},
  "item-c": {id:"item-c",name:"Item C",price:19.99,image:"https://placehold.co/600x600"},
  "item-d": {id:"item-d",name:"Item D",price:99.99,image:"https://placehold.co/600x600"}
};

function getCart(){
  return JSON.parse(localStorage.getItem("sunqCart")) || [];
}

function saveCart(cart){
  localStorage.setItem("sunqCart", JSON.stringify(cart));
}

function cartTotal(){
  return getCart().reduce((t,i)=>t+i.quantity,0);
}

function updateCartUI(){
  const el = document.getElementById("cart-count");
  if(el) el.innerText = cartTotal();
}
