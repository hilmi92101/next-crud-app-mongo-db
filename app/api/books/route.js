//import connectMongoDB from "@/libs/mongodb";
import db from "@/libs/mongodb_v2";
import Book from "@/models/book";
import { NextResponse } from "next/server";

export async function POST(request) {

    await db.connectMongoDB();

    const { action } = await request.json();
    if(action === 'insertBook'){
        await insertManyBook();
    } else {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }

    return NextResponse.json({ message: "Book Created" }, { status: 201 });
}

const insertManyBook = async () => {
    await Book.insertMany([{title: "The Light Fantastic 3", author: "Terry Pratchett 3", pages: 250, rating: 6, genres: ["fantasy"]}, {title: "Dune 3", author: "Frank Herbert 3", pages: 500, rating: 10, genres: ["sci-fi", "dystopian"]}]);
};






