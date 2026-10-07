const WA="966567225245";const FB="https://www.facebook.com/profile.php?id=61594226919156";
let products=[], shown=[], cart=JSON.parse(localStorage.getItem("eyakub_cart")||"[]");

async function init(){
  try{const r=await fetch("products-120.json");products=await r.json()}catch(e){products=[]}
  shown=[...products];render();updateCart();
  document.getElementById("waLink").href=`https://wa.me/${WA}`;
  document.getElementById("search").addEventListener("keydown",e=>{if(e.key==="Enter")doSearch()});
}
function money(n){return "৳"+Number(n).toLocaleString("en-US")}
function render(){
 const grid=document.getElementById("grid"); document.getElementById("resultCount").textContent=`${shown.length} Products`;
 grid.innerHTML=shown.map(p=>`<article class="card"><div class="pic"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="badge">${p.badge}</span></div><div class="info"><div class="stars">★★★★★ <small>${p.rating}</small></div><h3>${p.name}</h3><div class="price">${money(p.price)} <span class="old">${money(p.old_price)}</span></div><div class="stock">● Stock: ${p.stock}</div><div class="actions"><button class="details" onclick="details('${p.id}')">Details</button><button class="buy" onclick="addCart('${p.id}')">Buy</button></div></div></article>`).join("");
}
function filterCat(cat){shown=cat==="All"?[...products]:products.filter(p=>p.category===cat);render();scrollToId("products")}
function filterSub(sub){shown=products.filter(p=>p.subcategory===sub);render();scrollToId("products")}
function doSearch(){const q=document.getElementById("search").value.toLowerCase().trim();shown=products.filter(p=>(p.name+" "+p.category+" "+p.subcategory).toLowerCase().includes(q));render();scrollToId("products")}
function details(id){const p=products.find(x=>x.id===id);document.getElementById("modalContent").innerHTML=`<div class="detail"><img src="${p.image}"><div><small>${p.category} / ${p.subcategory}</small><h2>${p.name}</h2><div class="stars">★★★★★ ${p.rating}</div><h2>${money(p.price)} <span class="old">${money(p.old_price)}</span></h2><p>${p.description}</p><p>Available stock: ${p.stock}</p><button class="primary" onclick="addCart('${p.id}');closeModal();openCart()">Add to Cart</button></div></div>`;document.getElementById("modal").classList.add("show")}
function closeModal(){document.getElementById("modal").classList.remove("show")}
function addCart(id){const p=products.find(x=>x.id===id);const x=cart.find(x=>x.id===id);if(x)x.qty++;else cart.push({id:p.id,name:p.name,price:p.price,image:p.image,qty:1});saveCart();openCart()}
function saveCart(){localStorage.setItem("eyakub_cart",JSON.stringify(cart));updateCart()}
function updateCart(){document.getElementById("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);document.getElementById("cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><img src="${x.image}"><div style="flex:1"><b>${x.name}</b><div>${money(x.price)} × ${x.qty}</div><button onclick="removeCart('${x.id}')">Remove</button></div></div>`).join(""):"<p>Your cart is empty.</p>";document.getElementById("cartTotal").textContent=money(cart.reduce((a,x)=>a+x.price*x.qty,0))}
function removeCart(id){cart=cart.filter(x=>x.id!==id);saveCart()}
function openCart(){document.getElementById("cart").classList.add("open")}
function closeCart(){document.getElementById("cart").classList.remove("open")}
function openWhatsApp(){window.open(`https://wa.me/${WA}?text=${encodeURIComponent("Hello Eyakub Shop, I want to place an order.")}`,"_blank")}
function checkout(){if(!cart.length)return alert("Your cart is empty.");let lines=cart.map(x=>`${x.name} x${x.qty} = ${money(x.price*x.qty)}`).join("\n");let total=cart.reduce((a,x)=>a+x.price*x.qty,0);let msg=`Hello Eyakub Shop!\nI want to order:\n${lines}\nTotal: ${money(total)}\n\nPlease send me the order details form.`;window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,"_blank")}
function scrollToId(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}
init();
