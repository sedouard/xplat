import Ember from 'ember';
import filesize from '../utils/filesize';
import stringResources from '../utils/string-resources';
import Notification from '../models/notification';
/**
 * Controller for the list of blobs, used together with the {{each}} helper
 */
export default Ember.Controller.extend({
    needs: ['notifications'],
    /**
     * Returns the filesize in a format that humans can read
     */
    prettySize: function () {
        var size = this.get('model.size');
        return filesize(size).human('si');
    }.property('model.size'),

    notifications: Ember.computed.alias('controllers.notifications'),

    isLocked: function () {
        return this.get('model.leaseState') !== 'available' || this.get('model.leaseStatus') === 'locked';
    }.property('model.leaseState', 'model.leaseStatus'),
    
    isPageBlob: Ember.computed.match('model.blobType', /PageBlob/),

    showProperties: true,

    ranges: function () {
        var res = this.get('model').getPageRanges()
        .then(ranges => {
            console.log(ranges);
        })
        .catch(err => {
            console.log(err);
        });
    }.property(),

    selectedPage: '',

    pageData: '',

    actions: {
        /**
         * Save properties for Blob model
         */
        setProperties: function () {
            if (this.get('isLocked')) {
                return;
            }

            this.get('notifications').addPromiseNotification(this.get('model').save(),
                Notification.create({
                    type: 'UpdateBlobProperties',
                    text: stringResources.updateBlobPropsMessage(this.get('model.name'))
                })
            );
        },

        /**
         * Clears unsaved attributes on the Blob model
         */
        discardUnsavedChanges: function () {
            this.get('model').rollback();
        },
        
        actionProperties: function () {
            this.get('showProperties') ? this.set('showProperties', false) : this.set('showProperties', true);
        },
        
        actionPages: function () {
            this.get('showProperties') ? this.set('showProperties', false) : this.set('showProperties', true);
        },

        selectPage: function (page) {
            this.set('selectedPage', page);
            this.set('pageData', '');
            var self = this;
            console.log
            this.get('model').getPageData(page, page + 511)
            .then(readStream => {
                readStream.on('data', nativeBuffer => {
                    console.log(nativeBuffer);
                    for (let i in nativeBuffer) {
                        if (i % 1 !== 0) {
                            continue;
                        }
                        let pageData = this.get('pageData'),
                            hex = nativeBuffer[i].toString(16);
                        hex.length < 2 ? hex = '0'+hex : hex = hex;
                        this.set('pageData', pageData + hex + ' ');
                    }
                });
            })
            .catch(err => {
                console.log('err!');
                console.log(err);
            })
        }
    }
});
