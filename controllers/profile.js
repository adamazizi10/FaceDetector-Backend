const handleProfile = (req, res, db, bcrypt) =>{
    const { id } = req.params;
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password)
    const newEmail = email.toLowerCase();

    const updateInfoWithPassword = () => {
        db.transaction(trx => {
            trx.update({
                hash: hash,
                email: email
            })
                .where({id})
                .into('login')
                .returning('*')
                .then(info => {
                    return trx('users')
                        .returning('*')
                        .where({id})
                        .update({
                            name: name,
                            email: info[0].email
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

    const updateInfoWithoutPassword = () => {
        db.transaction(trx => {
            trx.update({
                email: email
            })
                .where({id})
                .into('login')
                .returning('email')
                .then(email => {
                    return trx('users')
                        .returning('*')
                        .where({id})
                        .update({
                            name: name,
                            email: email[0].email
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



    const exisitingEmailCheck = (dbEmail) => {
    db.select('email')
    .from('users')
    .whereRaw(`LOWER(email) LIKE ?`, newEmail)
    .returning('email')
    .then(data => {
        if (dbEmail === newEmail) //email exists
        {
            res.status(400).json('Error when registering')
        }
        else {
            updateInfoWithPassword()
        }

    });
    }

    db.select('email')
    .from('users')
    .where('id', '=', id)
    .returning('email')
    .then(data => {
        const converetedDBEmail = data[0].email.toLowerCase()
        if (email.length !== 0) {
            if(converetedDBEmail === newEmail)
            {
                updateInfoWithPassword()
            }
            else
            {
                exisitingEmailCheck(converetedDBEmail)
            }
        }
        else{
            res.status(400).json('Registration incomplete')
        }
       
    })

}   

export default {handleProfile};

