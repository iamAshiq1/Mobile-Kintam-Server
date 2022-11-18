const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://Ashik:90875@cluster0.obi7m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Mobile");
    const ProductsCollection = database.collection("Products");
    const ReviewsCollection = database.collection("Reviews");
    const OrdersCollection = database.collection("Orders");
    const usersCollection = database.collection('users');

    // GET API
    app.get("/Reviews", async (req, res) => {
      const cursor = ReviewsCollection.find({});
      const Reviews = await cursor.toArray();
      res.send(Reviews);
    });

    app.get("/Reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const Review = await ReviewsCollection.findOne(query);
      res.send(Review);
    });

    app.get("/Products", async (req, res) => {
      const cursor = ProductsCollection.find({});
      const Products = await cursor.toArray();
      res.send(Products);
    });

    app.get("/Products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const Product = await ProductsCollection.findOne(query);
      res.json(Product);
    });

    app.get("/Orders", async (req, res) => {
      const cursor = OrdersCollection.find({});
      const Orders = await cursor.toArray();
      res.send(Orders);
    });

    app.get("/Orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const Order = await OrdersCollection.findOne(query);
      res.json(Order);
    });

    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
    
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
          isAdmin = true;
      }
      res.json({ admin: isAdmin });
  })
    
//=========================================================//

    // POST API
    app.post("/Products", async (req, res) => {
      const Product = req.body;
      const result = await ProductsCollection.insertOne(Product);
      res.json(result);
    });
    
    app.post("/Reviews", async (req, res) => {
      const result = await ReviewsCollection.insertOne(req.body);
      res.json(result);
    });


    app.post("/Orders", async (req, res) => {
      const result = await OrdersCollection.insertOne(req.body);
      res.json(result);
    });

    app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        });
        
// ========================================================= //

    //PUT API
    app.put('/users', async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        const options = { upsert: true };
        const updateDoc = { $set: user };
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.json(result);
    });
    app.put('/users/admin', async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        const updateDoc = { $set: { role: 'admin' } };
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.json(result);
  })

  app.put('/Orders/:id', async (req, res) => {
    const id = req.params.id;
    const updatedOrder = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
        $set: {
            status: updatedOrder.status,
        },
    };
    const result = await OrdersCollection.updateOne(filter, updateDoc, options)
    console.log('updating', updateDoc)
    res.json(result)
})


//========================================================//

  //  DELETE API
    app.delete("/Orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await OrdersCollection.deleteOne(query);

      console.log("deleting Order with id ", result);

      res.json(result);
    })
    
    app.delete("/Products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ProductsCollection.deleteOne(query);
      console.log("deleting Product with id ", result);
      res.json(result);
    })
    app.delete("/Reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ReviewsCollection.deleteOne(query);
      console.log("deleting Review with id ", result);
      res.json(result);
    })
    
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my Server");
});

app.listen(port, () => {
  console.log("Running Server on port", port);
});
