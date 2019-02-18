const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');


const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
 } = graphql;


//Find all data query sample
// {
//     books{
//         name 
//         id
//     }
// }


// Create schema for book table
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () =>({
        id: { type: GraphQLID },
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                console.log(parent);
                return Author.findById(parent.authorId);

            }
        }
    })

});

// Create schema for author table
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () =>({
        id: { type: GraphQLID },
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({
                    authorId: parent.id
                })
            }
        }
    })

});

//Create Query using created schema tables
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: {type: GraphQLID}},
            resolve(parent, args){
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID}},
            resolve(parent, args){
                // return _.find(authors, {id: args.id})
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return books;
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                // return authors;
                return Author.find({});
            }
        }
    }
});

// Mutation is for Adding, deleting and updating

// sample front-end query

// mutation {
//     addBook(name: "A Random Book", genre: "Fantasy", authorId: "$52601230541230"){
//         //return data after successful mutation query
//         name
//         genre
//         authorId
//     }
// }

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: (GraphQLString)},
                age: { type: (GraphQLInt) }
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre:{type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book = new Book ({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });

                return book.save();
            }
        }
    }
});



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});