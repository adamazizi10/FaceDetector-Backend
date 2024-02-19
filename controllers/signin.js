const handleSignIn = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if(!password || !email)
    {
        res.status(400).json('incorrect form submission')
    }

    db.select('email', 'hash')
      .from('login')
      .whereRaw(`LOWER(email) LIKE ?`, email.toLowerCase())
      .then(data => {
        const isPasswordValid = bcrypt.compareSync(password, data[0].hash);
        if(isPasswordValid) {
           return db.select('*').from('users').whereRaw(`LOWER(email) LIKE ?`, email.toLowerCase())
            .then(user =>  res.json(user[0]))
            .catch(err => res.status(400).json('unable to login!'))
        } 
        else{ res.status(400).json('Wrong email or password')}
    })
    .catch(err => res.status(400).json('not found!'))
}

export default {handleSignIn};