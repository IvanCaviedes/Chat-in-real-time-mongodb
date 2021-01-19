const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ivancaviedes:99120900389@cluster0.hj9hk.mongodb.net/chat?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(db => console.log('db connected'))
  .catch(err => console.log(err));