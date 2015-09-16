import Ember from 'ember';

export default Ember.Component.extend({
    content: null,

    displayContent: [],

    selectedValue: Ember.computed.alias('value'),

    targetProperty: '',

    didInitAttrs() {
        this._super(...arguments);
        var content = this.get('content'),
            optionValuePath = this.get('optionValuePath');

        if (!content) {
            this.set('content', []);
        }

        if (optionValuePath) {
          this.get('content').forEach(item => {
            this.get('displayContent').push(item.get(optionValuePath));
          });
        }
        else {
          this.set('displayContent', content);
        }
    },

    actions: {
        change() {
            const selectedEl = this.$('select')[0];
            const selectedIndex = selectedEl.selectedIndex;
            const content = this.get('content');
            const selectedValue = content[selectedIndex];

            this.set('selectedValue', selectedValue);
            this.set('value', selectedValue);
        }
    }
});
