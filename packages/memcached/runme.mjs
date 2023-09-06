import Memcached from 'memcached';

const memc = new Memcached("web2.test.flash-global.net:11211");
memc.get('somekey', (err, data) => {
    console.log('memcache results:', err, data);
    memc.flush((err) => {
        console.log('memcache flused', err);
    });
    memc.end();
});
