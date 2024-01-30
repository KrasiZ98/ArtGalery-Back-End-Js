const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /^https?:\/\/.+$/i;

const postSchema = new Schema({
    title: { type: String, required: true, unique: true, minlength: [6, 'The Title should be at least 6 characters'] },
    technique: { type: String, required: true, maxlength: [15, 'The Painting technique should be a maximum of 15 characters long.'] },
    picture: {
        type: String, required: true, validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'The Home Image should starts with http:// or https://.',
        }
    },
    certificate: { type: String, required: true, },
    shared: { type: [Types.ObjectId], ref: 'User', default: [] },
    owner: { type: Types.ObjectId, required: true, ref: 'User' },
    sharedUsers: { type: Array, required: true, default: [] },
    author: {type: String, required: true},
});

postSchema.index({ title: 1 }, {
    collation: {
        locale: 'en',
        strength: 2,
    }
});

const Post = model('Post', postSchema);

module.exports = Post;

// • The Title should be a minimum of 6 characters long.
// • The Painting technique should be a maximum of 15 characters long.
// • The Certificate of authenticity there must be value "Yes" or "No".
// • The Art picture should start with http:// or https://.