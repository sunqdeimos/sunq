window.items = {
  "item-a": {id:"item-a",name:"Item A",price:29.99,image:"https://placehold.co/600x600"},
  "item-b": {id:"item-b",name:"Item B",price:49.99,image:"https://placehold.co/600x600"},
  "item-c": {id:"item-c",name:"Item C",price:19.99,image:"https://placehold.co/600x600"},
  "item-d": {id:"item-d",name:"Item D",price:99.99,image:"https://placehold.co/600x600"},
  "item-e": {id:"item-e",name:"Item E",price:14.99,image:"https://placehold.co/600x600"},
  "item-f": {id:"item-f",name:"Item F",price:199.99,image:"https://placehold.co/600x600"}
};

window.getCart = function(){
  return JSON.parse(localStorage.getItem("sunqCart")) || [];
};

window.saveCart = function(cart){
  localStorage.setItem("sunqCart", JSON.stringify(cart));
};

window.cartTotal = function(){
  return getCart().reduce((t,i)=>t+i.quantity,0);
};

window.updateCartUI = function(){
  const el = document.getElementById("cart-count");
  if(el) el.innerText = cartTotal();
};
