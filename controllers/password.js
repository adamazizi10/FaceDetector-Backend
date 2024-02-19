const handlePassword = (req, res, db, bcrypt) => {
    const { id } = req.params;
    const { password } = req.body;
    const hash = bcrypt.hashSync(password)
    db.select('hash')
    .from('login')
    .where({id})
    .returning('hash')
    .then(data => {
        const isPasswordSame = bcrypt.compareSync(password, data[0].hash);
        if(isPasswordSame){
            res.status(400).json('unable to continue') //same pass
        }
        else if(!isPasswordSame){
            db('login')
            .where({id})
            .update({ 
                hash: hash
            })
            .then(data => {
                res.json('success')})
            .catch(err => res.json('failed'))
        }
    })
    .catch(err => res.status(400).json('cannot proccess'))

}

export default {handlePassword}