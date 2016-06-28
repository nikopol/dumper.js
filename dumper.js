//dumper.js 1.0 - niko 2016

/*
DUMPER.JS
---------
~L~ nikopol 2016

Yet another tiny vanilla json dump'er for the browser

https://nikopol.github.com/dumper.js/

**usages**


  dumper('dom selector', obj);

eg:

  dumper('body', {a:42, b:69, c:666});
*/


var dumper = (function(){
  'use strict';

  var MAXDEPTH=32;

  function txt2html(txt) {
    return (txt.toString())
      .replace(/>/gm,'&gt;')
      .replace(/</gm,'&lt;')
      .replace(/\n/gm,'<br>')
      .replace(/([\”\↵\s\n\r\"\(]|^)(https?:\/\/[^\↵\s\n\r\"\”)]+)/gmi, '$1<a target="_blank" href="$2">$2</a>')
      .replace(/(\W|^)@([\w_]+)/gm, '$1<a target="_blank" href="https://twitter.com/$2">@$2</a>');
  }

  function type(o){
    var t=typeof(o);
    return o===null ? 'null' : o instanceof Array ? 'array' : t;
  }

  function foldable(o){
    var t=type(o);
    return ( t=='array' && o.length ) ||
           ( t=='object' && Object.keys(o).length );
  }

  function dump(o,d){
    if( d>=MAXDEPTH ) return '...too deep to dump...';
    var t=type(o), h;
    if( o===true )         h='<div class="value">true</div>';
    else if( o===false )   h='<div class="value">false</div>';
    else if( t=='number' ) h='<div class="value numeric">'+o+'</div>';
    else if( t=='string' ) h='<div class="value">'+txt2html(o)+'</div>';
    else if( t=='array' ) {
      //array
      if( o.length ) {
        h='<div class="array">';
        o.forEach(function(v,n){
          h+='<div class="item">'+dump(v,d+1)+'</div>';
        });
        h+='</div>';
      } else
        h='<span class="value empty">[]</span>';
    } else if( t=='object' ) {
      //object
      h='<div class="object">';
      var n=0, a, k;
      for(k in o) {
        a=foldable(o[k])
          ?'<div class="entry foldable" onclick="dumper.fold(this)">'
          :'<div class="entry">';
        a+='<label class="key">'+k+'</label>';
        a+=dump(o[k],d+1);
        a+='</div>';
        h+=a;
        n++;
      }
      if( !n ) h='<span class="value empty">{}</span>';
      h+='</div>';
    } else
      //all other type (undefined, null, function, etc)
      h='<div class="value">'+t+'</div>';
    return h;
  };

  var fn=function(id, json){
    var c=document.querySelector(id);
    if( !c ) return;
    try {
      c.innerHTML='<div class="dumper">'+dump(json,1)+'</div>';
    } catch(ex) {
      c.innerHTML='<div class="dumper error">'+ex.message+'</div>';
    }
  };
  fn.fold=function fold(obj){
    if( obj.tagName!='A' ) {
      //toggle 'closed' class
      var css = obj.className.split(/\s+/), idx = css.indexOf('closed');
      if( idx == -1 ) css.push('closed');
      else css.splice(idx,1);
      obj.className = css.join(' ');
    }
  };
  return fn;

})();
