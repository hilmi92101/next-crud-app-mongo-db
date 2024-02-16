import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    name: String,
    body: String 
});

const bookSchema = new Schema(
    {
        title: String,
        author: String,
        pages: Number,
        genres: Array,
        rating: Number,
        reviews: [reviewSchema],
    },
    {
        timestamps: true,
    }
);

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);

export default Book;