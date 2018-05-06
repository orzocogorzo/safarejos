const fs = require('fs');
const path = require('path');

const webpack = require('webpack');

const config = require('./webdev.config');
const envConfig = new Object();

const http = require('http');
const express = require('express');
// const livereload = require('express-livereload');
const reload = require('./liveserver');
const open = require("open");

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

function registerEnvironment(callback){
  const environments =  require(config.envFile); //require('../environments.js');

  if (!environments[envConfig["env"]]) {
    console.warn("Not recognized environment declaration. Working with default config");
  };
  
  envConfig["env"] = env = environments[envConfig["env"]] || { 
    name: 'development',
    apiURL: 'data/json'
  };

  fs.writeFile( path.resolve( config.distDir, 'environment.js' ), ' window.environment='+JSON.stringify(env)+';', function( err ) {
    if ( err ) {
      console.log('Error on writing env dist file\n');
      return;
    };
    console.log('Environment variable registered with exit. Defined as ' + env.name);
    callback();
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
  // console.log(host);
  if ( !host || host === "localhost" || host === "local" ) {
    filePath = path.resolve( config.root, filePath );
    fs.exists( filePath, ( exists ) => {
      if (exists){
        var stats = fs.statSync( filePath );
        if (!stats.isFile()){
          if (redirect){
            filePath = path.resolve( config.root, config.distDir, 'index.html' );
          } else {
            res.sendStatus(404);
            return;
          }
        };
      } else {
        if (redirect) {
          filePath = path.resolve( config.root, config.distDir, 'index.html' );
        } else {
          res.sendStatus(404);
          return;
        }
      };
      fs.exists( filePath, ( exists ) => {
        if (exists) {
          fs.readFile( filePath, 'utf-8', ( err, data ) => {
            res.send( data );
          });
        } else {
          res.sendStatus(404);
          return;
        }
      });
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

function setupApp(){
  var app = express();

  app.get('/', ( req, res ) => {
    response( 'localhost', req, res, config.distDir + '/index.html', false );
  });

  app.get('/environment.js', ( req, res ) => {
    response( 'localhost', req, res, config.distDir + '/environment.js', false );
  });

  app.get('/main.js', ( req, res ) => {
    response( 'localhost', req, res, config.distDir + '/main.js', false );
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

  app.set('port', envConfig.port || 8000);

  return app;
;}

function main(){
  // register env flags as config object
  process.argv.slice(2).forEach(function (val, index, array) {
    flagMatcher(val);
  });
  
  var compiler;

  if ( envConfig["dev"] || !envConfig["build"] ) {

    if ( !envConfig["dev"] ) {
      console.warn( "Unrecognized target action. Fired development mode by default" );
    }

    function callback(){
      const app = setupApp();
      
      // config.api.set("watch", true);
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
      compiler = webpack( config.api.get() ); //, (err, stats) => {
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

      setupConfig();

      compiler = webpack( config.api.get(), ( err, stats ) => {
        if (err) throw err;
        console.log("Webpack build ends with exit status");
      });
    }
  }

  registerEnvironment(callback);
}

// run the application
main();
