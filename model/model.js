const mongoose = require('mongoose');
const Joi = require('joi');

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email_address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    message: {
        type: String
    },
    ServiceCompleted: {
        type: Boolean,
        default: false
    }
});

const userModel = mongoose.model('OnClick', userSchema);


const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.base': 'Name should be a string',
            'any.required': 'Please enter in proper format'
        }),
        email_address: Joi.string().email().required().custom((value, helpers) => {
            if (!value.endsWith('@gmail.com')) {
                return helpers.message('Email must be a Gmail address');
            }
            return value;
        }).messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Please enter the email id'
        }),
        phone: Joi.number().required().messages({
            'number.base': 'Phone should be a number',
            'any.required': 'Phone number is required'
        }),
        category: Joi.string().required().messages({
            'string.base': 'Category should be a string',
            'any.required': 'Category is required'
        }),
        date: Joi.date().required().messages({
            'date.base': 'Date should be a valid date',
            'any.required': 'Date is required'
        }),
        message: Joi.string().optional().messages({
            'string.base': 'Message should be a string'
        })
    });

    return schema.validate(user);
};

module.exports = {
    userModel,
    validateUser
};
