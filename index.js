const express = require('express');
const mongoose = require('mongoose');
const { Dog } = require('./models/dog');

const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/dogs_database')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log('Error de conexión a MongoDB:', err));

app.post('/dogs', async (req, res) => {
  try {
    const { name, breed, age, isGoodBoy } = req.body;
    const dog = new Dog({ name, breed, age, isGoodBoy });

    await dog.save();
    res.status(201).json(dog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/dogs', async (req, res) => {
  try {
    const dogs = await Dog.find();
    res.status(200).json(dogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});