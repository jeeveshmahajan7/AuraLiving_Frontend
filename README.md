# AuraLiving — Home Decor E-Commerce App

AuraLiving is a modern home decor e-commerce platform that allows users to explore, save, and shop beautifully designed products for their living spaces.

The application features seamless browsing, product filtering, user accounts with favorites, a shopping cart, and checkout capabilities — all built on a scalable MERN-stack architecture.

---

## Demo Link

[Live Demo](https://aura-living-frontend.vercel.app/)

---

## Quick Start

```
git clone https://github.com/jeeveshmahajan7/AuraLiving_Frontend.git
cd <your-repo>
npm install
npm run dev
```

---

## Technologies

- React JS
- React Router
- Node JS
- Express
- MongoDB

---

## Demo Video

Watch a walkthrough (3 minutes) of all the major features of this app:<br>
[Drive Link](https://drive.google.com/file/d/1idL56CsCBQwYucdbXa0jmDEldpY-yVaQ/view?usp=sharing)

---

## Features

**Home**

- Displays cards for all product categories.
- Clicking a category card shows the list of products within that category.

**Products Page**

- Shows a list of products with Add to Cart and Add to Wishlist buttons.
- Includes filters for price, category, and rating, along with sorting by price.
- Allows searching for products by title or category via the search bar.

**Account Page**

- A sidebar to switch between Profile Details, Order History, and Delivery Addresses.
- Addresses can be added, edited, deleted, or set as default.

**Favorites / Wishlist Page**

- Displays all wishlisted products.
- Each product includes Remove from Wishlist and Add to Cart buttons.

**Cart Page**

- Shows all cart products along with their quantities.
- Each product includes Move to Favorites and Remove from Cart buttons.
- A clear Cart Summary section showing:
- A button is available to check the order history.
  - Number of items
  - Price
  - Discount
  - Delivery charges
  - Final amount
  - Total savings
- A button to view Order History is available.

**Checkout Page**

- Displays delivery details such as name, address, contact number, and pricing summary including delivery charges and final amount.
- Includes a Place Order button.
- Provides an option to change the delivery address.

---

## API Reference

### GET /api/products

Get all products<br>
Sample response:<br>

```
{message, products: [{_id, title, price, ...}]}
```

### GET /api/products/details/:productId

Get details of a product by Id<br>
Sample response:<br>

```
{message, product: [{_id, title, price, ...}]}
```

### GET /api/users/:userId/details

Get user by Id<br>
Sample response:<br>

```
{message, userDetails: [{_id, name, email, ...}]}
```

### GET /api/users/:userId/favorites

Get all favorite products for the user<br>
Sample response:<br>

```
{message, favoriteProducts: [{_id, title, price, ...}]}
```

### GET /api/users/:userId/cart

Get all products from the cart<br>
Sample response:<br>

```
{message, cart: { _id, user, items: [{product, quantity, _id}, ...], ...}}
```

### Get /api/users/:userId/orders

Get all orders<br>
Sample response:<br>

```
{message, orders: [{address: {name, street, city, ...}, _id, user, ...}, ...]}
```

### POST /api/product

Save a product<br>
Sample response:<br>

```
{message, product: [{_id, title, price, ...}]}
```

### POST /api/users/:userId/address

Add an address for a user<br>
Sample response:<br>

```
{name, street, city, ...}
```

### POST /api/users/:userId/favorites/:productId

Add a product to user favorites<br>
Sample response:<br>

```
{message}
```

### POST /api/users/:userId/cart/:productId

Add a product to cart<br>
Sample response:<br>

```
{message, cart: { _id, user, items: [{product, quantity, _id}, ...], ...}}
```

### POST /api/users/:userId/orders

Place an order<br>
Sample response:<br>

```
{message, order: {address: {name, street, city, ...}, _id, user, ...}}
```

### PUT /api/users/:userId/address/:addressId

Update an address for a user<br>
Sample response:<br>

```
{message}
```

### PUT /api/users/:userId/address/:addressId/default

Mark an address as default<br>
Sample response:<br>

```
{message}
```

### DELETE /api/products

Delete all products<br>
Sample response:<br>

```
{message}
```

### DELETE /api/users/:userId/address/:addressId

Delete an address for a user<br>
Sample response:<br>

```
{message}
```

### DELETE /api/users/:userId/favorites/:productId

Delete a product from user favorites<br>
Sample response:<br>

```
{message}
```

### DELETE /api/users/:userId/cart/:productId

Decrease quantity of product from cart, or delete the product if quantity is 1<br>
Sample response:<br>

```
{message, cart: { _id, user, items: [{product, quantity, _id}, ...], ...}}
```

### DELETE /api/users/:userId/cart/:productId/?all=true

Delete product from cart regardless of the quantity<br>
Sample response:<br>

```
{message, cart: { _id, user, items: [{product, quantity, _id}, ...], ...}}
```

---

## Contact

For bugs or feature requests, please reach out to **jeeveshmahajan00@gmail.com**
