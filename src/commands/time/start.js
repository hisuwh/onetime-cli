function controller(args) {
    var extend = require('extend');
    var utils = require('../../utils');
    var inquirer = require('inquirer');
    var harvest = require('../../api/harvest')();
    var tpClient = require('../../api/tp')();
    var base = require('./_base');
    var aliasStore = require('./alias/_store');
    var validation = require('../../utils/validation');

    function start(args) {
        if(args.p){
            args.project = args.p;
            delete args.p;
        }

        base.captureNewTime(args, tpClient, function (result) {
            base.captureHourAndConfirm(args, function (r2) {
                var notes = [args.notes, result.notes].compact().join('\n');
                extend(result, r2, args, { notes: notes });
                if(!result.confirm) return;
                base.createTime(result);
            });
        });
    }

    var alias = args.a || args.alias;
    if(alias){
        aliasStore.get(alias, function (err, data) {
            if(err) return utils.log.err(err);

            extend(args, data);
            start(args);
        });
    }
    else {
        start(args);
    }
}

require('dastoor').builder
.node('onetime.time.start', {
    terminal: true,
    controller: controller
})
.help({
    description: 'start a timesheet',
    options: [{
        name: '-p, --project',
        description: 'harvest project id'
    }, {
        name: '--tp',
        description: 'target process task id'
    }, {
        name: '-a, --alias',
        description: 'alias name to start the time with'
    }]
});
