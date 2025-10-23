const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/index');
const db = require('../src/dbClient');

chai.use(chaiHttp);
const expect = chai.expect;

function fetchProductByIndex(index, callback) {
  
  db.lindex('products', index, (err, result) => {
    if (err) {
      callback(err);
    } else {
      const product = JSON.parse(result);
      callback(null, product);
    }
  });
}

describe('Product CRUD Operations', () => {
  beforeEach(() => {
    db.flushdb();
  });

  after(() => {
    app.close();
    db.quit();
  });

  describe('/insertProduct', () => {
    it('should insert a product correctly', (done) => {
      const productData = {
        productName: 'TestProduct',
        price: 20.99
      };
  
      chai.request(app)
        .post('/insertProduct')
        .send(productData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          
          console.log(res.body);
          expect(productData).to.have.property('productName', productData.productName);
    
          done();
        });
    });
  });

  describe('POST /updateProduct/:index', () => {
    it('should update a product', (done) => {
      const indexToUpdate = 0; 
      const updatedProductData = {
        productName: 'Updated Product',
        price: 25.99,
      };
  
      const productData = {
        productName: 'TestProduct',
        price: 20.99,
      };
  
      chai.request(app)
        .post('/insertProduct')
        .send(productData)
        .end((err, res) => {
          expect(res).to.have.status(200);
            chai.request(app)
            .post(`/updateProduct/${indexToUpdate}`)
            .send(updatedProductData)
            .end((err, res) => {
              console.log(res.body);
  
              expect(res).to.have.status(200);
  
              fetchProductByIndex(indexToUpdate, (error, updatedProduct) => {
                if (error) {
                  console.error(error);
                  done(error);
                } else {
                  expect(updatedProduct).to.have.property('productName', updatedProductData.productName);
                  expect(updatedProduct).to.have.property('price', updatedProductData.price);
                  done();
                }
              });
            });
        });
    });
  });
  
  

  describe('POST /deleteProduct/:index', () => {
    it('should delete a product', (done) => {
      const indexToDelete = 0; 
  
      chai.request(app)
        .post(`/deleteProduct/${indexToDelete}`)
        .end((err, res) => {
          console.log(res.body);
  
          expect(res).to.have.status(200);
  
          done();
        });
    });
  });
});
