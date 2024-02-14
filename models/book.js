import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
    {
        title: String,
        author: String,
        pages: Number,
        genres: Array,
        rating: Number,
    },
    {
        timestamps: true,
    }
);

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);

export default Book;