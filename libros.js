const express = require("express");
const mongoose = require("mongoose");
const { Book } = require("./models/libro"); 

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/librosDB")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.log("Error de conexión a MongoDB:", err));

app.post("/libros", async (req, res) => {
  try {
    const { name, authors, genres, pages, publicationDate } = req.body;

    if (!name || !authors || !genres || !pages || !publicationDate) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const newBook = new Book({
      name,
      authors,
      genres,
      pages,
      publicationDate: new Date(publicationDate),
    });

    await newBook.save();
    res.status(201).json({ message: "Libro creado exitosamente", book: newBook });
  } catch (err) {
    res.status(500).json({ message: "Error al crear el libro", error: err });
  }
});

app.get("/libros", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los libros", error: err });
  }
});

app.get("/libros/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener el libro", error: err });
  }
});

app.delete("/libros/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.status(200).json({ message: "Libro eliminado exitosamente", book });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar el libro", error: err });
  }
});

app.put("/libros/:id", async (req, res) => {
    try {
      const { name, authors, genres, pages, publicationDate } = req.body;
      const bookId = req.params.id.trim();  // Eliminar saltos de línea y espacios extra
  
      if (!name || !authors || !genres || !pages || !publicationDate) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
      }
  
      if (pages <= 0) {
        return res.status(400).json({ message: "El número de páginas debe ser mayor que 0" });
      }
  
      const publicationDateObj = new Date(publicationDate);
      if (publicationDateObj > new Date()) {
        return res.status(400).json({ message: "La fecha de publicación no puede ser en el futuro" });
      }
  
      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        {
          name,
          authors,
          genres,
          pages,
          publicationDate: publicationDateObj
        },
        { new: true }
      );
  
      if (!updatedBook) {
        return res.status(404).json({ message: "Libro no encontrado" });
      }
  
      res.status(200).json({ message: "Libro actualizado exitosamente", book: updatedBook });
  
    } catch (err) {
      res.status(500).json({ message: "Error al actualizar el libro", error: err });
    }
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});