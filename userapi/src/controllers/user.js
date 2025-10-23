const db = require('../dbClient')

module.exports = {
  create: (user, callback) => {
    // Check parameters
    if(!user.username)
      return callback(new Error("Wrong user parameters"), null)
    // Create User schema
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    }
    // Save to DB
    // TODO check if user already exists
    db.hmset(user.username, userObj, (err, res) => {
      if (err) return callback(err, null)
      callback(null, res) // Return callback
    })
  },

  getUser: (username, callback) => {
    db.hgetall(username, (err, user) => {
      if (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', err);
        callback(new Error("Utilisateur pas trouve"), null);
      } else if (user) {
        console.log('Utilisateur trouvé :', user);
        callback(null, user);
      } else {
        console.log('Utilisateur qui n existe pas.');
        callback(new Error("Utilisateur pas trouve"), null);
      }
    });
  },
  // TO DO
  get: (username, callback) => {
  
    db.hgetall(username, (err, user) => {
    if (err) return callback(err, null)
    if (!user) return callback(new Error("User non trouve"), null)
    callback(null, user)
  })
  }
}
