const express = require('express');
const userRouter = require('./routes/user');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();
const port = process.env.PORT || 3000;

const redisClient = require('./dbClient');


redisClient.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  redisClient.lrange('products', 0, -1, (err, result) => {
    if (err) {
      console.error('Error fetching products from Redis:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const products = result.map(JSON.parse);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Products</title>
        </head>
        <body>
          <h1>Products</h1>
          <ul>
          ${products.map((product, index) => `
          <li>${product.productName} - $${product.price}
            <form style="display:inline-block;" method="GET" action="/updateProduct/${index}">
              <button type="submit">Éditer</button>
            </form>
            <form style="display:inline-block;" method="POST" action="/deleteProduct/${index}">
              <button type="submit">Supprimer</button>
            </form>
          </li>`).join('')}
          </ul>
          <h2>Add Product</h2>
          <form method="POST" action="/insertProduct">
            <label for="productName">Product Name:</label>
            <input type="text" id="productName" name="productName" required>
            <br>
            <label for="price">Price:</label>
            <input type="number" id="price" name="price" step="0.01" required>
            <br>
            <button type="submit">Add Product</button>
          </form>
        </body>
      </html>
    `;
    res.send(html);
  });
});

app.get('/updateProduct/:index', (req, res) => {
  const index = parseInt(req.params.index);

  redisClient.lindex('products', index, (err, result) => {
    if (err) {
      console.error('Error fetching product from Redis:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const product = JSON.parse(result);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Edit Product</title>
        </head>
        <body>
          <h1>Edit Product</h1>
          <form method="POST" action="/updateProduct/${index}">
            <label for="productName">Product Name:</label>
            <input type="text" id="productName" name="productName" value="${product.productName}" required>
            <br>
            <label for="price">Price:</label>
            <input type="number" id="price" name="price" step="0.01" value="${product.price}" required>
            <br>
            <button type="submit">Update Product</button>
          </form>
        </body>
      </html>
    `;
    res.send(html);
  });
});

app.post('/updateProduct/:index', (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const { productName, price } = req.body;

    const updatedProduct = { productName, price };
    redisClient.lset('products', index, JSON.stringify(updatedProduct));

    console.log('Updated Product Name:', productName);
    console.log('Updated Price:', price);

    res.redirect('/');

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/insertProduct', (req, res) => {
  try {
    const { productName, price } = req.body;

    const product = { productName, price };
    redisClient.rpush('products', JSON.stringify(product));

    console.log('Product Name:', productName);
    console.log('Price:', price);

    //res.status(200).json({ message: 'Product added successfully', productName: productName });
    res.redirect('/');

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.post('/deleteProduct/:index', (req, res) => {
  try {
    const index = parseInt(req.params.index);

    redisClient.lindex('products', index, (err, result) => {
      if (err) {
        console.error('Error fetching product from Redis:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const product = JSON.parse(result);

      redisClient.lrem('products', 0, JSON.stringify(product), (remErr) => {
        if (remErr) {
          console.error('Error deleting product from Redis:', remErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Deleted Product:', product);

        res.redirect('/');
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const server = app.listen(port, (err) => {
  if (err) throw err;
  console.log("Server listening on port " + port);
});

module.exports = server;
