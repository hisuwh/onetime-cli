var inquirer = require('inquirer');
var base = require('../_base');
var utils = require('../../../utils');
var store = require('./_store');

module.exports = {
    $t: true,
    _: function (args) {
        var name = args._[0];
        store.exists(name, function (err, e) {
            if(err) return utils.log.err(err);
            if(!e) return utils.log.err('Alias `'+name+'` doesnot exist.');

            store.remove(name, function (err) {
                if(err) return utils.log.err(err);
            });
        });
    }
};