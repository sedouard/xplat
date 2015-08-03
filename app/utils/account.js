import Ember from 'ember';

export default {
    /**
     * Get the currently active account
     * @param  {DS.Store} store
     * @return {Promise}
     */
    getActiveAccount: function (store) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
            var accounts = store.all('account'),
                length = accounts.get('length'),
                i = 0;
            accounts.forEach(function (account) {
                if (account.get('active') === true) {
                    return Ember.run(null, resolve, account);
                }
                i += 1;
                if (i >= length) {
                    return Ember.run(null, reject, 'could not find any active accounts');
                }
            });
        });
    },

    getBlobService: function (store, azureStorageModule) {
        return this.getActiveAccount(store).then(function (account) {
            return azureStorageModule.createBlobService(account.get('name'), account.get('key'));  
        });
    },

};
