Package = require('auto-package').scheme('1.0');

Package.name = 'menagerie-client';
Package.versionFile();
Package.author = 'John Manero <john.manero@gmail.com>';
Package.description = 'Client library for https://github.com/jmanero/menagerie';

Package.depends('aws-sdk', '2.x');
Package.depends('libuuid', '0.1.x');
Package.depends('nconf', '0.7.x');
Package.depends('qs', '2.4.x');
Package.depends('semver', '4.x');

Package.githubRepo('jmanero/menagerie-client');

Package.keyword('menagerie');
Package.keyword('distributed');
Package.keyword('versioned');
Package.keyword('service');
Package.keyword('directory');

Package.license = 'MIT';
