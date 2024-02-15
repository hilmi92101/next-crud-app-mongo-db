//import connectMongoDB from "@/libs/mongodb";
import db from "@/libs/mongodb_v2";
import Book from "@/models/book";
import { NextResponse } from "next/server";

export async function POST(request) {

    await db.connectMongoDB();

    const { action } = await request.json();

    if(action === 'insertBook'){

        await insertBook();
        return NextResponse.json({ message: "Book Created" }, { status: 201 });

    } else if(action === 'insertManyBook'){

        await insertManyBook();
        return NextResponse.json({ message: "Books Created" }, { status: 201 });

    } else if(action === 'findOneBook'){

        let id = '65cd78dbb4906d8d65a87b5c';
        const book = await findOneBook(id);
        return NextResponse.json(
            { 
                message: "Book found",
                book: book

            },
            { status: 201 });

    } else if(action === 'findBookByTitlePattern'){

        //let titlePattern = { title: /The Color of Magic/ };
        let titlePattern = { title: /hilmi/ };
        const book = await findBookByTitlePattern(titlePattern);
        return NextResponse.json(
            { 
                message: "Book found",
                book: book

            },
            { status: 201 });

    } else if(action === 'findBookByAuthor'){

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

    } else if(action === 'findLatestBook'){

        const book = await findLatestBook();
        return NextResponse.json(
            { 
                message: "Book found",
                book: book

            },
            { status: 201 });

    } else if(action === 'findBookGreaterThan'){

        const book = await findBookGreaterThan({ 
            rating: { $gt: 6 }
        });
        return NextResponse.json(
            { 
                message: "Book found",
                book: book

            },
            { status: 201 });

    } else if(action === 'findButSelectFewColumn'){

        const book = await findButSelectFewColumn({});
        return NextResponse.json(
            { 
                message: "Book found",
                book: book

            },
            { status: 201 });

    } else if(action === 'findByIdV1'){

        
        const book = await Book.findOne({
            //_id: ObjectId('65cd790eb4906d8d65a87b5f')
            _id: '65cd78dbb4906d8d65a87b5c'
        });
        return NextResponse.json(
            { 
                message: "Book found",
                book: book

            },
            { status: 201 });

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
        {title: "The Light Fantastic 3", author: "Terry Pratchett 3", pages: 250, rating: 6, genres: ["fantasy"]},
        {title: "Dune 3", author: "Frank Herbert 3", pages: 500, rating: 10, genres: ["sci-fi", "dystopian"]}]
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
    return await Book.find(data, {title: 1, author: 1});
};













