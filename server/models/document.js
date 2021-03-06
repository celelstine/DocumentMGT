module.exports = (sequelize, DataTypes) => {
  const document = sequelize.define('document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          arg: [2, 255],
          msg: 'should contain between 2 to 255 character'
        }
      }
    },
    synopsis: {
      type: DataTypes.STRING,
      allowNull: true
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          arg: [2, 5000],
          msg: 'should contain between 2 to 5000 character'
        }
      }
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    accessRight: {
      type: DataTypes.STRING,
      allowNull: true
    },
    owner: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
        as: 'userId',
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate(models) {
        // has an owner
        document.belongsTo(models.user, {
          foriegnKey: 'userId',
          onDelete: 'CASCADE',
          as: 'userId'
        });
        // has an owner
        document.belongsTo(models.accessRight, {
          foriegnKey: 'accessRightId',
          onDelete: 'CASCADE',
        });
      }
    }
  });
  return document;
};
