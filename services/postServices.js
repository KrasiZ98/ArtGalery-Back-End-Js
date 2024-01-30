const Post = require("../models/Post");
const User = require("../models/User");

async function getAllPost() {
    return Post.find({}).lean();
}

async function getPostById(id) {
    return await Post.findById(id).lean();
}

async function create(post) {
    await Post.create(post);
}

async function update(id, post) {
    const result = await Post.findById(id);

    result.title = post.title;
    result.technique = post.technique;
    result.picture = post.picture;
    result.certificate = post.certificate;

    await result.save();
}

async function deleteById(id) {
    await Post.findByIdAndDelete(id);
}

async function sharedPublication(postId, userId) {
    const post = await Post.findById(postId);
    const shareUsers = await User.findById(userId);

    if(post.shared.toString().includes(userId)) {
        throw new Error('Cannot share twice');
    }

    post.shared.push(userId);
    post.sharedUsers.push(shareUsers);
    await post.save();
}

async function getByUserId(userId) {
    return await User.findById(userId).lean();
    
}

async function getPostByUserId(userId) {
    return Post.find({shared: userId}).lean();;
    
}

module.exports = {
    getAllPost,
    getPostById,
    create,
    update,
    deleteById,  
    sharedPublication,
    getPostByUserId,
    getByUserId
}