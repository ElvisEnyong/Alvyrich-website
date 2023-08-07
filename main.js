class CartItem{
    constructor(name, desc, img, price){
        this.name = name
        this.desc = desc
        this.img = img
        this.price = price
        this.quantity = 1
    }
}

//local storage
class LocalCart {
    static key = "cartItems"

    static getLocalCartItems(){
          let cartMap = new Map()
        const cart = localStorage.getItem(LocalCart.key)
        if(cart===null || cart.length===0) return cartMap
           //[[2, obj], [3, obj]]
             return new Map(Object.entries(JSON.parse(cart)))
    }

    static addItemToLocalCart(id, item){
        let cart = LocalCart.getLocalCartItems()
        if(cart.has(id)) {
            let MapItem = cart.get(id)
            MapItem.quantity +=1
            cart.set(id, MapItem)
        }
        else
        cart.set(id, item)
        localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)))
       updateCartUI()
    }


    static removeItemFromCart(id){
        let cart = LocalCart.getLocalCartItems()
        if(cart.has(id)){
            let mapItem = cart.get(id)
            if(mapItem.quantity>1)
            {
            mapItem.quantity -=1
            cart.set(id, mapItem)
            }

            else 
             cart.delete(id)

        }
        if (cart.length===0)
        localStorage.clear()
        else

        localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)))
        updateCartUI()
    }

}



const cartIcon = document.querySelector('.fa-cart-arrow-down')
const wholeCartWindow = document.querySelector('.whole-cart-window')
wholeCartWindow.inWindow = 0
//cart botten
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn')
addToCartBtns.forEach( (btn)=>{
    btn.addEventListener('click', addItemFunction)
} )

function addItemFunction(e) {
     const id = e.target.parentElement.parentElement.parentElement.getAttribute("data-id")
     const img = e.target.parentElement.parentElement.previousElementSibling.src
     const name = e.target.parentElement.previousElementSibling.textContent
     const desc = e.target.parentElement.children[0].textContent
     const price = e.target.parentElement.children[1].textContent
     
     //price = price.replace("price: $", '')
     //cart items
     const item = new CartItem(name, desc, img, price)
     LocalCart.addItemToLocalCart(id, item)

    console.log(price)
}

// cart to open when mouse is on cart
cartIcon.addEventListener('mouseover', ()=>{
if(wholeCartWindow.classList.contains('hide'))
wholeCartWindow.classList.remove('hide')
})

// cart to closs when mouse leave
cartIcon.addEventListener('mouseleave', ()=>{
    //if(wholeCartWindow.classList.contains('hide'))
    setTimeout( () => {
        if(wholeCartWindow.inWindow===0){
            wholeCartWindow.classList.add('hide')
        }
    } ,500)

    })

    wholeCartWindow.addEventListener('mouseover', ()=> {
        wholeCartWindow.inWindow=1
    })

    wholeCartWindow.addEventListener('mouseleave', ()=> {
        wholeCartWindow.inWindow=0
        wholeCartWindow.classList.add('hide')
    })


    //cart update
    function updateCartUI() {
        const cartWrapper = document.querySelector('.cart-wrapper')
        cartWrapper.innerHTML=""
        const items = LocalCart.getLocalCartItems('cartItems')
        if(items === null) return
        let count = 0
        let total = 0
        for(const [key, value] of items.entries()) {
            const cartItem = document.createElement('div')
            cartItem.classList.add('cart-item')
            let price = value.price*value.quantity
            count+=1
            total += price
            cartItem.innerHTML =`
            <img src="${value.img}">
                                <div class="details">
                                    <h3>${value.name}</h3>
                                    <p>${value.desc}
                                        <span class="quantity">Quantity: ${value.quantity}</span>
                                        <span class="price">Price: $ ${price}</span>
                                    </p>
                                </div>
                                <div class="cancel"><i class="fas fa-window-close"></i></div>`
            cartItem.lastElementChild.addEventListener('click', ()=>{
                LocalCart.removeItemFromCart(key)
            })
            cartWrapper.append(cartItem)
        }

        if(count > 0) {
            cartIcon.classList.add('non-eempty')
            let root = document.querySelector(':root')
            root.style.setProperty('--after-content', `"${count}"`)
            const subtotal = document.querySelector('.subtotal')
            subtotal.innerHTML = `subTotal: $${total}`
        }
        else
        cartIcon.classList.remove('non-eempty')
    }
    document.addEventListener('DOMContentLoaded', ()=>{updateCartUI()})