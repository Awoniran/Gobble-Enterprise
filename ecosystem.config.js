module.exports = {
   //  apps: [
   //     {
   //        script: 'server.js',
   //        watch: '.',
   //     },
   //     {
   //        script: './service-worker/',
   //        watch: ['./service-worker'],
   //     },
   //  ],

   apps: [
      {
         name: 'gobble-enterprise',
         script: 'server.js',
         env: {
            NODE_ENV: 'development',
         },
         env_production: {
            NODE_ENV: 'production',
         },
      },
   ],

   deploy: {
      production: {
         user: 'ubuntu',
         host: ['192.168.0.13', '192.168.0.14', '192.168.0.15'],
         ref: 'origin/master',
         repo: 'git@github.com:Awoniran/gobble-enterprise',
         path: '/var/www/my-repository',
         'post-deploy': 'npm install',
      },
   },
};
