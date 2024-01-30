module.exports = () => (req, res, next) => {
    if(req.body) {
        for(let kye in req.body) {
            req.body[kye] = req.body[kye].trim()
        }
    }
    next();
}
