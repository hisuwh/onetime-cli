function controllers() {
    var inquirer = require('inquirer');
    var utils = require('../utils');
    var config = require('../config');
    var props = ['domain', 'email'];

    function clear() {
        utils.log();
        utils.log('    [IMPORTANT]');
        utils.log('    Doing this will clear all of your saved password from onetime.');
        utils.log();
        var q = {
            type: 'confirm',
            name: 'sure',
            message: 'Are you sure you want to clear onetime config?'
        };
        inquirer.prompt(q, function (d) {
            if(!d.sure) return;

            config.clear();
        });
    }

    function show() {
        function showDomain(name, key) {
            var settings = config.readDomain(key, props);
            if(!settings) return;

            utils.log();
            utils.log('    ' + name);
            props.forEach(function (p) {
                utils.log('      ' + utils.pad(p, 10) + settings[p]);
            });
            utils.log();
        }

        showDomain('Harvest', 'harvest');
        showDomain('Target Process', 'tp');
    }

    return {
        show: show,
        clear: clear
    };
}

var cli = require('dastoor').builder;

cli.node('onetime.config', {
    help: 'manage onetime configuration'
});

cli.node('onetime.config.show', {
    controller: controllers.rebind('show'),
    help: 'show onetime configurations'
});

cli.node('onetime.config.clear', {
    controller: controllers.rebind('clear'),
    help: 'clear all onetime configurations'
});
