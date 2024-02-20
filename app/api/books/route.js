//import connectMongoDB from "@/libs/mongodb";
import db from "@/libs/mongodb_v2";
import Book from "@/models/book";
import { NextResponse } from "next/server";

export async function POST(request) {

    await db.connectMongoDB();

    // method 1
    //const { action } = await request.json();

    // method 2
    const { action, ...rest } = await request.json();

    // method 3
    // const data = await request.json();
    // const action = data.action;
    // delete data.action; // Remove action to avoid potential conflicts

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

    } else if (action === 'updateNestedDocumentCatchError') {

        const newGenres = ["genre1", "fantasy", "genre5", "genre6"];

        try {
            const result = await Book.updateOne(
                { _id: '65cf5177c43f512781b2c7012' },
                { $set: { genres: newGenres } }
            );

            const books = await Book.find();
            return NextResponse.json({ message: "Books found", result: result, books: books }, { status: 201 });

        } catch (err) {
            //console.error(err);
            //console.error('Error adding genres:', err.message);
            return NextResponse.json({ message: err.message }, { status: 500 });
        }

    } else if (action === 'insertNestedDocumentsManyV2') {

        await Book.insertMany([
            {
                title: "The Light Fantastic",
                author: "Terry Pratchett",
                pages: 250,
                rating: 6,
                genres: ["fantasy", "magic"],
                reviews: [{ name: "luigi", body: "it was pretty good" }, { name: "bowser", body: "loved it!!" }]
            },
            {
                title: "The Name of the Wind",
                author: "Patrick Rothfuss",
                pages: 662,
                rating: 9,
                genres: ["fantasy"],
                reviews: [{ name: "harry", body: "amazing storytelling!" }, { name: "hermione", body: "a must-read for fantasy lovers" }]
            },
            {
                title: "1984",
                author: "George Orwell",
                pages: 328,
                rating: 8,
                genres: ["dystopian", "fiction"],
                reviews: [{ name: "winston", body: "terrifyingly realistic" }, { name: "julia", body: "a classic that remains relevant" }]
            },
            {
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                pages: 300,
                rating: 9,
                genres: ["fantasy", "adventure"],
                reviews: [{ name: "frodo", body: "a journey worth taking" }, { name: "gandalf", body: "a timeless classic" }]
            },
            {
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                pages: 281,
                rating: 8,
                genres: ["fiction", "classic"],
                reviews: [{ name: "atticus", body: "profound and moving" }, { name: "scout", body: "a book that stays with you" }]
            },
            {
                title: "Pride and Prejudice",
                author: "Jane Austen",
                pages: 279,
                rating: 8,
                genres: ["classic", "romance"],
                reviews: [{ name: "elizabeth", body: "a delightful read" }, { name: "mr.darcy", body: "captivating characters" }]
            },
            {
                title: "The Catcher in the Rye",
                author: "J.D. Salinger",
                pages: 277,
                rating: 7,
                genres: ["fiction", "coming-of-age"],
                reviews: [{ name: "holden", body: "relatable and raw" }, { name: "phoebe", body: "a classic for a reason" }]
            },
            {
                title: "Harry Potter and the Sorcerer's Stone",
                author: "J.K. Rowling",
                pages: 309,
                rating: 9,
                genres: ["fantasy", "magic"],
                reviews: [{ name: "harry", body: "a magical journey" }, { name: "hermione", body: "captures the imagination" }]
            },
            {
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                pages: 180,
                rating: 8,
                genres: ["classic", "fiction"],
                reviews: [{ name: "gatsby", body: "a timeless tale of longing" }, { name: "daisy", body: "gripping and tragic" }]
            },
            {
                title: "The Hitchhiker's Guide to the Galaxy",
                author: "Douglas Adams",
                pages: 193,
                rating: 8,
                genres: ["science fiction", "comedy"],
                reviews: [{ name: "ford", body: "hilarious and thought-provoking" }, { name: "zaphod", body: "a wild ride through the universe" }]
            },
            {
                title: "The Da Vinci Code",
                author: "Dan Brown",
                pages: 454,
                rating: 7,
                genres: ["mystery", "thriller"],
                reviews: [{ name: "robert", body: "a gripping page-turner" }, { name: "sophie", body: "intriguing puzzles and twists" }]
            },
            {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                pages: 1178,
                rating: 10,
                genres: ["fantasy", "adventure"],
                reviews: [{ name: "aragorn", body: "epic in every sense" }, { name: "gollum", body: "precious, precious book" }]
            },
            {
                title: "The Hunger Games",
                author: "Suzanne Collins",
                pages: 374,
                rating: 8,
                genres: ["dystopian", "young adult"],
                reviews: [{ name: "katniss", body: "intense and thrilling" }, { name: "peeta", body: "couldn't put it down" }]
            },
            {
                title: "The Chronicles of Narnia",
                author: "C.S. Lewis",
                pages: 767,
                rating: 9,
                genres: ["fantasy", "adventure"],
                reviews: [{ name: "aslan", body: "a timeless classic for all ages" }, { name: "lucy", body: "magical and enchanting" }]
            },
            {
                title: "The Alchemist",
                author: "Paulo Coelho",
                pages: 197,
                rating: 8,
                genres: ["fiction", "philosophical"],
                reviews: [{ name: "santiago", body: "a journey of self-discovery" }, { name: "fatima", body: "inspiring and profound" }]
            },
            {
                title: "A Game of Thrones",
                author: "George R.R. Martin",
                pages: 694,
                rating: 9,
                genres: ["fantasy", "epic"],
                reviews: [{ name: "tyrion", body: "intrigue and betrayal at every turn" }, { name: "daenerys", body: "epic fantasy at its best" }]
            },
            {
                title: "The Picture of Dorian Gray",
                author: "Oscar Wilde",
                pages: 254,
                rating: 9,
                genres: ["classic", "philosophical"],
                reviews: [{ name: "dorian", body: "hauntingly beautiful" }, { name: "lord henry", body: "a masterpiece of wit and depth" }]
            },
            {
                title: "Brave New World",
                author: "Aldous Huxley",
                pages: 288,
                rating: 8,
                genres: ["dystopian", "science fiction"],
                reviews: [{ name: "bernard", body: "chillingly prescient" }, { name: "lenina", body: "a cautionary tale for our times" }]
            },
            {
                title: "The Martian",
                author: "Andy Weir",
                pages: 369,
                rating: 8,
                genres: ["science fiction", "adventure"],
                reviews: [{ name: "mark", body: "science meets survival in a gripping story" }, { name: "nasa", body: "a thrilling ride from start to finish" }]
            },
            {
                title: "The Kite Runner",
                author: "Khaled Hosseini",
                pages: 371,
                rating: 9,
                genres: ["fiction", "historical"],
                reviews: [{ name: "amir", body: "emotionally powerful and thought-provoking" }, { name: "hassan", body: "a story of redemption and forgiveness" }]
            },
            {
                title: "Moby-Dick",
                author: "Herman Melville",
                pages: 544,
                rating: 7,
                genres: ["classic", "adventure"],
                reviews: [{ name: "ishmael", body: "a timeless tale of obsession" }, { name: "ahab", body: "haunting and epic" }]
            }

        ]);

        return NextResponse.json({ message: "Books Created" }, { status: 201 });

    } else if (action === 'pagination') {

        let { page, limit } = rest;

        // Handle invalid page/limit values and provide defaults
        page = Math.max(1, parseInt(page) || 1);
        limit = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Limit to 100 for safety

        // Calculate skip offset based on page and limit
        const skip = (page - 1) * limit;

        try {
            // Find books with desired sorting (e.g., by date) and limit fields if needed
            const books = await Book.find({})
                .sort({ _id: -1 }) // Example sorting, adjust as needed
                .skip(skip)
                .limit(limit);

            // Count total books for accurate pagination info
            const totalBooks = await Book.countDocuments({});

            // Return paginated data with additional metadata
            let paginationCollection = {
                books,
                pagination: {
                    page,
                    limit,
                    totalPages: Math.ceil(totalBooks / limit),
                    totalItems: totalBooks,
                },
            };

            return NextResponse.json({ message: "Success", data: paginationCollection }, { status: 201 });
        } catch (error) {
            console.error(error);
            return { books: [], pagination: {}, error }; // Handle errors gracefully
        }

    } else if (action === 'sample') {

        return NextResponse.json({ message: "lalallala" }, { status: 200 });

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













