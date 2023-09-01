import mongoose from 'mongoose';
const { Schema } = mongoose;

const contact = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required!'],
    },
    email: {
      type: String,
      required: [true, 'E-mail is required!'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required!'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const Contact = mongoose.model('contact', contact);

export default Contact;
