const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password)
    const newEmail = email.toLowerCase();

    const registerInfo = () => {
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
                .into('login')
                .returning('*')
                .then(info => {
                    return trx('users')
                        .returning('*')
                        .insert({
                            name: name,
                            email: info[0].email,
                            joined: new Date(),
                            id: info[0].id
                        })
                        .then(user => {
                            res.json(user[0]);
                        })
                        .catch(err => res.status(400).json('Cannot Register'))
                })
                .then(trx.commit)
                .catch(trx.rollback)
        })
            .catch(err => res.status(400).json('unable to register'))
    }

    db.select('email')
        .from('users')
        .whereRaw(`LOWER(email) LIKE ?`, newEmail)
        .returning('email')
        .then(data => {
            if (data.length !== 0) {
                if (data[0].email.toLowerCase() === newEmail) //email exists
                {
                    res.status(400).json('Error when registering')
                }
            }
            else {
                registerInfo()

            }

        });
}
export default { handleRegister };