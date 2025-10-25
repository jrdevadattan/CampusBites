import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    image : {
        type : Array,
        default : []
    },
    category : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'category'
        }
    ],
    subCategory : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'subCategory'
        }
    ],
    unit : {
        type : String,
        default : ""
    },
    stock : {
        type : Number,
        default : null
    },
    price : {
        type : Number,
        default : null
    },
    discount : {
        type : Number,
        default : null
    },
    description : {
        type : String,
        default : ""
    },
    more_details : {
        type : Object,
        default : {}
    },
    publish : {
        type : Boolean,
        default : true
    }
},{
    timestamps : true
})

// Ensure autoIndex is enabled so Mongoose builds indexes in dev/local
productSchema.set('autoIndex', true)

// Create a proper text index with weights for name and description
productSchema.index(
    { name: 'text', description: 'text' },
    { weights: { name: 10, description: 5 }, name: 'ProductTextIndex' }
)


const ProductModel = mongoose.model('product',productSchema)

export default ProductModel