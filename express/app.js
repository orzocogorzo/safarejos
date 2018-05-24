const fs = require('fs-extra');
const path = require('path');

const webpack = require('webpack');

const config = require('./webdev.config');
const envConfig = new Object();

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
// const livereload = require('express-livereload');
const reload = require('./liveserver');
const open = require("open");

var MongoClient = require('mongodb').MongoClient;
var database;


function setupConfig(){
  config.api.set('output',config.output);
  config.api.set('entry',config.entry);
  config.api.set('module.rules', config.module.rules);
  config.api.set('plugins', config.plugins);
  config.api.set('resolve', config.resolve);
  // config.api.set('context', path.resolve(__dirname));
};

var LISTENING=false;

function flagMatcher(flag){
  let name,val;
  [name,val] = flag.split('=');
  envConfig[name.replace(/\-+/,'')] = val || true;
}

function registerEnvironment( callback ) {
  const environments =  require(config.envFile); //require('../environments.js');

  if (!environments[envConfig["env"]]) {
    console.warn("Not recognized environment declaration. Working with default config");
  };
  
  envConfig["env"] = env = environments[envConfig["env"]] || { 
    name: 'development',
    apiURL: 'data/json'
  };

  fs.writeFile( path.resolve( config.distDir, 'environment.js' ), 'window.environment='+JSON.stringify(env)+';', function( err ) {
    if ( err ) {
      console.log('Error on writing env dist file\n');
      return;
    };
    console.log('Environment variable registered with exit. Defined as ' + env.name);
    callback();
  });
}

function registerLivereload( register ) {
  let scriptContent = register ? 'document.write(\'<script src="http://\'\n\t+ (location.host || \'localhost\').split(\':\')[0]\n\t+ \':35729/livereload.js"></\'\n\t+ \'script>\')' : '';
  fs.writeFile( path.resolve( config.distDir, 'livereload.js' ), scriptContent, function( err ) {
    if ( err ) {
      console.log( 'Error while writing the livereload script\n' );
      return;
    };
    console.log( 'Livereload script registered!' );
  });
}

function setupPWA( ) {
  fs.readFile( path.resolve( __dirname, '../pwa/manifest.json' ), 'utf-8', ( err, data ) => {
    if ( err ) throw err;
    fs.writeFile( path.resolve( config.distDir, 'manifest.json' ), data, function( err ) {
      if ( err ) throw err;
      fs.copy( path.resolve( __dirname, '../pwa/icons' ), path.resolve( config.distDir, 'icons' ), err => {
        if ( err ) throw err;
        fs.readFile( path.resolve( __dirname, '../pwa/service-worker.js' ), 'utf-8', ( err, data ) => {
          if ( err ) throw err;
          fs.writeFile( path.resolve( config.distDir, 'service-worker.js' ), data, function( err ) {
            if ( err ) throw err;
            console.log( 'PWA setted up!' );
          });
        });
      });
    });
  });
}

function removeMainHash() {
  fs.readFile( path.resolve( config.distDir, 'index.html' ), 'utf-8', ( err, data ) => {
    if ( err ) throw err;
    data = data.replace(/main.js[^"]+/,'main.js')
    fs.writeFile( path.resolve( config.distDir, 'index.html' ), data, err => {
      if ( err ) throw err;
      console.log( 'Hash removed!' );
    });
  });
}

function buildRegex( urlParam ){
  let basehref = envConfig.basehref || envConfig.env.basehref || null
  if ( urlParam ){
    return new RegExp("^\/" + (basehref && (basehref + "/" + urlParam)
    || urlParam) + "\/(.*)");
  } else {
    return new RegExp("^" + (basehref && ("\/" + basehref) || '') + "(.*)");
  }
};

function request( host, req, res, filePath, redirect ) {
  if ( !host || host === "localhost" || host === "local" ) {
    filePath = path.resolve( config.root, filePath );
    fs.exists( filePath, ( exists ) => {
      if ( exists ) {
        var stats = fs.statSync( filePath );
        if (!stats.isFile()){
          if (redirect){
            filePath = path.resolve( config.root, config.distDir, 'index.html' );
          } else {
            res.sendStatus(404);
            return;
          }
        } else {
          fs.readFile( filePath, 'utf-8', ( err, data ) => {
            if ( err ) throw err;
            res.send( data );
          }); 
        }
      } else {
        if (redirect) {
          filePath = path.resolve( config.root, config.distDir, 'index.html' );
        } else {
          res.sendStatus(404);
          return;
        }
      };
    });
  } else {
    // filePath = filePath.replace(new RegExp(`${config.dataDir}\/`),'');
    let req = http.get( host + '/' + filePath, (_res) => {
      _res.setEncoding("utf8");
      let body = "";
      _res.on("data", data => {
        body += data;
      }).on("end", () => {
        res.send( body );
      });
    });

    req.on('error', function(e) {
      console.log('ERROR: ' + e.message);
    });
  }
};

function response( host, req, res, filePath, redirect ) {
  if ( envConfig.middleware ) {
    let middleware = require( path.resolve( __dirname, 'middlewares', envConfig.middleware));
    middleware( req, res, ( _req, _res ) => {
      request( host, _req, _res, filePath, redirect );
    });
  } else {
    request( host, req, res, filePath, redirect );
  }
}

function getMongoDB() {
  var URI = process.env.MONGODB_URI; 
  MongoClient.connect(URI, function(err, db) {
    if (err) throw err;
    database = db.db("heroku_k9l4gvz8");
  });
}

function setupApp() {
  var app = express();
  app.use(bodyParser.json());
  app.get('/', ( req, res ) => {
    res.setHeader('Content-Type','text/html');
    response( envConfig.env.host, req, res, config.distDir + '/index.html', false );
  });

  app.get('/environment.js', ( req, res ) => {
    res.setHeader('Content-Type','text/javascript');
    response( envConfig.env.host, req, res, config.distDir + '/environment.js', false );
  });

  app.get('/main.js', ( req, res ) => {
    res.setHeader('Content-Type','text/javascript');
    response( envConfig.env.host, req, res, config.distDir + '/main.js', false );
  });

  app.get('/service-worker.js', ( req, res ) => {
    res.setHeader('Content-Type','text/javascript');
    response( envConfig.env.host, req, res, config.distDir + '/service-worker.js', false );
  });

  app.post('/bulk', ( req, res ) => {
    if ( database ) {
      database.collection('responses').insertOne( req.body, function( err, source ) {
        if ( err ) throw err;
        res.sendStatus(200);
      });
    } else {
      console.log( req.body );
      res.sendStatus(200);
    }
  });

  app.get(buildRegex(), ( req, res ) => {
    var redirectPath = req.params[0].replace(new RegExp(`\/${envConfig.env.basehref}\/`),'');
    if ( !envConfig.env.host || envConfig.env.host === "localhost" || envConfig.env.host === "local" ) {
      if (redirectPath.indexOf(envConfig.env.apiURL) >= 0) {
        // Local API ROUTE
        redirectPath = redirectPath.replace(new RegExp(`\/${envConfig.env.apiURL}\/`),'');
        response( envConfig.env.host, req, res, config.dataDir + '/' + redirectPath, false );
      } else {
        response( envConfig.env.host, req, res, config.distDir + redirectPath, !Boolean(redirectPath) || redirectPath === '/' );
      }
    } else {
      response( envConfig.env.host, req, res, redirectPath, !Boolean(redirectPath) || redirectPath === '/' );
    }
  });

  app.set('port', process.env.PORT || envConfig.port || 8000);

  return app;
;}

function main(){
  // register env flags as config object
  process.argv.slice(2).forEach(function (val, index, array) {
    flagMatcher(val);
  });
  
  var compiler;

  if ( envConfig["dev"] ) {

    if ( !envConfig["dev"] ) {
      console.warn( "Unrecognized target action. Fired development mode by default" );
    }

    registerLivereload();

    function callback(){
      const app = setupApp();
      
      config.api.set("mode", "development");

      setupConfig();

      function startApp(){
        if ( LISTENING ){ return }
        // Serve the files on port 8000.
        server = http.createServer( app );
        
        // server livereload
        reload( app );

        // browser livereload
        // livereload( app, { watchDir: config.srcDir });

        server.listen( app.get('port'), function () {
          console.log( 'Webpack watching for changes and app listening on port 8000' );
          !LISTENING && open("http://localhost:8000", "chromium-browser");
          LISTENING=true;
        });
      }

      compiler = webpack( config.api.get() ) //, (err, stats) => {
      //   if (err) throw err;
      //   startApp();
      // });

      compiler.watch({
        aggregateTimeout: 300,
        poll: undefined
      }, ( err, stats ) => {
        if ( err ) throw err;
        startApp();
        console.log( new Date().toLocaleTimeString() + ": webpack build process ends with exit status" );
      });
    }

  } else if ( envConfig[ "build" ] ) {
    function callback() {
      
      config.api.set( "mode", envConfig["prod"] && "production" || "development" );

      registerLivereload( false );
      setupPWA();

      setupConfig();

      compiler = webpack( config.api.get(), ( err, stats ) => {
        if (err) throw err;
        removeMainHash();
        console.log("Webpack build ends with exit status");
      });
    }
  } else if ( envConfig["server"] ) {
    
    try {
      fs.mkdirSync( config.distDir );
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

    function callback() {
      const app = setupApp();
      getMongoDB();
      port = process.env.PORT || app.get.port || 8000;
      registerLivereload( false );
      setupPWA();

      setupConfig();

      config.api.set("mode", "production");

      compiler = webpack( config.api.get(), ( err, stats ) => {
        if (err) throw err;
        removeMainHash();
        console.log("Webpack build ends with exit status");
        server = http.createServer( app );

        server.listen( port, function () {
          console.log( 'Node server listening on port ' + port );
        });
      });
    }
  }

  registerEnvironment(callback);
}

// run the application
main();
