const baseSubsection = (function(){

  // private code block
  const Template = (function(){
    return {
      name: "base-subsection",
      modelName: "base-subsection",
      props: [ "offsetW", "offsetH", "visible", "section", "subsection", "active" ],
      methods: (function() {
        return {
          isReady() {
            let ready = Object.keys(this.$data).reduce(( m, k ) => {
              if ( k[0] != 'h_' ) {
                m = m && this.$data[k] != undefined;
                return m;
              } else {
                return m;
              }
            }, true );
      
            if ( ready ) {
              this.$emit("im-ready", this.h_modelName, JSON.parse(JSON.stringify(this.getData())));
            }
            return ready;
          },
          getData() {
            return Object.keys( this.$data ).reduce(( m, k ) => {
              if ( k.slice(0,2) != 'h_' ) {
                m[k] = this[k];
                return m;
              } else {
                return m;
              }
            }, {});
          }
        }
      })(),
      watch: (function() {
        return {
          active( val ) {
            if ( val ) {
              this.isReady();
            }
          }
        }
      })()
    }
  });

  function extendArray( target, extension, k ) {
    const uniques = extension[k];
    for ( let d of target[k] ) {
      if ( uniques.indexOf( d ) == -1 ) {
        uniques.push( d );
      }
    }
    target[k] = uniques;
  }

  function extendFunction( target, extension, k ) {
    target[k] = extension[k];
  }

  function extendObject( target, extension ) {

      Object.assign( target, Object.keys( extension ).reduce(( m,k ) => {
        if ( target[k] ) {
          extendProperty( m, extension, k );
        } else {
          if ( typeof extension[k] === "function" ) {
            m[k] = extension[k];
          } else {
            m[k] = extension[k];
          }
        }
        return m;
      }, target ) );
  }

  function extendProperty( target, extension, k ) {
    if ( typeof extension[k] === "object" && extension[k].constructor === Object ) {
      target[k] = target[k] || new Object();
      extendObject( target[k], extension[k] );
    } else if ( Array.isArray( extension[k] )) {
      extendArray( target, extension, k );
    } else if ( typeof extension[k] === "function" ) {
      extendFunction( target, extension, k )
    } else {
      target[k] = extension[k];
    }
  }

  function extendComponent( component ) {
    const template = new Template();
    return Object.assign( component, Object.keys( template ).reduce(( m,k ) => {
      if ( component[k] ) {
        extendProperty( m, component, k );
      } else {
        m[k] = template[k];
      }
      return m;
    }, template ));
  }

  return {
    extend: function( component ){
      return extendComponent( component );
   }
  }
});

export default new baseSubsection();