const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const assert = require('assert');
const uri = require('./uri').uri;
var bodyParser = require('body-parser');
const { env } = require('process');
var cors = require('cors');
const sockio = require('socket.io')(3001, {
  cors: {
    origin: ['http://localhost:3000']
  }
});
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 5000;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(async (err) => {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const database = client.db("colab-database");
  let collection = "";
  const saveContainers = database.collection('save-containers');
  app.get('/getContainerData', async (req, res) => {
    let containerVals = await saveContainers.find({'savedCon': 'saved'}).toArray();
    res.send(containerVals[0].value.containers)
  })
  app.post('/savedcontainers', async (req, res) => {
    console.log('Works')
    containerData = req.body
    const countSavedContainersInitial = await saveContainers.countDocuments({ 'savedCon': 'saved' }, limit = 1);
    if (countSavedContainersInitial == 0) {
      await saveContainers.insertOne({ 'savedCon': 'saved', 'value': containerData})
    } else {
      await saveContainers.updateOne({ 'savedCon': 'saved'}, {$set: {'value': containerData}})
    }
    let containerVals = await saveContainers.find({'savedCon': 'saved'}).toArray();
    res.send(containerVals[0].value.containers)
  })
  sockio.on('connection', async (socket) => {
    console.log(socket.id);
    socket.on('Join', async (roomId) => {
      socket.join(roomId);
      console.log(`Joined room ${roomId}`)
      let collectionExists = false;
      database.listCollections().toArray(async function(err, items){
        if (err) throw err; 
        if (items.length == 0)
            console.log("No collections in database")
        else {
          for (let i = 0; i < items.length; i++) {
            console.log(items[i].name);
            if (items[i].name === `${roomId} collection`) {
              collectionExists = true;
            }
          }
        }
        if (!collectionExists) {
          database.createCollection(`${roomId} collection`, function(err, result) {
            if (err) throw err;
            console.log("Collection is created!");
          });
        }
        collection = database.collection(`${roomId} collection`)
        const countHTMLInitial = await collection.countDocuments({ 'htmlStore': 'HTML' }, limit = 1);
        const countCSSInitial = await collection.countDocuments({ 'cssStore': 'CSS' }, limit = 1);
        const countJSInitial = await collection.countDocuments({ 'jsStore': 'JS' }, limit = 1);
        if (countHTMLInitial == 0) {
          await collection.insertOne({'htmlStore': 'HTML', 'value': ''})
        }
        if (countCSSInitial == 0) {
          await collection.insertOne({'cssStore': 'CSS', 'value': ''})
        }
        if (countJSInitial == 0) {
        await collection.insertOne({'jsStore': 'JS', 'value': ''})
        }
        let htmlItems =  await collection.find({'htmlStore': 'HTML'}).toArray();
        htmlItems = htmlItems[0].value;
        let cssItems =  await collection.find({'cssStore': 'CSS'}).toArray();
        cssItems = cssItems[0].value;
        let jsItems =  await collection.find({'jsStore': 'JS'}).toArray();
        jsItems = jsItems[0].value;
        const initial = {html: htmlItems, css: cssItems, js: jsItems};
        sockio.to(roomId).emit('initialData', initial)
      });
    })
    socket.on('inputCode', async (data) => {
      if (data.room === '') {
        socket.broadcast.emit('sendVal', data);
      } else {
        socket.to(data.room).emit('sendVal', data);
        collection = database.collection(`${data.room} collection`)
      }
      if (data.type === 'xml') {
        const countHTML = await collection.countDocuments({ 'htmlStore': 'HTML' }, limit = 1);
        if (countHTML == 0) {
          await collection.insertOne({'htmlStore': 'HTML', 'value': data.val})
        } else {
          await collection.updateOne({ 'htmlStore': 'HTML'}, {$set: {'value': data.val}})
        }
      } else if (data.type === 'css') {
          const countCSS = await collection.countDocuments({ 'cssStore': 'CSS' }, limit = 1);
          if (countCSS == 0) {
            await collection.insertOne({'cssStore': 'CSS', 'value': data.val})
          } else {
            await collection.updateOne({ 'cssStore': 'CSS'}, {$set: {'value': data.val}})
          }
      } else if (data.type === 'javascript') {
          const countJS = await collection.countDocuments({ 'jsStore': 'JS' }, limit = 1);
          if (countJS == 0) {
            await collection.insertOne({'jsStore': 'JS', 'value': data.val})
          } else {
            await collection.updateOne({ 'jsStore': 'JS'}, {$set: {'value': data.val}})
          }
      }
    })
  });
  process.on('SIGINT', function() {
    client.close(function () {
      console.log('Mongoose disconnected on app termination');
      process.exit(0);
    });
  });
});

app.listen(port, () =>
  console.log(`Example app listening on port ${port}`),
);

