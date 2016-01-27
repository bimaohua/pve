Ext.define('PVE.qemu.ProcessorInputPanel', {
    extend: 'PVE.panel.InputPanel',
    alias: 'widget.PVE.qemu.ProcessorInputPanel',

    onGetValues: function(values) {
	var me = this;
	me.cpu.cputype = values['cputype'];
	return {
	    cpu: PVE.Parser.printQemuCpu(me.cpu)
	};
    },

    initComponent : function() {
	var me = this;

	me.column1 = [
	    {
		xtype: 'numberfield',
		name: 'sockets',
		minValue: 1,
		maxValue: 4,
		value: '1',
		fieldLabel: gettext('Sockets'),
		allowBlank: false,
		listeners: {
		    change: function(f, value) {
			var sockets = me.down('field[name=sockets]').getValue();
			var cores = me.down('field[name=cores]').getValue();
			me.down('field[name=totalcores]').setValue(sockets*cores);
		    }
		}
	    },
	    {
		xtype: 'numberfield',
		name: 'cores',
		minValue: 1,
		maxValue: 128,
		value: '1',
		fieldLabel: gettext('Cores'),
		allowBlank: false,
		listeners: {
		    change: function(f, value) {
			var sockets = me.down('field[name=sockets]').getValue();
			var cores = me.down('field[name=cores]').getValue();
			me.down('field[name=totalcores]').setValue(sockets*cores);
		    }
		}
	    },
	    {
		xtype: 'pvecheckbox',
		fieldLabel: gettext('Enable numa'),
		name: 'numa',
		uncheckedValue: 0,
	    },

	];


	me.column2 = [
	    {
		xtype: 'CPUModelSelector',
		name: 'cputype',
		value: '',
		fieldLabel: gettext('Type')
	    },
	    {
		xtype: 'displayfield',
		fieldLabel: gettext('Total cores'),
		name: 'totalcores',
		value: '1'
	    }

	];

	me.callParent();
    }
});

Ext.define('PVE.qemu.ProcessorEdit', {
    extend: 'PVE.window.Edit',

    initComponent : function() {
	var me = this;
	
	var ipanel = Ext.create('PVE.qemu.ProcessorInputPanel')

	Ext.apply(me, {
	    subject: gettext('Processors'),
	    items: ipanel
	});

	me.callParent();

	me.load({
	    success: function(response, options) {
		var value = response.result.data['cpu'];
		var cpu = PVE.Parser.parseQemuCpu(value);
		ipanel.cpu = cpu;
		me.setValues({ cputype: cpu.cputype });
	    }
	});
    }
});
