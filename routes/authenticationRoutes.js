const mongoose = require('mongoose');
const Account = mongoose.model('accounts');

module.exports = app => {
    //routes
    app.post('/account', async(req, res) => {
        
        console.log(req.body);

        const { rUsername, rPassword } = req.body;
        if(rUsername == null || rPassword == null) 
        {
            res.send("Invalid credentials");
            return;
        }

        var userAccount = await Account.findOne({username: rUsername});
        if(userAccount == null)
        {
            //create a new account
            console.log("Create new account...");

            var newAccount = new Account({
                username: rUsername,
                password: rPassword,

                lastAuthentication: Date.now()
            });
            await newAccount.save();

            res.send(newAccount);
            return;
        } else
        {
            if(rPassword == userAccount.password)
            {
                userAccount.lastAuthentication = Date.now();
                await userAccount.save();
                
                console.log("Retrieving account...");
                res.send(userAccount);
                return;
            }
        }
        res.send("Invalid credentials");
        return;
    });
}