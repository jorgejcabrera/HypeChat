module.exports = (sequelize, type) => {
    return sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firtName: type.STRING,
        lastName: type.STRING,
        email: type.STRING,
        pwd: type.STRING
    })
}