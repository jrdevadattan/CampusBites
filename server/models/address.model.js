import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    hostelName : {
        type : String,
        required : [true, "Hostel name is required"],
        default : ""
    },
    roomNumber : {
        type : String,
        required : [true, "Room number is required"],
        default : ""
    },
    mobile : {
        type : Number,
        default : null
    },
    status : {
        type : Boolean,
        default : true
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        default : ""
    }
},{
    timestamps : true
})

const AddressModel = mongoose.model('address',addressSchema)

export default AddressModel