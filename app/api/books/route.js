//import connectMongoDB from "@/libs/mongodb";
import db from "@/libs/mongodb_v2";
import Book from "@/models/book";
import { NextResponse } from "next/server";

export async function POST(request) {

    await db.connectMongoDB();

    const { action } = await request.json();

    if (action === 'insertBook') {

        await insertBook();
        return NextResponse.json({ message: "Book Created" }, { status: 201 });

    } else if (action === 'insertManyBook') {

        await insertManyBook();
        return NextResponse.json({ message: "Books Created" }, { status: 201 });

    } else if (action === 'findOneBook') {

        let id = '65cd78dbb4906d8d65a87b5c';
        const book = await findOneBook(id);
        return NextResponse.json(
            {
                message: "Book found",
                book: book

            },
            { status: 201 });

    } else if (action === 'findBookByTitlePattern') {

        //let titlePattern = { title: /The Color of Magic/ };
        let titlePattern = { title: /hilmi/ };
        const book = await findBookByTitlePattern(titlePattern);
        return NextResponse.json(
            {
                message: "Book found",
                book: book

            },
            { status: 201 });

    } else if (action === 'findBookByAuthor') {

        let data = {
            author: 'Hilmi',
            rating: { $gt: 6 }
        };
        const book = await findBookByAuthor(data);
        return NextResponse.json(
            {
                message: "Book found",
                book: book

            },
            { status: 201 });

    } else if (action === 'findLatestBook') {

        const book = await findLatestBook();
        return NextResponse.json(
            {
                message: "Book found",
                book: book

            },
            { status: 201 });

    } else if (action === 'findBookGreaterThan') {

        const book = await findBookGreaterThan({
            rating: { $gt: 6 }
        });
        return NextResponse.json(
            {
                message: "Book found",
                book: book

            },
            { status: 201 });

    } else if (action === 'findButSelectFewColumn') {

        const book = await findButSelectFewColumn({});
        return NextResponse.json(
            {
                message: "Book found",
                book: book

            },
            { status: 201 });

    } else if (action === 'findByIdV1') {


        const book = await Book.findOne({
            //_id: ObjectId('65cd790eb4906d8d65a87b5f')
            _id: '65cd78dbb4906d8d65a87b5c'
        });
        return NextResponse.json(
            {
                message: "Book found",
                book: book

            },
            { status: 201 }
        );

    } else if (action === 'findMethodChaining') {

        // using find and count
        const books = await Book.find().count();
        return NextResponse.json(
            {
                message: "Book found",
                books: books

            },
            { status: 201 }
        );

    } else if (action === 'findMethodChainingFilter') {

        const books = await Book.find({
            author: "Hilmi"
        }).count();
        return NextResponse.json(
            {
                message: "Book found",
                books: books

            },
            { status: 201 }
        );

    } else if (action === 'findLimit') {
        const books = await Book.find().limit(3);
        return NextResponse.json(
            {
                message: "Book found",
                books: books

            },
            { status: 201 }
        );

    } else if (action === 'findSort') {

        const books = await Book.find().sort({ title: 1 }); // -1 1
        return NextResponse.json(
            {
                message: "Book found",
                books: books

            },
            { status: 201 }
        );

    } else if (action === 'insertNestedDocuments') {

        await Book.create({
            title: "The Way of Kings",
            author: "Brandon Sanderson",
            rating: 9,
            pages: 320,
            genres: ["fantasy"],
            reviews: [
                {
                    name: "Yoshi",
                    body: "Great book!!!"
                },
                {
                    name: "mario",
                    body: "So so"
                }
            ]
        });
        return NextResponse.json({ message: "Book Created" }, { status: 201 });

    } else if (action === 'insertNestedDocumentsMany') {

        await Book.insertMany([
            { title: "The Light Fantastic", author: "Terry Pratchett", pages: 250, rating: 6, genres: ["fantasy", "magic"], reviews: [{ name: "luigi", body: "it was pretty good" }, { name: "bowser", body: "loved it!!" }] },
            { title: "The Name of the Wind", "author": "Patrick Rothfuss", page: 500, "rating": 10, genres: ["fantasy"], review: [{ name: "peach", body: "one of my favs" }] },
            { title: "The Color of Magic", "author": "Terry Pratchett", page: 350, "rating": 8, genres: ["fantasy", "magic"], review: [{ name: "luigi", body: "it was ok" }, { name: "bowser", body: "really good book" }] },
            { title: "1984", "author": "George Orwell", page: 300, "rating": 6, genres: ["sci-fi", "dystopian"], review: [{ name: "peach", body: "not my cup of tea" }, { name: "mario", body: "meh" }] }
        ]);

        return NextResponse.json({ message: "Books Created" }, { status: 201 });

    } else if (action === 'findWithGreaterThan') {

        const books = await Book.find({ rating: { $gt: 7 } });
        return NextResponse.json({ message: "Book found", books: books }, { status: 201 });

    } else if (action === 'findWithLessThan') {

        // $gt $gte $lt $lte
        const books = await Book.find({ rating: { $lt: 8 } });
        return NextResponse.json({ message: "Book found", books: books }, { status: 201 });

    } else if (action === 'findWithLessThanWithTotalResult') {

        const results = await Book.aggregate([
            { $match: { rating: { $lt: 8 } } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 }, // Count the number of matched documents
                    books: { $push: "$$ROOT" }, // Push matching documents into an array
                },
            },
        ]);

        const books = results[0].books; // Extract the books array
        const totalCount = results[0].total; // Extract the total count

        return NextResponse.json({
            message: "Book found",
            totalBooks: totalCount,
            books: books,
        }, { status: 201 });

    } else if (action === 'findWithLessThanWithTotalResultV2') {
        const books = await Book.find({ rating: { $lt: 8 } });
        const totalCount = await Book.countDocuments({ rating: { $lt: 8 } });

        return NextResponse.json({
            message: "Book found",
            total: totalCount,
            books: books,
        }, { status: 201 });

    } else if (action === 'findWithGreaterThanAndAuthor') {

        const books = await Book.find({ rating: { $gt: 1 }, author: "Patrick Rothfuss" });
        return NextResponse.json({ message: "Book found", books: books }, { status: 201 });

    } else if (action === 'findWithOrOperator') {

        // const books = await Book.find({ 
        //     $or: [
        //         {rating: 6}, 
        //         {rating: 9}, 
        //     ] 
        // });

        // const books = await Book.find({ 
        //     $or: [
        //         {rating: 6}, 
        //         {author: "Terry Pratchett"}, 
        //     ] 
        // });

        const books = await Book.find({
            $or: [
                { pages: { $lt: 400 } },
                { pages: { $gt: 600 } }
            ]
        });
        return NextResponse.json({ message: "Book found", books: books }, { status: 201 });

    } else if (action === 'findWithIn') {

        const books = await Book.find({
            rating: { $in: [7, 8, 9] }
        });
        return NextResponse.json({ message: "Book found", books: books }, { status: 201 });

    } else if (action === 'findWithNotIn') {
        const books = await Book.find({
            rating: { $nin: [7, 8, 9] }
        });
        return NextResponse.json({ message: "Book found", books: books }, { status: 201 });

    } else if (action === 'findWithQueryingArrays') {

        const books = await Book.find({
            genres: "magic"
        });
        return NextResponse.json({ message: "Book found", books: books }, { status: 201 });

    } else if (action === 'findWithQueryingArraysV2') {

        const books = await Book.find({
            genres: ["fantasy"] // will only fetch genres that have exactly this, if it has others, it will not included
            //genres: ["magic", "fantasy"]
            //genres: ["fantasy", "magic"]
        });
        return NextResponse.json({ message: "Book found", books: books }, { status: 201 });

    } else if (action === 'findWithQueryingArraysWithAll') {

        const books = await Book.find({
            genres: { $all: ["fantasy", "sci-fi"] }
        });
        return NextResponse.json({ message: "Book found", books: books }, { status: 201 });

    } else if (action === 'findWithQueryingArraysWithNestedDocuments') {
        const books = await Book.find({
            //"reviews.name": "mario" 
            "reviews.body": "So so"
        });
        return NextResponse.json({ message: "Book found", books: books }, { status: 201 });

    } else if (action === 'getAllDataWithCount') {

        const results = await Book.aggregate([
            { $match: {} },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 }, // Count the number of matched documents
                    books: { $push: "$$ROOT" }, // Push matching documents into an array
                },
            },
        ]);

        const books = results[0].books; // Extract the books array
        const totalCount = results[0].total; // Extract the total count

        return NextResponse.json({
            message: "Book found",
            totalBooks: totalCount,
            books: books,
        }, { status: 201 });

    } else if (action === 'deleteOne') {

        const response = await Book.deleteOne({ _id: '65cf5208c43f512781b2c708' });
        return NextResponse.json({ message: "Book found", response: response }, { status: 201 });

    } else if (action === 'deleteMany') {

        const response = await Book.deleteMany({ author: 'Terry Pratchett' });
        return NextResponse.json({ message: "Book found", response: response }, { status: 201 });

    } else if (action === 'updateOne') {

        const bookId = '65cf5208c43f512781b2c705';
        try {
            await Book.updateOne({ _id: bookId }, { title: 'The Light Fantastic 102', author: 'Terry Pratchett 102' });
            console.log('Book updated');

            const books = await Book.find();
            return NextResponse.json({ message: "Books found", books: books }, { status: 201 });
        } catch (err) {
            console.error(err.message);
            return NextResponse.json({ message: "Error updating book", error: err.message }, { status: 500 });
        }

    } else if (action === 'updateMany') {
        try {
            const result = await Book.updateMany(
                { author: 'Terry Pratchett 1055' },
                { author: 'Terry Pratchett' }
            );

            const books = await Book.find();
            return NextResponse.json({ message: "Books found", books: books, result: result }, { status: 201 });
        } catch (err) {
            console.error('Error updating books:', err.message);
        }

    } else if (action === 'updateManyV2') {
        try {
            const result = await Book.updateMany(
                { rating: { $gte: 7 } },
                { rating: 100 }
            );

            const books = await Book.find();
            return NextResponse.json({ message: "Books found", result: result, books: books }, { status: 201 });
        } catch (err) {
            console.error('Error updating books:', err.message);
        }

    } else if (action === 'updateNestedDocumentV1') {

        // push into the array
        const newGenres = ["genre1", "genre2", "genre5"];

        try {
            const result = await Book.updateOne(
                { _id: '65cf5177c43f512781b2c701' }, 
                { $push: { genres: { $each: newGenres } } }
            );

            const books = await Book.find();
            return NextResponse.json({ message: "Books found", result: result, books: books }, { status: 201 });

        } catch (err) {
            console.error('Error adding genres:', err.message);
        }

    } else if (action === 'updateNestedDocumentV2') {

        const newGenres = ["genre1", "fantasy", "genre5", "genre6"];

        try {
            const result = await Book.updateOne(
                { _id: '65cf5177c43f512781b2c701' }, 
                { $set: { genres: newGenres } }
            );

            const books = await Book.find();
            return NextResponse.json({ message: "Books found", result: result, books: books }, { status: 201 });

        } catch (err) {
            console.error('Error adding genres:', err.message);
        }

    } else if (action === 'sample') {

    } else {

        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });

    }

}

const insertBook = async () => {
    await Book.create({
        title: "The Color of Magic 13",
        author: "Terry Pratchett",
        pages: 300,
        rating: 7,
        genres: ["fantasy", "magic"]
    });
};

const insertManyBook = async () => {
    await Book.insertMany([
        { title: "The Light Fantastic 3", author: "Terry Pratchett 3", pages: 250, rating: 6, genres: ["fantasy"] },
        { title: "Dune 3", author: "Frank Herbert 3", pages: 500, rating: 10, genres: ["sci-fi", "dystopian"] }]
    );
};

const findOneBook = async (id) => {
    return await Book.findById(id);
};

const findBookByTitlePattern = async (titlePattern) => {
    return await Book.find(titlePattern);
};

const findBookByAuthor = async (data) => {
    return await Book.find(data);
};

const findLatestBook = async () => {
    return await Book.findOne({}, {}, { sort: { _id: -1 } });
};


const findBookGreaterThan = async (data) => {
    return await Book.find(data);
};

const findButSelectFewColumn = async (data) => {
    return await Book.find(data, { title: 1, author: 1 });
};













