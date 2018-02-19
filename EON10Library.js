(function(global) {

function argumentsToArray(args) {
	var arr = [];
	for(var i = 0; i < args.length; ++i) {
		arr.push(args[i]);
	}

	return arr;
}

function IsObjectSameType(obj1,obj2) {
	if(obj1.constructor === obj2.constructor) { return true; }

	return false;
}

function _GetTarget(node) {
	if(!node) { return; }

	var Target = node.getField('Target');

	this.target = function() {

		if(Target.ref.GetStringValue() === "") { return null; }
		return _GA.getNode(Target.value);
	};
}

global.GetTarget = function(node) {
	return new _GetTarget(_GA.getNode(node));
}

function addExclude(v,arr) {
	if(v.IsArray) {
		v.forEach(function(v) {
			if(v.IsString) {
				var path = _GA.getNode(v).path;
				if(!arr.includes(path)) {
					arr.push(path);
				}
			}
		});
	} else if(v.IsString) {
		arr.push(_GA.getNode(v).path);
	}
}

function removeExclude(v,arr) {
	if(v.IsArray) {
		v.forEach(function(v) {
			if(v.IsString) {
				var path = _GA.getNode(v).path;
				arr=arr.filter(function(x){
					return x!==path;
				});
			}
		});
	} else if(v.IsString) {
		if(/^all$/i.test(v)) {
			return [];
		}
		arr=arr.filter(function(x){
			return x!==_GA.getNode(v).path;
		});
	}
	return arr;
}

function checkType(val,type) {
	var $Types = {'u':'undefined','o':'object','b':'boolean','n':'number','s':'string','f':'function'};
	return typeof val === $Types[type];
}

function unRegister(val) {
	Timing.UnregisterEvent(val);
}

function registerEvent() {
	return Timing.RegisterEvent.apply(this,arguments);
}
var _console = (function() {

	var scriptName = GetNodePath(eonthis);

	return {
		log : function(msg,desc,source) {

			eon.Trace2(source||scriptName,desc||'console log',JSON.stringify(msg));
		},
		list : function(obj,desc,source) {

			// check for object/array?

			var arr 	= Object.entries(obj),
				len1 	= [], 
				len2 	= [], 
				arrLen 	= arr.length;
	
			for(var i=0; i<arrLen; i++) {

				var i0 = (arr[i][0]+'').length, 
					i1 = (arr[i][1]+'').length;

				len1.push(i0);
				len2.push(i1);
			}
			var max1 = Math.max.apply(null,len1),
				max2 = Math.max.apply(null,len2),
				gap1 = '-'.repeat(max1>5 ? ~~(max1/2) : 2),
				gap2 = '-'.repeat(max2>11 ? ~~(max2/2) : 5);

			_console.log(gap1+' key '+gap1+'|'+gap2+' property '+gap2);

			for(var i=0; i<arrLen; i++) {

				var space1 = '-'.repeat(len1[i]<max1 ?  gap1.length*2+5-len1[i] :4);
				_console.log(	arr[i][0]+'  '+space1+'  '+ arr[i][1],' ',' ');
			}
		}
	}
})();

global.console = _console;
function _alert(msg,title) {
	eon.MessageBox(msg,title||'');
}

global.alert = _alert;
var Update = (function() {

	var onUpdate_Events = [],
		EV_ID;

	return {
		add:function() {

			var arr = [];

			arr.push.apply(arr, arguments);

			arr.forEach(function(x) {
				if(x.IsFunction) { 
					onUpdate_Events.push(x);
				}
			});

			if(!EV_ID){
				EV_ID=registerEvent('FRAME',null,function() {

					onUpdate_Events.forEach(function(x) {
						x();
					});
				});
			}
		},
		clear:function() {
			onUpdate_Events = [];
			if(EV_ID) {unRegister(EV_ID); EV_ID=null;}
		}
	};
})();

global.Update = Update;
(function() {
	var $Array 		= Array,
		$Math 		= Math,
		$Number 	= Number,
		$Object 	= Object,
		$String 	= String,
		$TypeErr 	= TypeError,
		defineProp 	= 'defineProperty',
		defineProps = 'defineProperties',
		length		= 'length',
		prototype 	= 'prototype',
		valueOf		= 'valueOf',
		MAX 		= $Math.max,
		MIN 		= $Math.min,
		$AP 		= $Array[prototype],
		$NP 		= $Number[prototype],
		$SP 		= $String[prototype],
		$FP 		= Function[prototype],
		$OP 		= $Object[prototype],
		$Prototypes = [$AP,$NP,$SP,$FP,$OP];



$AP.IsArray = true;
$AP.flatten = function () {
	var tmp = this.slice(0),
		res = [];
	for(var i = 0; i < tmp[length]; ++i) {
		if(tmp[i].IsArray) {
			res = res.concat(tmp[i].flatten());
		} else {
			res.push(tmp[i]);
		}
	}
	return res;
};
$AP.isEqualTo = function (o) {
	var tmp = this.slice(0);
	if(tmp[length] !== o[length]) { return false; }

	for(var i = 0; i < tmp[length]; ++i) {
		if(tmp[i] !== o[i]) { return false; }
	}
	return true;
};
$AP.deepComparison = function (o) {
	var tmp = this.slice(0);
	if(tmp[length] !== o[length]) { return false; }

	for(var i = 0; i < tmp[length]; ++i) {
		if(tmp[i].IsArray && o[i].IsArray) {
			if(tmp[i] !== o[i] && !tmp[i].deepComparison(o[i])) { return false; }
		}
		else if(tmp[i].IsArray !== o[i].IsArray) { return false; }
		else if(tmp[i] !== o[i]) { return false; }
	}
	return true;
};
$AP.set = function (arr) {
	this[length] = 0;
	for(var i = 0; i < arr[length]; ++i) {
		this.push(arr[i]);
	}
};
$AP.format = function() {
    return this.map(function(x) {
      return '['+x[0]+','+x[1]+']';
    }).join();  
};
/****************************************************************************/
/** Created By : jaymie timperley,James Corr							   **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/
$FP.IsFunction = true;
// Adds standard functions to match up with Vec3 and eventually other
// initial point of this was to make _transform multi purpose.
// Standardizing some operations.
$NP.clamp = function(bounds) {
	if(bounds.min && this[valueOf]() < bounds.min) { return bounds.min; }
	else if(bounds.max && this[valueOf]() > bounds.max) { return bounds.max; }
	else { return this[valueOf](); }
};
$NP.iclamp		= $NP.clamp;
$NP.add			= function(x) { return this[valueOf]() + x; };
$NP.iadd		= $NP.add;
$NP.sub			= function(x) { return this[valueOf]() - x; };
$NP.isub		= $NP.sub;
$NP.mult		= function(x) { return this[valueOf]() * x; };
$NP.imult		= $NP.mult;
$NP.div			= function(x) { return this[valueOf]() / x; };
$NP.idiv		= $NP.div;
$NP.isEqualTo	= function(x) { return this[valueOf]() === x ? true : false;};
$NP.IsNumber	= true;

$Object[defineProps]($NP,{
	max: { get: function () { return this[valueOf](); } },
	isZero: {get: function () {return this[valueOf]()===0?true:false;}}
});
/****************************************************************************/
/** Created By : jaymie timperley,James Corr							   **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/
$SP.IsString = true;
$OP.IsObject = true;
//**************************  .from **************************//
$Array.from = (function () {
  var toStr = $OP.toString,
      isCallable = function (fn) {
    return checkType(fn,'f') || toStr.call(fn) === '[object Function]';
  };
  var toInteger = function (value) {
    var number = +value;
    if (isNaN(number)) { return 0; }
    if (number === 0 || !isFinite(number)) { return number; }
    return (number > 0 ? 1 : -1) * ~~($Math.abs(number));
  };
  var maxSafeInteger = $Math.pow(2, 53) - 1,
      toLength = function (value) {
    var len = toInteger(value);
    return MIN(MAX(len, 0), maxSafeInteger);
  };

  // The length property of the from method is 1.
  return function from(arrayLike/*, mapFn, thisArg */) {
    // 1. Let C be the this value.
    var C = this,
        items = $Object(arrayLike);  // 2. Let items be ToObject(arrayLike).

    // 3. ReturnIfAbrupt(items).
    if (arrayLike == null) {
      throw new $TypeErr("Array.from requires an array-like object - not null or undefined");
    }

    // 4. If mapfn is undefined, then let mapping be false.
    var mapFn = arguments[length] > 1 ? arguments[1] : void undefined,T;
    if (!checkType(mapFn,'u')) {

      // 5. else
      // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
      if (!isCallable(mapFn)) {
        throw new $TypeErr('Array.from: when provided, the second argument must be a function');
      }

      // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
      if (arguments[length] > 2) {
        T = arguments[2];
      }
    }

    // 10. Let lenValue be Get(items, "length").
    // 11. Let len be ToLength(lenValue).
    // 13. If IsConstructor(C) is true, then
    // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
    // 14. a. Else, Let A be ArrayCreate(len).
    // 16. Let k be 0.
    // 17. Repeat, while k < len… (also steps a - h)
    var len = toLength(items[length]),
        A = isCallable(C) ? $Object(new C(len)) : new $Array(len),
        k = 0,kValue;
    while (k < len) {
      kValue = items[k];
      if (mapFn) {
        A[k] = checkType(T,'u') ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
      } else {
        A[k] = kValue;
      }
      k += 1;
    }
    // 18. Let putStatus be Put(A, "length", len, true).
    A[length] = len;
    // 20. Return A.
    return A;
  };
}());
//**************************  .of **************************//
$Array.of = function() {return $AP.slice.call(arguments);};
//**************************  .copyWithin **************************//
$AP.copyWithin = function(target, start/*, end*/) {
  // Steps 1-2.
  if (this == null) { throw new $TypeErr('this is null or not defined');}

  // Steps 3-5.
  // Steps 6-8.
  // Steps 9-11.
  // Steps 12-14.
  // Step 15.
  // Steps 16-17.
  var O = $Object(this),
      len = O[length] >>> 0,
      relativeTarget = target >> 0,
      to = relativeTarget < 0 ?MAX(len + relativeTarget, 0) :MIN(relativeTarget, len),
      relativeStart = start >> 0,
      from = relativeStart < 0 ?MAX(len + relativeStart, 0) :MIN(relativeStart, len),
      end = arguments[2],
      relativeEnd = end === undefined ? len : end >> 0,
      final = relativeEnd < 0 ?MAX(len + relativeEnd, 0) :MIN(relativeEnd, len),
      count = MIN(final - from, len - to),
      direction = 1;

  if (from < to && to < (from + count)) {
    direction = -1;
    from += count - 1;
    to += count - 1;
  }

  // Step 18.
  while (count > 0) {
    if (from in O) {
      O[to] = O[from];
    } else {
      delete O[to];
    }

    from += direction;
    to += direction;
    count--;
  }

  // Step 19.
  return O;
};
//**************************  .fill **************************//
$AP.fill = function(value) {

  // Steps 1-2.
  if (this == null) {
    throw new $TypeErr('this is null or not defined');
  }
  // Steps 3-5. // Steps 6-7.// Step 8.// Steps 9-10.// Step 11.
  var O = $Object(this),
      len = O[length] >>> 0,
      start = arguments[1],
      relativeStart = start >> 0,
      k = relativeStart < 0 ?MAX(len + relativeStart, 0) :MIN(relativeStart, len),
      end = arguments[2],
      relativeEnd = end === undefined ?len : end >> 0,
      final = relativeEnd < 0 ?MAX(len + relativeEnd, 0) :MIN(relativeEnd, len);

  // Step 12.
  while (k < final) {
    O[k] = value;
    k++;
  }

  // Step 13.
  return O;
};
//**************************  .find **************************//
$AP.find = function(predicate) {
  if (this === null) {
    throw new $TypeErr('Array.'+prototype+'.find called on null or undefined');
  }
  if (!checkType(predicate,'f')) {
    throw new $TypeErr('predicate must be a function');
  }
  var list = $Object(this),
      length = list[length] >>> 0,
      thisArg = arguments[1],
      value;

  for (var i = 0; i < length; i++) {
    value = list[i];
    if (predicate.call(thisArg, value, i, list)) {
      return value;
    }
  }
  return undefined;
};
//**************************  .findIndex **************************//
$AP.findIndex = function(predicate) {
  if (this === null) {
    throw new $TypeErr('Array.'+prototype+'.findIndex called on null or undefined');
  }
  if (!checkType(predicate,'f')) {
    throw new $TypeErr('predicate must be a function');
  }
  var list = $Object(this),
      length = list[length] >>> 0,
      thisArg = arguments[1],
      value;

  for (var i = 0; i < length; i++) {
    value = list[i];
    if (predicate.call(thisArg, value, i, list)) {
      return i;
    }
  }
  return -1;
};
//**************************  .includes **************************//
$AP.includes = function(searchElement /*, fromIndex*/ ) {
  var O = $Object(this),
      len = parseInt(O[length]) || 0;
  if (len === 0) {
    return false;
  }
  var n = parseInt(arguments[1]) || 0,k;
  if (n >= 0) {
    k = n;
  } else {
    k = len + n;
    if (k < 0) {k = 0;}
  }
  var currentElement;
  while (k < len) {
    currentElement = O[k];
    if (searchElement === currentElement ||
       (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
      return true;
    }
    k++;
  }
  return false;
};
//**************************  .assign **************************//
$Object.assign = function (target) {
  if (target === undefined || target === null) {
    throw new $TypeErr('Cannot convert undefined or null to object');
  }

  var output = $Object(target);
  for (var index = 1; index < arguments[length]; index++) {
    var source = arguments[index];
    if (source !== undefined && source !== null) {
      for (var nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
  }
  return output;
};
//**************************  .entries **************************//
$Object.entries = function entries(O) {

  var arr = [];

  for(var i in O) {

    if(O.hasOwnProperty(i)){

      if(checkType(O[i],'o') &&  !(O[i] instanceof Array)) {
        O[i] = $Object.entries(O[i]);
      }
      arr.push([i,O[i]]);
    }
  }
  return arr;
};
function RequireObjectCoercible(O) {
  if (O === null || checkType(O,'u')) {
    throw new $TypeErr('"this" value must not be null or undefined');
  }
  return O;
}

function _ToLength(argument) {
  var len = +(argument),
      MAX_SAFE_INTEGER = $Math.pow(2, 53) - 1;
  if ($Number.isNaN(len) || len <= 0) {
    return 0;
  }
  if (len > MAX_SAFE_INTEGER) {
    return MAX_SAFE_INTEGER;
  }
  return len;
}
//**************************  .fromCodePoint **************************//
$SP.fromCodePoint = function() {
  var MAX_SIZE = 0x4000,
      codeUnits = [],
      highSurrogate,
      lowSurrogate,
      index = -1,
      length = arguments[length];
  if (!length) {
    return '';
  }
  var result = '';
  while (++index < length) {
    var codePoint = +(arguments[index]);
    if (
      !isFinite(codePoint) ||       // `NaN`, `+Infinity`, or `-Infinity`
      codePoint < 0 ||              // not a valid Unicode code point
      codePoint > 0x10FFFF ||       // not a valid Unicode code point
      ~~(codePoint) != codePoint    // not an integer
    ) {
      throw RangeError('Invalid code point: ' + codePoint);
    }
    if (codePoint <= 0xFFFF) { // BMP code point
      codeUnits.push(codePoint);
    } else { // Astral code point; split in surrogate halves
      // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      codePoint -= 0x10000;
      highSurrogate = (codePoint >> 10) + 0xD800;
      lowSurrogate = (codePoint % 0x400) + 0xDC00;
      codeUnits.push(highSurrogate, lowSurrogate);
    }
    if (index + 1 == length || codeUnits[length] > MAX_SIZE) {
      result += $String.fromCharCode.apply(null, codeUnits);
      codeUnits[length] = 0;
    }
  }
  return result;
};
//**************************  .codePointAt **************************//
$SP.codePointAt = function(position) {
  if (this == null) {
    throw $TypeErr();
  }
  var string = $String(this),
      size = string[length];
  // `ToInteger`
  var index = position ? +(position) : 0;
  if (index != index) { // better `isNaN`
    index = 0;
  }
  // Account for out-of-bounds indices:
  if (index < 0 || index >= size) {
    return undefined;
  }
  // Get the first code unit
  var first = string.charCodeAt(index),second;
  if ( // check if it’s the start of a surrogate pair
    first >= 0xD800 && first <= 0xDBFF && // high surrogate
    size > index + 1 // there is a next code unit
  ) {
    second = string.charCodeAt(index + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
      // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }
  return first;
};
//**************************  .endsWith **************************//
$SP.endsWith = function(searchString, position) {
    var subjectString = this.toString();
    if (!checkType(position,'n') || !isFinite(position) || ~~(position) !== position || position > subjectString[length]) {
      position = subjectString[length];
    }
    position -= searchString[length];
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
};

//**************************  .includes **************************//
$SP.includes = function() {return $SP.indexOf.apply(this, arguments) !== -1;};

//**************************  .startsWith **************************//
$SP.startsWith = function(searchString, position) {
  position = position || 0;
  return this.indexOf(searchString, position) === position;
};

//**************************  .repeat **************************//
$SP.repeat = function(count) {
  if (this == null) {
    throw new $TypeErr('can\'t convert ' + this + ' to object');
  }
  var str = '' + this;
  count = +count;
  if (count != count) {
    count = 0;
  }
  if (count < 0) {
    throw new RangeError('repeat count must be non-negative');
  }
  if (count == Infinity) {
    throw new RangeError('repeat count must be less than infinity');
  }
  count = ~~(count);
  if (str[length] == 0 || count == 0) {
    return '';
  }
  // Ensuring count is a 31-bit integer allows us to heavily optimize the
  // main part. But anyway, most current (August 2014) browsers can't handle
  // strings 1 << 28 chars or longer, so:
  if (str[length] * count >= 1 << 28) {
    throw new RangeError('repeat count must not overflow maximum string size');
  }
  var rpt = '';
  for (;;) {
    if ((count & 1) == 1) {
      rpt += str;
    }
    count >>>= 1;
    if (count == 0) {
      break;
    }
    str += str;
  }
  return rpt;
};

$SP.padStart = function(maxLength) {
  var fillString = arguments[length] <= 1 || arguments[1] === undefined ? ' ' : arguments[1],
    O = RequireObjectCoercible(this),
    S = $String(O),
    intMaxLength = _ToLength(maxLength),
    stringLength = _ToLength(S[length]);

  if (intMaxLength <= stringLength) {
    return S;
  }
  var filler = checkType(fillString,'u') ? ' ' : $String(fillString);
  if (filler === '') {
    return S;
  }
  var fillLen = intMaxLength - stringLength;
  while (filler[length] < fillLen) {
    var fLen = filler[length],
      remainingCodeUnits = fillLen - fLen;
    if (fLen > remainingCodeUnits) {
      filler += filler.slice(0, remainingCodeUnits);
    } else {
      filler += filler;
    }
  }
  var truncatedStringFiller = filler.slice(0, fillLen);
  return truncatedStringFiller + S;
};

$SP.padEnd = function(maxLength) {
  var fillString = arguments[length] <= 1 || arguments[1] === undefined ? ' ' : arguments[1],
    O = RequireObjectCoercible(this),
    S = $String(O),
    intMaxLength = _ToLength(maxLength),
    stringLength = _ToLength(S[length]);
  if (intMaxLength <= stringLength) {
    return S;
  }
  var filler = checkType(fillString,'u') ? ' ' : $String(fillString);
  if (filler === '') {
    return S;
  }
  var fillLen = intMaxLength - stringLength;
  while (filler[length] < fillLen) {
    var fLen = filler[length],
      remainingCodeUnits = fillLen - fLen;
    if (fLen > remainingCodeUnits) {
      filler += filler.slice(0, remainingCodeUnits);
    } else {
      filler += filler;
    }
  }
  var truncatedStringFiller = filler.slice(0, fillLen);
  return S + truncatedStringFiller;
};
$Prototypes.forEach(function(v) {$Object.freeze(v);});
})();
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s)    { return rstr2hex(rstr_sha1(str2rstr_utf8(s))); }

/* Calculate the SHA1 of a raw string*/
function rstr_sha1(s){return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));}

/* Convert a raw string to a hex string*/
function rstr2hex(input){
  try { hexcase } catch(e) { hexcase=0; }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef",
    output = "",x;
  for(var i = 0; i < input.length; i++){
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
  }
  return output;
}

/* Encode a string as utf-8. For efficiency, this assumes the input is valid utf-16.*/
function str2rstr_utf8(input){
  var output = "",i = -1,x, y,S = String.fromCharCode;

  while(++i < input.length){
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF){
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F) {
      output += S(x);
    }
    else if(x <= 0x7FF){
      output += S(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    }
    else if(x <= 0xFFFF){
      output += S(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    }
    else if(x <= 0x1FFFFF){
      output += S(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    }
  }
  return output;
}

/*Convert a raw string to an array of big-endian words. Characters >255 have their high-byte silently ignored.*/
function rstr2binb(input){
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++){
    output[i] = 0;
  }
  for(var i = 0; i < input.length * 8; i += 8){
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
  }
  return output;
}

/*Convert an array of big-endian words to a string*/
function binb2rstr(input){
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8){
    output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
  }
  return output;
}

/*Calculate the SHA-1 of an array of big-endian words, and a bit length*/
function binb_sha1(x, len){
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80),
      a =  1732584193,
      b = -271733879,
      c = -1732584194,
      d =  271733878,
      e = -1009589776;

  for(var i = 0; i < x.length; i += 16){
    var olda = a,
        oldb = b,
        oldc = c,
        oldd = d,
        olde = e;

    for(var j = 0; j < 80; j++){
      if(j < 16){w[j] = x[i + j];} 
      else {w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
        var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                         safe_add(safe_add(e, w[j]), sha1_kt(j)));
        e = d;
        d = c;
        c = bit_rol(b, 30);
        b = a;
        a = t;
      }
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);
}

/*Perform the appropriate triplet combination function for the current iteration*/
function sha1_ft(t, b, c, d){
  if(t < 20) {return (b & c) | ((~b) & d);}
  if(t < 40) {return b ^ c ^ d;}
  if(t < 60) {return (b & c) | (b & d) | (c & d);}
  return b ^ c ^ d;
}

/*Determine the appropriate additive constant for the current iteration*/
function sha1_kt(t){
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/* Add integers, wrapping at 2^32. This uses 16-bit operations internally to work around bugs in some JS interpreters.*/
function safe_add(x, y){
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*Bitwise rotate a 32-bit number to the left.*/
function bit_rol(num, cnt){
  return (num << cnt) | (num >>> (32 - cnt));
}

var EaseTypes = (function() {

	var _M   = Math,
		PI   = _M.PI,
		COS  = _M.cos,
		SIN  = _M.sin,
		POW  = _M.pow,
		SQRT = _M.sqrt,
		ASIN = _M.asin;

	return {
		insine: function(p) { 
			return -1*COS(p*(PI/2))+1; 
		},
		outsine: function(p) { 
			return SIN(p*(PI/2)); 
		},
		inoutsine: function(p) { 
			return -0.5*(COS(PI*p)-1); 
		},
		inquad: function (p) { 
			return p*p 
		},
		outquad: function (p) { 
			return p*(2-p); 
		},
		inoutquad: function (p) { 
			return p<0.5 ? 2*p*p : -1+(4-2*p)*p; 
		},
		incubic: function (p) { 
			return POW(p,3); 
		},
		outcubic: function (p) { 
			return 1-POW(p-1,3); 
		},
		inoutcubic: function (p) { 
			return p<0.5 ? 4*p*p*p : (p-1)*(2*p-2)*(2*p-2)+1; 
		},				
		inquart: function(p) { 
			return POW(p,4); 
		},
		outquart: function(p) { 
			return 1-POW(p-1,4); 
		},
		inoutquart: function (p) { 
			return p<0.5 ? 8*p*p*p*p : 1-8*(--p)*p*p*p; 
		},
		inquint: function (p) { 
			return POW(p,5); 
		},
		outquint: function (p) { 
			return 1+POW(p-1,5); 
		},
		inoutquint: function (p) { 
			return p<0.5 ? 16*p*p*p*p*p : 1+16*(--p)*p*p*p*p; 
		},
		inexpo: function(p) { 
			return POW(2,10*(p-1)); 
		},
		outexpo: function(p) { 
			return -POW(2,-10*p)+1; 
		},
		inoutexpo: function(p) { 
			return p*2<1 ? 0.5*POW(2,10*(p*2-1)) : 0.5*(-POW(2,-10*(p*2-1))+2); 
		},
		incirc: function(p) { 
			return -1*(SQRT(1-(p/1)*p)-1); 
		},
		outcirc: function(p) { 
			return SQRT(1-(p-1)*(p-1)); 
		},
		inoutcirc: function(p) { 
			return p*2<1 ? -0.5*(SQRT(1-(p*2)*(p*2))-1) : 0.5*(SQRT(1-(p*2-2)*(p*2-2))+1); 
		},
		inback: function(p,m) { 
			var s = p/1,
				m = m||1.70158;

			return s*s*((m+1)*s-m); 
		},
		outback: function(p,m) { 
			var s = (p/1)-1,
				m = m||1.70158; 

			return (s*s*((m+1)*s+m))+1; 
		},
		inoutback: function(p,m) { 
			var s  =p*2,
				s2 =s-2,
				m  =(m||1.70158)*1.525; 

			return s<1 ? 0.5*s*s*(((m+1)*s)-m) : 0.5*(s2*s2*((m+1)*s2+m)+2); 
		},
		inelastic: function(p,m) { 
			var s = (p/1)-1,
				e = 1-(m||0.7); 

			return -(POW(2,10*s)*SIN((s-(e/(2*PI)*ASIN(1)))*(2*PI)/e)); 
		},
		outelastic: function(p,m) { 
			var s = p*2,
				e = 1-(m||0.7); 

			return (POW(2,-10*s)*SIN((s-(e/(2*PI)*ASIN(1)))*(2*PI)/e))+1; 
		},
		inoutelastic: function(p,m) { 
			var s  = p*2,
				s2 = s-1,
				e  = 1-(m||0.7),
				x  = e/(2*PI)*ASIN(1); 

			return s<1 ? -0.5*(POW(2,10*s2)*SIN((s2-x)*(2*PI)/e)) : (POW(2,-10*s2)*SIN((s2-x)*(2*PI)/e)*0.5)+1; 
		},
		outbounce: function(p) { 
			var s = p/1,
				s2; 

			if(1/2.75>s) { 
				return 7.5625*s*s; 
			}
			else if(2/2.75>s) {
				s2 = s-1.5/2.75;
				return 7.5625*s2*s2+0.75;
			}
			else if(2.5/2.75>s) {
				s2 = s-2.25/2.75;
        		return 7.5625*s2*s2+0.9375;
			}
			else {
				s2 = s-2.625/2.75;
    			return 7.5625*s2*s2+0.984375;
			}
		},
		inbounce: function(p) {
    		return 1-this.outbounce(1-p);
		},
		inoutbounce: function(p) {
			return p<0.5 ? this.inbounce(p*2)*0.5 : (this.outbounce((p*2)-1)*0.5)+0.5;
		}
	};
})();
/*****************************************************************************/
/**	FIELD IDS																**/
/*****************************************************************************/
var EONTYPES = (function() {
	var b  = Boolean,
		s  = String,
		pF = parseFloat,
		pI = parseInt,
		v2 = Vector2,
		v3 = Vector3,
		v4 = Vector4,
		n  = Node,
		$N = null;

	return {
		ID 	 : [b,v3,pF,$N,pI,n,$N,s,$N,v2,v3,b,v3,pF,$N,pI,n,$N,s,$N,v2,v3,v4,v4],
		S : {1:3,9:2,10:3,12:3,20:2,21:3,22:4,23:4}
	};
})();
/****************************************************************************/
/** Created By : jaymie timperley,James Corr							   **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/
function getChild(field,name) {
	var node,cname;
	
	for(var i = 0; i < field.count; ++i) {
		node = field.get(i);
		if(name == node.name) { return Node(node); }
	}
	return null;
}

function $transform(field,startValue,hashtable,ev) {
	
  var progress = ev.Time / hashtable.time;

  if(hashtable.hasOwnProperty("onupdate")) {
    hashtable.onupdate.apply(null,hashtable.onupdateargs);
  }

  if(progress >= 1.0) {
    progress = 1.0;

    if(hashtable.hasOwnProperty("oncomplete")) {
      hashtable.oncomplete.apply(null,hashtable.oncompleteargs);
    }

    unRegister(ev.id);
    
  }

  if(hashtable.ease) {
    progress = EaseTypes[hashtable.ease](progress,hashtable.magnitude);
  }

  var val = Vector.Lerp(startValue,hashtable.target,progress,hashtable.smooth);

  if(GV.DEBUG || hashtable.debug) {

    var percentage = (progress*100).toFixed(2);
    _console.log('Transforming field: '+hashtable.field+' on node: '+hashtable.name+' to value '+hashtable.target+' progress is: '+percentage+'% ,value is currently: '+val,'Transforming '+hashtable.field+' on node: '+hashtable.name);

    if(progress === 1.0) {
      var dash = '-'.repeat(30);
      _console.log(dash+'Transform of: '+hashtable.field+' on node: '+hashtable.name+' completed in: '+ ev.Time+dash);
    }
  }
  field.set(val);
}

function transformDelta(field,hashtable,ev) {
	if(hashtable.hasOwnProperty("onupdate")) {
		hashtable.onupdate.apply(null,hashtable.onupdateargs);
	}

	var val = field.get();
	val.iadd(hashtable.delta.mult(ev.dt));

	field.set(val);
}

function nodeChanger(field,hashtable,ev) {
	var node = hashtable.nodes.next().item();
	if(!node) {
		unRegister(ev.id);
		return;
	}

	field.set(node);
}

var Nodes = {};

function Node(node) {
	if(node.IsNode) { return node; }
	var path = hex_sha1(GetNodePath(node));
	if(Nodes.hasOwnProperty(path)) { return Nodes[path]; }
	return (new CNode(node));
}
/****************************************************************************/
/** Created By : jaymie timperley,James Corr							   **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/
function hasField(node,name) {
	for(var i = 0; i < node.GetFieldCount(); ++i) {
		if(node.GetField(i).GetName().toLowerCase() === name.toLowerCase()) { return true; }
	}
	return false;
}

var Fields = {}, EONField = {};

function CField(_field,_dataType,_id,_size) {
  this.ref = _field;
  this.$DT = _dataType;
  this.$IA = [];
  this.$ID = _id;
  this.$S  = _size;
}

Object.defineProperties(CField.prototype, {
	name: { get: function() { return this.ref.GetName(); } },
	type: { get: function() { return this.ref.GetType(); } },
	value: { get: function() { return this.ref.value; },
			 set: function(v) { this.ref.value=v; } }
});

function CSField(Field,DataType,id,Size) {
	CField.call(this,Field,DataType,id,Size);
}
CSField.prototype = Object.create(CField.prototype);

Object.defineProperties(CSField.prototype,{
	get : {
		value: function () {
			if(this.ref.GetStringValue() == "") { return null; }
			if(!this.$DT) { return this.value; }
			return this.$DT(this.value,this.ref);
		}
	},
	set : {
		value : function(val) {
			if(val === undefined) { return false; }

			switch(this.$ID) {
				case 'Bool':
					this.value = !!(val);
				break;

				case 'String':
					if(val.IsString) { this.value = val; } 
					else { this.ref.SetStringValue((val)+''); }
				break;

				case 'Number':
					if(val.IsString) { val = this.$DT(val); }
					if(!val.IsNumber||isNaN(val)||!isFinite(val)) {
						return false;
					}
					this.value = val;
				break;

				case 'Vector':
					if(IsObjectSameType(val,this.$DT())) { this.value = val.v; }
					else if(val.IsArray && val.length === this.$S) { this.value = val; }
					else { return false; }
				break;

				case 'Node':
					if(val === null) { this.ref.SetStringValue(""); }
					else if(val.IsNode) { this.value = val.ref; }
					else { return false; }
				break;
			};
			return true;
		}
	}
});

function CMField(Field,DataType,id,Size) {
	CField.call(this,Field,DataType,id,Size);
}
CMField.prototype = Object.create(CField.prototype);

Object.defineProperties(CMField.prototype,{
	get: {
		value: function (idx) {
			if((idx < 0) && ((-idx) < this.ref.GetMFCount())) { return idx = this.ref.GetMFCount() + idx; }
			
			if(idx === undefined) {
				if(this.$IA.length == this.ref.GetMFCount()) { return this.$IA.slice(0); }
				var arr = [];
				for(var i = 0; i < this.ref.GetMFCount(); ++i) {
					if(!this.$DT) { arr.push(this.ref.GetMFElement(i)); }
					else { arr.push(this.$DT(this.ref.GetMFElement(i))); }
				}
				if(arr.length === 0) { return null; }
				this.$IA.set(arr);
				return arr;
			}
			if(idx > this.ref.GetMFCount()) { return null; }

			if(!this.$DT) { return this.ref.GetMFElement(idx); }
			else { return this.$DT(this.ref.GetMFElement(idx)); }
		}
	},
	child: {
	    value: function(idx) {
	    	return this.get(idx);
		}
	},
	count: {
		get: function () { return this.ref.GetMFCount(); },
		set: function (c) {
			this.$IA.length = c;
			this.ref.SetMFCount(c); 
		}
	},
	push: {
		value: function(val) {
			if(val === undefined) { return false; }
			if(val.IsArray) { val = val.flatten(); }

			switch(this.$ID) {
				case 'Bool':
				case 'String':
				if(val.IsArray) {
					for(var i = 0; i < val.length; ++i) {
						this.ref.AddMFElement(this.$DT(val[i]));
					}
					return true;
				}
				this.ref.AddMFElement(this.$DT(val));
				break;

				case 'Number':
				if(val.IsString) { val = this.$DT(val); }
				if(val.IsNumber) { this.ref.AddMFElement(val); }
				else if(val.IsArray && val[0].IsNumber) {
					for(var i = 0; i < val.length; ++i) {
						if(val[i].IsString) { val[i] = this.$DT(val); }
						this.ref.AddMFElement(val[i]);
					}
				}
				else { return false; }
				break;

				case 'Vector':
				if(IsObjectSameType(val,this.$DT())) {
					this.ref.AddMFElement(val.v);
				} else if(val.IsArray && val.length == Size && val[0].IsNumber) {
					this.ref.AddMFElement(val);
				} else if(val.IsArray && val[0].isSameType(this.$DT())) {
					for(var i = 0; i < val.length; ++i) {
						this.ref.AddMFElement(val[i].v);
					}
				} else if(val.IsArray && (val.length % Size) == 0) {
					for(var i = 0; i < (val.length/Size); ++i) {
						this.ref.AddMFElement(val.slice(i*Size,(i+1)*Size));
					}
				} else { return false; }

				return true;
				break;

				case 'Node':
				if(val.IsArray && val[0].IsNode) {
					for(var i = 0; i < val.length; ++i) {
						this.ref.AddMFElement(val[i].ref);
					}
				} else if(val.IsNode) {
					this.ref.AddMFElement(val);
				}
				else { return false; }
				break;
			};
			return true;
		}
	},
	set: {
		value: function(idx,val) {

			eon.Trace('type ' + this.$ID);


			if(val === undefined) { return false; }
			if((idx < 0) && ((-idx) < this.ref.GetMFCount())) { idx = this.ref.GetMFCount() + idx; }
			if(val.IsArray && this.$ID!=='Vector') { val = val.flatten(); }

			switch(this.$ID) {
				case 'Bool':
				case 'String':
				if(val.IsArray) {
					for(var i = 0; i < val.length; ++i) {
						this.ref.SetMFElement(idx+i,this.$DT(val[i]));
					}
					return true;
				}

				this.ref.SetMFElement(idx,this.$DT(val));
				break;

				case 'Number':
				if(val.IsString) { val = this.$DT(val); }
				if(val.IsNumber) { this.ref.SetMFElement(idx,val); }
				else if(val.IsArray && val[0].IsNumber) {
					for(var i = 0; i < val.length; ++i) {
						if(val[i].IsString) { val[i] = this.$DT(val); }
						this.ref.SetMFElement(idx+i,val[i]);
					}
				}
				else { return false; }
				break;

				case 'Vector':
				if(IsObjectSameType(val,this.$DT())) {
					this.ref.SetMFElement(idx,val.v);
				} else if(val.IsArray && val.length == Size && val[0].IsNumber) {
					this.ref.SetMFElement(idx,val);
				} else if(val.IsArray && val[0].isSameType(this.$DT())) {
					for(var i = 0; i < val.length; ++i) {
						this.ref.SetMFElement(idx+i,val[i].v);
					}
				} else if(val.IsArray && val[0].IsArray && val[0].length == Size) {
					for(var i = 0; i < val.length; ++i) {
						this.ref.SetMFElement(idx+i,val[i]);
					}
				} else { return false; }
				break;

				case 'Node':
				if(val.IsArray && val[0].IsNode) {
					for(var i = 0; i < val.length; ++i) {
						this.ref.SetMFElement(idx+i,val[i].ref);
					}
				} else if(val.IsNode) {
					this.ref.SetMFElement(idx,val.ref);
				}
				else { return false; }
				break;
			};
			return true;
		}
	}	
});

function CSFVec(Field,DataType,id,Size) {
	CSField.call(this,Field,DataType,id,Size);
}
CSFVec.prototype = Object.create(CSField.prototype);

['x','y','z','w'].forEach(function(c,i) {
	Object.defineProperty(CSFVec.prototype,c,{
		get: function () { return this.value[i]; },
		set: function (n) {
			var v = this.value;
			v[i] = n;
			this.value = v;
		}
	});
});

function CMFVec(Field,DataType,id,Size) {
	CMField.call(this,Field,DataType,id,Size);
}
CMFVec.prototype = Object.create(CMField.prototype);

function Field(field,node) {
	var idNum 	 = field.GetType(),
		dataType = EONTYPES.ID[idNum],
		id 		 = hex_sha1(node.path + ":" + field.GetName());

	if(!dataType) { return; }

	if(Fields.hasOwnProperty(id)) { return Fields[id]; }
	else {
		var _type = (/^0$|^11$/.test(idNum)?'Bool':/^7$|^18$/.test(idNum)?'String':/^2$|^4$|^13$|^15$/.test(idNum)?'Number':/^1$|^9$|^10$|^12$|2[0-3]/.test(idNum)?'Vector':/^5$|^16$/.test(idNum)?'Node':0);

		if([1,9,10,22].includes(idNum)) {
			Fields[id] = new CSFVec(field,dataType,_type,EONTYPES.S[idNum]);
		}
		else if([12,20,21,23].includes(idNum)) {
			Fields[id] = new CMFVec(field,dataType,_type,EONTYPES.S[idNum]);
		}
		else if(/^[0-8]$/.test(idNum)) {
			Fields[id] = new CSField(field,dataType,_type,EONTYPES.S[idNum]);
		}
		else {
			Fields[id] = new CMField(field,dataType,_type,EONTYPES.S[idNum]);
		}
		return Fields[id];
	}
}
/****************************************************************************/
/** Created By : jaymie timperley,James Corr							   **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/
function CHashTable() {
	this.IsHashTable = true;
}

var HashTable = {
	ParseTarget: function (hashtable,check,data_type,alias) {
		alias = alias || {};
		var target = [], component;

		for(var i = 0; i < check.length; ++i) {
			component = check[i];
			if(hashtable.hasOwnProperty(component)) {
				if(alias.hasOwnProperty(component)) { component = alias[component]; }
				target[i] = hashtable[check[i]];
			}
			target[i] = target[i] || 0;
		}
		return data_type(target);
	},
	GetTime: function (hashtable,startValue) {
		if(hashtable.hasOwnProperty("speed")) {
			return (hashtable.target.sub(startValue).length / hashtable.speed);
		} else {
			return 1;
		}
	}
};
/****************************************************************************
Created By: James Corr
E-Mail: james.corr@eonreality.com
QUICK NODE STUFF 
Last Edited by Ruben Wood 29/09/2017
ruben.wood@eonreality
Change(s) Made:
hidden to visible for EON10 compatability
****************************************************************************/

function CNode(_Node) {

	Nodes[hex_sha1(GetNodePath(_Node))] = this;

	Object.defineProperties(this,{
		ref: { value: _Node },
		name: { value: eon.GetNodeName(_Node) },
		path: { value: GetNodePath(_Node) }
	});
}

['position','orientation','scale','visible','worldPosition','worldOrientation','worldScale','ambientColor','diffuseColor','specularColor','opacity'].forEach(function(x) {
	Object.defineProperty(CNode.prototype, x, {
		get : function() {
			var field = this.getField(x);
			if(!field) { return null; }
			return field.get();
		},
		set : function(v) {
			this.setField(x,v);
		},
		toString : { value: function () { return this.getField(x).value; } }
	});
});

Object.defineProperties(CNode.prototype, {
	IsNode: {value:true},
	count: {
		get : function () { return this.getField('Children').count; }
	},
	toString: { value: function () { return this.name; } },
	start: {
		get : function() {
			this.setField('play',true,0,0,'EX')||this.setField('setrun',true);
		}
	},
	stop: {
		get : function() {
			this.setField('stop',true,0,0,'EX')||this.setField('setrun_',true);
		}
	},
	getFieldById: {
		value: function(idx) {
			if(idx < 0 || idx > this.ref.GetFieldCount()) { return null; };
			return Field(this.ref.GetField(idx),this);
		}
	},
	setFieldById: {
		value: function(idx,val) {
			var field = this.getFieldById(idx);
			if(!field) { return false; }
			field.set(val);
			return true;
		}
	},
	show : {
		get : function() {
			this.visible = true;
		}
	},
	hide : {
		get : function() {
			this.visible = false;
		}
	},
	getField: {
		value: function(name,debug,source,ex) {
			if(!hasField(this.ref,name)) {
				ex!=='EX'?_console.log("Node does not have field "+name):0;
				return null; 
			}

			if(GV.DEBUG||(debug?/debug/i.test(debug):0)) {
				_console.log("Getting The Field: "+name+" of Node: "+this.name, null, source);
			}
			return Field(this.ref.GetFieldByName(name),this);
		}
	},
	setField: {
		value: function(name,val,debug,source,ex) {

			var field = this.getField(name,0,0,ex);
			if(!field) { return false; }

			if(GV.DEBUG||(debug?/debug/i.test(debug):0)) { 
				_console.log("Setting The Field: "+name+" of Node: "+this.name+" to "+val, null, source);
			}

			if([11,16,18,20,21,23].includes(field.type)){
				field.count = 0;
				field.push(val);
			} else {
				field.set(val);
			}
			return true;
		}
	},
	parent : {
		value : function(v) {
			v = v||1;
			var resNode = this.ref.GetParentNode();
			for(var i=1; i<v; i++) {
				if(eon.GetNodeName(resNode) === 'Simulation') {
					_console.log('Parent '+v+' does not exist');
					return null;
				}
				resNode = resNode.GetParentNode();
			}
			return Node(resNode);
		}
	},
	parentName : {
		value : function(v) {
			var p = this.parent(v);
			if(!p) { return null; }
			return p.name;
		}
	},
	parentRef : {
		value : function(v) {
			var p = this.parent(v);
			if(!p) { return null; }
			return p.ref;
		}
	},
	child : {
		value : function(v) {
			var field = this.getField('Children'),count = field.count;

			if(!count || v>count-1) {
				if(hasField(this.ref,'GeometryChanged')){
					if(!v) {
						return Node(this.getField('Geometry').value);
					}else if(v===1) {
						return Node(this.getField('Material').value);
					}
				}
			}
			if(!count) { _console.log('Node has no children'); return null; }
			if(v>count-1||v<0) { _console.log('Child '+v+' does not exist'); return null; }
			return Node(field.get(v||0));
		}
	},
	childName : {
		value : function(v) {
			var c = this.child(v);
			if(!c) { return null; }
			return c.name;
		}
	},
	childRef : {
		value : function(v) {
			var c = this.child(v);
			if(!c) { return null; }
			return c.ref;
		}
	},
	fieldCount: { 
		get: function() { return this.ref.GetFieldCount(); }
	},
	find: {
		value: function (node_name,depth) { return _Find(node_name,this.ref,depth); } 
	}
});

/****************************************************************************/
/** Created By : jaymie timperley,James Corr							   **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/
function CNodeCollection(NC){
	this.$ = NC;
}

Object.defineProperties(CNodeCollection.prototype, {
	item : {
		value : function(idx) {
			if(this.$.length === 0) { return null; }
			if(idx === undefined) { return this.$.slice(0); }
			if(idx >= this.$.length || idx < 0) { return null; }
			return this.$[idx];
		}
	},
	count : { get: function () { return this.$.length; } }
});
/****************************************************************************/
/** Created By : jaymie timperley,James Corr							   **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/
// Internal Recursive Method called by eonlib.Find;
// Infinite loop possible if a Child links to a Grandparent.
// Currently I can't see any reason for anyone to do this.
// But I still want to find a solution eon.GetNodePath but 
// not available in iOS using Children but this just results in crash.
function $Find(nodename, root, depth) {
	var nc = [],nodes;
	
	if (checkType(depth,'n')) { 
    nodes = eon.Find(nodename, root, depth); 
  }
	else { 
    nodes = eon.Find(nodename, root); 
  }
	
	for(var i = 0; i < nodes.Count; ++i) { 
    nc.push(Node(nodes.Item(i))); 
  }

	return nc;
}

function $FindByProgID(id,root,depth) {
  var nc = [],nodes;

  if(checkType(depth,'n')) {
    nodes = eon.FindByProgID(id,root,depth);
  }
  else {
    nodes = eon.FindByProgID(id,root);
  }

  for(var i = 0; i < nodes.Count; ++i) {
    nc.push(Node(nodes.item(i)));
  }

  return nc;
}

// Rewritten eon.Find as recursively search the Simulation Tree
// It will search anything with TreeChildren.
// Also return CNodeCollection custom class see CNodeCollection.js
function _Find(nodename,root,depth) {
  var nc = $Find(nodename,root,depth);

  return (new CNodeCollection(nc));
}

function _FindByProgID(_id,root,depth) {
  var nc = $FindByProgID(_id,root,depth);

  return (new CNodeCollection(nc));
}

function GetNodePath(node,path) {
	if(node === undefined) { return ""; }
	path = path || [];
	if(node && node.IsNode) { return node.path; }

	var par = node;
	var name = eon.GetNodeName(par);
	path.push(name);
	
	while(name != "Simulation") {
		par = par.GetParentNode();
		name = eon.GetNodeName(par);
		path.push(name);
	}
	return path.reverse().join("!");
}

function $Hash(str) {
  var str   = str.replace(/\s+/g,""),
      _res  = new CHashTable(),
      props = str.split(";"),
      prop,val,tmp,
      paramIdx = 1;

  for(var i = 0; i < props.length; ++i) {
    // Get flags for events
    if(props[i].indexOf("=") < 0) {
      prop = props[i];
      _res[prop] = arguments[paramIdx++];
    } else {
      tmp = props[i].split("=");
      prop = tmp[0];
      val = tmp[1];

      if(/ease/i.test(prop)) {
        _res[prop] = val === 'false'?false:val;
      } else if(/(yes|no|true|false|on|off)/i.test(val) && prop !== 'field') {
        if(/(yes|no|on|off)/i.test(val)) {
          if(/(yes|on)$/i.test(val)) {
            _res[prop] = true;
          } else if(/(no|off)$/i.test(val)) {
            _res[prop] = false;
          }
        } else {
          _res[prop] = val === 'true'?true:false;
        }
      } else if(/\(-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?\)/.test(val)) {
        _res[prop] = Vector4(val);
      } else if(/\(-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?\)/.test(val)) {
        _res[prop] = Vector3(val);
      } else if(/\(-?\d+(\.\d+)?,-?\d+(\.\d+)?\)/.test(val)) {
        _res[prop] = Vector2(val);
      } else if(/-?\d+(.\d+)?/.test(val) && prop !== 'name') {
        _res[prop] = Number(val);
      } else {
        _res[prop] = val;
      }
    }
  }
  return _res;
};

function findParam(_args,_test,_split) {
  var res;
  argumentsToArray(_args).forEach(function(v) {
    if(checkType(v,'s') && _test.test(v)) {
      res=v.split(_split)[1].toLowerCase();
    }else if(v && v.IsArray) {
      v.forEach(function(x) {
        if(checkType(x,'s') && _test.test(x)) {
          res=x.split(_split)[1].toLowerCase();
        }
      });
    }
  });
  return res||false;
}

/*****************************************************************************/
/** Created By : jaymie timperley,James Corr                               **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/*****************************************************************************/
/*****************************************************************************/
/** TRANSFORMS                                                              **/
/*****************************************************************************/
var Transformations = {};
function _TransformFunc(node,field,transform,time,callback) {

  node = _GA.getNode(node);
  if(!node) { return; }

  var debug     = false,
      smooth    = true,
      ease      = false,
      magnitude = false,
      delay     = 0,
      args      = argumentsToArray(arguments).join(''),
      hash,hex;

  if(/debug/i.test(args)) {debug = true;}
  if(/smooth=(no|false|off)/i.test(args)) {smooth = false;}
  if(/delay=([0-9])/i.test(args)) {delay = findParam(arguments,/delay/i,'=');}
  if(/ease/i.test(args)) {ease = findParam(arguments,/ease/i,/ease/i);}
  if(/magnitude/i.test(args)) {magnitude = findParam(arguments,/magnitude/i,'=');}

  hash = "target="+(transform.IsArray?"("+transform.join(",")+")":transform)+";time="+time+";smooth="+smooth+";name="+node.name+";field="+field+";debug="+debug+";ease="+ease+";magnitude="+magnitude;
  if(arguments[4] && checkType(arguments[4],'f')) { hash += ";oncomplete"; }
  if(arguments.length > 5 && checkType(arguments[4],'f')) { hash += ";oncompleteargs"; }

  hash  = $Hash(hash,callback,Array.prototype.slice.call(arguments,5));
  field = node.getField(field);
  hex   = hex_sha1(node.path+":"+field.name);

  if(!field) { return; }
  if(Transformations.hasOwnProperty(hex)) {unRegister(Transformations[hex]);}

  if(delay) {
    Transformations[hex]=registerEvent('ONCE', delay, null, function() {
      Transformations[hex]=registerEvent("FRAME",null,$transform,field,field.get(),hash);
    });
  }
  else {
    Transformations[hex]=registerEvent("FRAME",null,$transform,field,field.get(),hash);
  }

  return function() {unRegister(Transformations[hex]); delete Transformations[hex];}
}
/****************************************************************************/
/** Created By : jaymie timperley,James Corr                               **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/
(function () {
	var ethis = Node(eonthis);

	for(var i = 8; i < ethis.fieldCount; ++i) {
		var f = ethis.getFieldById(i);
		if(f) { global[f.name] = f; }
	}
 }());
/****************************************************************************/
/** Created By : jaymie timperley,James Corr							   **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/
 var _GA = (function() {/* <----- GLOBAL_ACTIONS Object START -----> */

	return {

		setField : function(node,field,setvalue,debug,source) {/* <***** SetField Method START *****> */

			var _node = _GA.getNode(node);

			if(!_node) { return; }

			_node.setField(field,setvalue,debug,source);
		},/* <***** SetField Method END *****> */

		getField : function(node,field,debug,source) {/* <***** GetField Method START *****> */

			var _node = _GA.getNode(node);

			if(!_node) { return; }

			return _node.getField(field).get();
		},/* <***** GetField Method END *****> */
	
		getNode : function(node) {/* <***** GetNode Method START *****> */
			
			if(node&&node.IsNode) { return node; }

			if (checkType(node,'s')) {
				try { node = eon.FindNode(node); }
				catch(e) { _console.log("Could Not Find Node: "+node); return null; }
			}

			if(!node.hasOwnProperty('GetField') || node.IsArray) { return null; }

			return Node(node);
		},/* <***** GetNode Method END *****> */

		setProperty : function(property,setvalue,obj) {/* <***** SetProperty Method START *****> */
			
			if(checkType(obj,'o')) {
				
				obj[property] = setvalue;
				return;
			}
			
			GV[property] = setvalue;
		},/* <***** SetProperty Method END *****> */

		find : function(name,root,depth) {
			return _Find(name,_GA.getNode(root||"Simulation!Scene").ref,depth);
		},

		findByProgID : function(_id,root,depth) {
			return _FindByProgID(_id,_GA.getNode(root||"Simulation!Scene").ref,depth);
		}
	};
})();/* <----- GLOBAL_ACTIONS Object END -----> */

var	_Transform = (function() {/* <----- Transform Object START -----> */
  
	var Rotations		=	{};

	function Args(start,args) {/* <***** Args Function START *****> */
	  
		var arr = [];

		for(var i = start; i < args.length; ++i) {
			
			if(checkType(args[i],'f')) {
				continue;
			}
			arr.push(args[i]);	
		}
		return arr;
	}/* <***** Args Function END *****> */

	function Frame(node) {/* <***** Frame Function START *****> */
	  
		var ActiveID = null;

		this.rotate = function(axis,laptime,state,debug) {
		  
			if(ActiveID) {
			  
				unRegister(ActiveID);
				ActiveID = null;
			}
			
			if(!laptime||!state) {	return;	}

			ActiveID = registerEvent("FRAME",null,function(ev) {
				var V3	= node.orientation.v.map(function(v,i) {return v + (axis[i] * ev.dt) * (360/laptime);});
				node.setField('Orientation',V3,debug,'Transform Rotate on Node: '+node.name);
			});
		};
	}/* <***** Frame Function END *****> */

	function getFrame(node) {
		var node = _GA.getNode(node);
		if(!node) { return null; }
		return new Frame(node);
	}
		
	return {
		position : function(node,transform,time,callback)	{/* <***** Position Method START *****> */
	  		return _TransformFunc(node,"Position",transform,time,callback,Args(3,arguments));
		},/* <***** Position Method END *****> */
		orientation : function(node,transform,time,callback)	{/* <***** Orientation Method START *****> */
	  
	  		return _TransformFunc(node,"Orientation",transform,time,callback,Args(3,arguments));
		},/* <***** Orientation Method END *****> */
		scale : function(node,transform,time,callback)	{/* <***** Scale Method START *****> */

			return _TransformFunc(node,"Scale",transform,time,callback,Args(3,arguments));
		},/* <***** Scale Method END *****> */
		other : function(node,field,transform,time,callback) {/* <***** Other Method START *****> */

			return _TransformFunc(node,field,transform,time,callback,Args(4,arguments));
		},/* <***** Other Method END *****> */
		rotate : function(node,axis,laptime,state,debug) {/* <***** Rotate Method START *****> */

			if(!Rotations.hasOwnProperty(node)) {
				var temp = getFrame(node);
				if(!temp) { return; }
				Rotations[node]	= temp;
			}
			Rotations[node].rotate(axis,laptime,state,debug);
		}/* <***** Rotate Method END *****> */
	};
})();/* <----- Transform Object END -----> */

global.GA = Object.freeze(_GA);
global.Transform = Object.freeze(_Transform);
global.GV = {};
/****************************************************************************/
/** Created By: Jaymie Timperley                                           **/
/** Last Modified: 06/07/2015 14:52:00                                     **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/

/****************************************************************************/
/** PURPOSE: This object is intended to be used as way of implementing     **/
/**          ubiquituous timing mechanisms that will also be used for some **/
/**          utility function that will produce opertions over time.       **/
/**                                                                        **/
/**          This can be used to trigger one shot function after x amount  **/
/**          of time. Trigger every frame until a specific time. Trigger   **/
/**          every x amount of time. Finally trigger every frame.          **/
/**                                                                        **/
/**          Script using functionality provided by this script needs:     **/
/**          GlobalTimer SFNode field                                      **/
/**          Time SFFloat eventIn                                          **/
/**                                                                        **/
/**          NOTE: If using this make sure nothing else uses               **/
/**                eventsProcessed if you want anything running per frame  **/
/**                Register a function with the Timing.RegisterEvent()     **/
/**                function.                                               **/
/**          EXAMPLE: Timing.RegisterEvent("FRAME",null,Example);          **/
/**                   Where Example is function defined as such:           **/
/**                   function Example() { return true; };                 **/
/**                   Any arguments passed after example will passed to    **/
/**                   the function                                         **/
/****************************************************************************/

// Timing Namespace
var Timing = (function () {
/****************************************************************************/
/** INITIALIZATION                                                         **/
/****************************************************************************/
	var _GlobalTimer = null;

	try {
		_GlobalTimer = GlobalTimer.get();
		_GlobalTimer.setField("StopTime",10000.0);
		_GlobalTimer.setField("StartStopMode",false);
		_GlobalTimer.start;
	} catch(e) {
		_alert("Script require field GlobalTimer SFNode field, this should\n" +
				       "have TimeSensor or link to TimeSensor.\n" +
					   "The Timesensor should not be manipulated by anything\n" +
					   "As it will be configured by this Library.\n" + 
					   "* Script requires field GlobalSimTime SFFloat eventIn","Timing ERROR");
		return null;
	}

	// If all necessary nodes and fields are available return Timing Object
	return (new function () {

	/****************************************************************************/
	/** PRIVATE VARIABLES                                                      **/
	/****************************************************************************/

		var Time = GlobalSimTime;
		Time.value = 0.0;
		var Events = {},EventQueues = {};

	/****************************************************************************/
	/** CLASSES                                                                **/
	/****************************************************************************/

		/************************************************************************/
		/** CLASSES (EVENT)                                                    **/
		/************************************************************************/

		function Event(ID, _Time, args) {
			if(ID === null) { ID = Event.GetNewID(); }

			var TimeRegistered = _Time,
				TimeRunning = 0.0,
				LastTime = _Time,
				FrameLastTime = _Time,
				Frame = 0,
				Periodic = 0,
				FrameCount = null,
				Time = null,
				Every = null,
				Mode = args.shift().toUpperCase();

			switch(Mode) {
				case "OVER_EVERY":
					Time = args.shift();
					Every = args.shift();
				break;

				case "ONCE":
				case "OVER":
				case "EVERY":
					Time = args.shift();
				break;

				case "FRAMECOUNT":
					FrameCount = args.shift();
				break;
			}

			var obj = args.shift(),
				callback = args.shift();

			return {

				trigger : function (time) {

					var dt = time - LastTime;
					LastTime = time;
					TimeRunning += dt;

					var EventInfo = {};
					EventInfo.id = ID;
					EventInfo.dt = dt;
					EventInfo.Time = TimeRunning;
					EventInfo.MaxTime = Time;

					args.push(EventInfo);

					switch(Mode) {
						case "FRAME":
						case "FRAMECOUNT":
						break;

						case "IMMEDIATE":
							callback.apply(obj,args);
							unRegister(ID);
						break;

						case "ONCE":
							if(TimeRunning > Time) {
								callback.apply(obj,args);
								unRegister(ID);
							}
						break;

						case "OVER":
							if(TimeRunning < Time) {
								callback.apply(obj,args);
							}
							if(TimeRunning > Time) {
								unRegister(ID);
							}
						break;

						case "OVER_EVERY":
							Periodic += dt;
							if(TimeRunning < Time) {
								if(Periodic > Every) {
									Periodic = 0.0;
									callback.apply(obj,args);
								}
							}
							if(TimeRunning > Time) {
								unRegister(ID);
							}
						break;

						case "EVERY":
							Periodic += dt;
							if(Periodic > Time) {
								Periodic = 0.0;
								callback.apply(obj,args);
							}
						break;
					}
					args.pop();
				},
				triggerFrame : function (time) {

					var dt = time - LastTime;
					TimeRunning += dt;
					LastTime = time;

					dt = time - FrameLastTime;
					FrameLastTime = time;

					var EventInfo = {};
					EventInfo.id = ID;
					EventInfo.dt = dt;
					EventInfo.Frame = Frame;
					EventInfo.FrameCount = FrameCount;
					EventInfo.Time = TimeRunning;

					Frame++;

					args.push(EventInfo);

					switch(Mode) {
						case "IMMEDIATE":
						case "ONCE":
						case "OVER":
						case "OVER_EVERY":
						case "EVERY":
						break;

						case "FRAME":
							callback.apply(obj,args);
						break;

						case "FRAMECOUNT":
							if(Frame%FrameCount === 0)
								callback.apply(obj,args);
						break;
					}
					args.pop();
				},
				GetID : function () { return ID; }
			};
		};

		// Want to Modify this to use (new Date() + "_" + inc);
		// And use Associative Array instead of Indexed Array [];

		Event.GetNewID = function () {

			var newId = (new Date()).valueOf().toString();
			var i = 0;
			while(Events.hasOwnProperty("{EVENT:" + newId + "}")) {

				newId = newId.split("_")[0] + "_" + i;
				++i;
			}
			return "{EVENT:" + newId + "}";
		};

		/************************************************************************/
		/** CLASSES (EVENT QUEUE)                                              **/
		/************************************************************************/

		function EventQueue(ID) {

			var ID = ID || EventQueue.GetNewID(),
				Active = [],
				QueueEvents = [],
				ActiveEventID = null;

			return {

				update : function () {
					if(ActiveEventID === null && Active.length === 0) { return; }

					if(Events.hasOwnProperty(ActiveEventID)) { return; }
					if(Active.length === 0) { 
						ActiveEventID = null;
						return;
					}

					var ev = Active.shift();

					ActiveEventID = ev.func.apply(null,ev.args);
				},
				trigger : function () {
					if(ActiveEventID) { return; }
					Active = QueueEvents.slice(0);
					
					var ev = Active.shift();

					ActiveEventID = ev.func.apply(null,ev.args);
				},
				Stop : function () {
					Active.length = 0;
					unRegister(ActiveEventID);
					ActiveEventID = null;
				},
				AddEvent : function () {
					if(ActiveEventID) { return; }
					if(Active.length > 0) { return; }
					var ev = {};
					if(arguments[0].IsFunction) {
						ev.func = arguments[0];
						ev.args = [];
						for(var i = 1; i < arguments.length; ++i) {
							ev.args.push(arguments[i]);
						}	
					} else {
						ev.func = registerEvent;
						ev.args = arguments;
					}
					QueueEvents.push(ev);
				},
				ClearEvents : function () {
					unRegister(ActiveEventID);
					Active.length = 0;
					QueueEvents.length = 0;
					ActiveEventID = null;
				},
				GetID : function () { return ID; },
				IsActive : function () {
					if(Active.length > 0) { return true; }
					if(Events.hasOwnProperty(ActiveEventID)) { return true; }

					return false;
				}
			};
		}

		// Want to Modify this to use (new Date() + "_" + inc);
		// And use Associative Array instead of Indexed Array [];
		EventQueue.GetNewID = function () {
			var newId = (new Date()).valueOf()+'';
			var i = 0;
			while(EventQueues.hasOwnProperty("{EVQ:" + newId + "}")) {
				newId = newId.split("_")[0] + "_" + i;
				++i;
			}
			return "{EVQ:" + newId + "}";
		};

	/*****************************************************************************/
	/** PUBLIC METHODS                                                          **/
	/*****************************************************************************/

		return {

			RegisterEvent : function () {
				var args = [];
				for(var i = 0; i < arguments.length; ++i) {
					args.push(arguments[i]);
				}
				var ev = new Event(null,Time.value,args);
				Events[ev.GetID()] = ev;
				return ev.GetID();
			},
			RegisterEventWithName : function (id) {
				var ev, args = [];
				for(var i = 1; i < arguments.length; ++i) { args.push(arguments[i]); }

				if(Events.hasOwnProperty("{EVENT:" + id + "}")) {
					_alert("Duplicate id requested generating unique id","RegisterEventWithName() INFO");
					ev = new Event(null,Time.value,args);
				} else {
					ev = new Event("{EVENT:" + id + "}",Time.value,args);
				}
				Events[ev.GetID()] = ev;
				return ev.GetID();
			},
			UnregisterEvent : function (id) {
				if(!id) { return; }
				if(Events.hasOwnProperty(id)) { delete Events[id]; }
			},
			StopAll : function () {
				Events = {};
				for(var evq in EventQueues) {
					if(EventQueues.hasOwnProperty(evq)) {
						EventQueues[evq].Stop();
					}
				}
			},
			NewEventQueue : function (name) {
				var evq = new EventQueue(name);
				EventQueues[evq.GetID()] = evq;
				return evq.GetID();
			},
			AddEventToQueue : function (id) {
				if(id === undefined || id === null) { return; }
				if(!EventQueues.hasOwnProperty(id)) { return; }

				var args = [];
				for(var i = 1; i < arguments.length; ++ i) {
					args.push(arguments[i]);
				}

				var evq = EventQueues[id];
				evq.AddEvent.apply(null,args);
			},
			TriggerEventQueue : function (id) {
				if(id === undefined || id === null) { return; }
				if(!EventQueues.hasOwnProperty(id)) { return; }

				EventQueues[id].trigger();
			},
			StopEventQueue : function (id) {
				if(!id) { return; }
				if(!EventQueues.hasOwnProperty(id)) { return; }

				EventQueues[id].Stop();
			},
			RemoveEventQueue : function (id) {
				if(id === undefined || id === null) { return; }
				EventQueues[id].ClearEvents();
				delete EventQueues[id];
			},
			ProcessFrameEvents : function () {
				for(var ev in Events) {
					if(Events.hasOwnProperty(ev)) {
						Events[ev].triggerFrame(Time.value);
					}
				}
			},
			ProcessEvents : function () {
				for(var ev in Events) {
					if(Events.hasOwnProperty(ev)) {
						Events[ev].trigger(Time.value);
					}
				}
			},
			UpdateQueues : function () {
				for(var evq in EventQueues) {
					if(EventQueues.hasOwnProperty(evq)) {
						EventQueues[evq].update();
					}
				}
			}
		};
	}());
}());

if(!Timing) { return; }

global.Timing = Timing;

global.eventsProcessed = function () {
	Timing.ProcessFrameEvents();
};

global.On_GlobalSimTime = function () {
	Timing.ProcessEvents();
	Timing.UpdateQueues();
};
/****************************************************************************/
/** Created By : jaymie timperley,James Corr							   **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/
var Vector = {
	Distance: function (startPosition, endPosition) {
		startPosition = checkValue(startPosition);
		endPosition   = checkValue(endPosition);
		if(!startPosition || !endPosition) {return;}

		return endPosition.sub(startPosition).length;
	},
	Clamp: function (vec,min,max) {
		vec = checkValue(vec);
		if(!vec) {return;}

		return vec.v.iclamp(min,max);
	},
	Lerp: function (startPosition, endPosition, progress, smooth) {

		startPosition = checkValue(startPosition);
		endPosition   = checkValue(endPosition);

		if(startPosition === false || endPosition === false) {return;}

		smooth = smooth || false;

		if(smooth) {
			var M     = Math,
				PI    = M.PI,
				omega = PI*progress;

			progress = 0.5*(M.sin(omega - PI/2) + 1.0);
		}

		if(progress < 0) { progress = 0; }
		if(progress > 1) { progress = 1; }

		return startPosition.mult(1 - progress).add(endPosition.mult(progress)); 
	}
};

function checkValue(val) {
	if(val.IsVector||val.IsNumber) { return val; }
	if(val.IsArray) {var len=val.length; return VectorClass[len<2?2:len>4?4:len](val); }
	return false;
}

function Vector_PA() {
	var $args    = arguments,
		dataSize = $args[0],
		args 	 = $args[1],
		res 	 = [],
		arg;

	for(var i = 0; i < args.length; ++i) {
		if(i > args.length) { break; }
		arg = args[i];
		if(arg.IsVector) {
			res = res.concat(arg.v);
		} else if(arg.IsArray) {
			for(var j = 0; j < arg.length; ++j) { arg[j] = +arg[j]; }
			res = res.concat(arg);
		} 
		else if(arg.IsString) {
			if(/\(-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?\)/.test(arg)) {
				arg = arg.replace(/[()]/g,"").split(",");
				for(var j = 0; j < arg.length; ++j) { arg[j] = +arg[j]; }
				res = res.concat(arg);
			} else if(/-?\d+(\.?\d+)?/.test(arg)) {
				res.push(+arg);
			}
		}
		else if(arg.IsNumber) {
			res.push(arg);
		}

		if(res.length >= dataSize) { break; }
	}

	if(res.length > dataSize) { res = res.slice(0,dataSize); }

	if(res.length === 1) {
		for(var i = 1; i < dataSize; ++i) { res[i] = res[0]; }
	}

	for(var i = 0; i < dataSize; ++i) {
		if(isNaN(res[i]) || !isFinite(res[i])) { res[i] = 0; }
	}
	return res;
}

function swizzle(axes,orig,retarr) {
	retarr = retarr || false;
	axes = axes.toLowerCase().split("");

	var v = [];
	for(var i = 0; i < axes.length; ++i) {
		if(orig[axes[i]]) { v.push(orig[axes[i]]()); }
		else { v.push(0); }	
	}

	if(v.length > 4) { v.length = 4; }
	
	if(retarr) { return v; }

	if(v.length === 2) { return Vector2(v); }
	else if(v.length === 3) { return Vector3(v); }
	else if(v.length === 4) { return Vector4(v); }
}
/****************************************************************************/
/** Created By : jaymie timperley,James Corr							   **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/

function CVector(v,r,VectorClass,Axes) {

	var V = new Array(Axes.length).fill().map(function(x,i) {return v[i]||0;});

	this.V = V;
	this.C = VectorClass;
	this.A = Axes;
	this.D = V.length;
	this.R = r;
}

Object.defineProperties(CVector.prototype,{
	v: {
		get: function () { return this.V.slice(0); },
		set: function () { 
			this.V = Vector_PA.apply(null,[this.D].concat(arguments));
			this.R.value = this.V; 
		}
	},
	set: {
		value: function () {
			this.V = Vector_PA.apply(null,[this.D].concat(arguments));
			return this;
		}
	},
	add: {
		value: function () {
			var v = Vector_PA.apply(null,[this.D].concat(arguments));

			var v2 = [];
			for(var i = 0; i < this.D; ++i) { v2[i] = this.V[i] + v[i]; }

			return this.C(v2);
		}
	},
	iadd: {
		value: function () {
			var v = Vector_PA.apply(null,[this.D].concat(arguments));

			for(var i = 0; i < this.D; ++i) { this.V[i] += v[i]; }

			return this;
		}
	},
	sub: {
		value: function ()  {
			var v = Vector_PA.apply(null,[this.D].concat(arguments));

			var v2 = [];

			for(var i = 0; i < this.D; ++i) { v2[i] = this.V[i] - v[i]; }

			return this.C(v2);
		}
	},
	isub: {
		value: function () {
			var v = Vector_PA.apply(null,[this.D].concat(arguments));

			for(var i = 0; i < this.D; ++i) { this.V[i] -= v[i]; }

			return this;
		}
	},
	mult: {
		value: function () {
			var v = Vector_PA.apply(null,[this.D].concat(arguments));

			var v2 = [];
			for(var i = 0; i < this.D; ++i) { v2[i] = this.V[i] * v[i]; }

			return this.C(v2);
		}
	},
	imult: {
		value: function () {
			var v = Vector_PA.apply(null,[this.D].concat(arguments));

			for(var i = 0; i < this.D; ++i) { this.V[i] *= v[i]; }

			return this;
		}
	},
	div: {
		value: function () {
			var v = Vector_PA.apply(null,[this.D].concat(arguments));

			var v2 = [];
			for(var i = 0; i < this.D; ++i) { v2[i] = this.V[i] / v[i]; }

			return this.C(v2);	
		}
	},
	idiv: {
		value: function () {
			var v = Vector_PA.apply(null,[this.D].concat(arguments));

			for(var i = 0; i < this.D; ++i) { this.V[i] /= v[i]; }

			return this;
		}
	},
	pow: {
		value: function () {
			var v = Vector_PA.apply(null,[this.D].concat(arguments));

			var v2 = [];

			for(var i = 0; i < this.D; ++i) { v2[i] = Math.pow(this.V[i],v[i]); }

			return this.C(v2);
		}
	},
	ipow: {
		value: function () {
			var v = Vector_PA.apply(null,[this.D].concat(arguments));

			for(var i = 0; i < this.D; ++i) { this.V[i] = Math.pow(this.V[i],v[i]); }

			return this;
		}
	},
	negate: {
		value: function () {
			var v2 = [];
			for(var i = 0; i < this.D; ++i) { v2[i] = -this.V[i]; }

			return this.C(v2);
		}
	},
	inegate: {
		value: function () {
			for(var i = 0; i < this.D; ++i) { this.V[i] = -this.V[i]; }

			return this;
		}
	},
	normalize: {
		value: function () {
			var length = this.length;
			var v2 = [];

			for(var i = 0; i < this.D; ++i) { v2[i] = this.V[i] / length; }

			return this.C(v2);
		}
	},
	inormalize: {
		value: function () {
			var length = this.length;
			
			for(var i = 0; i < this.D; ++i) { this.V[i] /=length; }

			return this;	
		}
	},
	clamp: {
		value: function (bounds) {
			var v2 = [];
			for(var i = 0; i < this.D; ++i) {
				if(bounds.min && this.V[i] < bounds.min) { v2[i] = bounds.min; }
				else if(bounds.max && this.V[i] > bounds.max) { v2[i] = bounds.max; }
				else { v2[i] = this.V[i]; }
			}
			return this.C(v2);
		}
	},
	iclamp: {
		value: function (bounds) {
			for(var i = 0; i < this.D; ++i) {
				var arr = this.V;
				if(bounds.min && arr[i] < bounds.min) { arr[i] = bounds.min; }
				else if(bounds.max && arr[i] > bounds.max) { arr[i] = bounds.max; }
			}

			return this;
		}
	},
	dot: {
		value: function () {
		    var v = Vector_PA.apply(null,[this.D].concat(arguments));
		
		    var d = 0;
		    for(var i = 0; i < this.V.length; ++i) { d += this.V[i]*v[i]; }
		    
		    return d;
		}
	},
	swizzle: {
		value: function (axes) {
			axes = axes || this.A;
			return swizzle(axes,this);
		}
	},
	isEqualTo: {
		value: function () {
			var v = Vector_PA.apply(null,[this.D].concat(arguments));

			for(var i = 0; i < this.D; ++i) {
				if(this.V[i] !== v[i]) { return false; }
			}
			return true;
		}
	},
	length: {
		get: function () {
			var squaredSum = 0;
			for(var i = 0; i < this.D; ++i){
				squaredSum += Math.pow(this.V[i],2);
			}
			return Math.sqrt(squaredSum);
		}
	},
	isZero: { get: function () { return this.isEqualTo(); } },
	max: { get: function () { return Math.max.apply(null,this.V); } },
	toString: { value: function () { return "(" + this.V + ")"; } },
	toFixed: {
		value: function (prec) {
			var v = [];
			for(var i = 0; i < this.D; ++i) { v.push(this.V[0].toFixed(prec)); }

			return "(" + this.V + ")";
		}
	},
	cross: function () {
		var v  = Vector_PA.apply(null,[this.D].concat(arguments)),
			v2 = new Array(this.D).fill(1),
			V  = this.V;

		v2[0] = (V.y * v[2]) - (V.z * v[1]);
		v2[1] = (V.z * v[0]) - (V.x * v[2]);
		v2[2] = (V.x * v[1]) - (V.y * v[0]);

		return Vector3(v2);
	},
	icross: function () {
		var v  = Vector_PA.apply(null,[this.D].concat(arguments)),
			v2 = new Array(this.D).fill(1),
			V  = this.V;

		v2[0] = (V.y * v[2]) - (V.z * v[1]);
		v2[1] = (V.z * v[0]) - (V.x * v[2]);
		v2[2] = (V.x * v[1]) - (V.y * v[0]);

		V = v2;
		return this;
	},
	random : { get : function() { 
 			return new Array(this.D).fill().map(function() {
 			  return Math.random();
 			});
 		}
 	},
	IsVector: { value: true },
	value: { get : function() { return this.v; },
			 set : function(n) { this.v=n; } }
});

['x','y','z','w'].forEach(function(c,i) {
	Object.defineProperty(CVector.prototype,c,{
		get: function () { return this.v[i]; },
		set: function (n) {
			var v = this.v;
			v[i] = n;
			this.v = v;
		}
	});
});
/****************************************************************************/
/** Created By : jaymie timperley,James Corr							   **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/
function CVector2(v,r) {
	CVector.call(this,v,r,Vector2,"xy");
}

Object.defineProperty(CVector2.prototype,'IsVector2', { value: true });
CVector2.prototype = Object.create(CVector.prototype);

function Vector2() {
	var v 	 = Vector_PA.apply(null,[2].concat(arguments));
	return (new CVector2(v,argumentsToArray(arguments)[1]));
}
/****************************************************************************/
/** Created By : jaymie timperley,James Corr							   **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/
function CVector3(v,r) {
	CVector.call(this,v,r,Vector3,"xyz");
}

Object.defineProperty(CVector3.prototype,'IsVector3', { value: true });
CVector3.prototype = Object.create(CVector.prototype);

function Vector3() {
	var	v 	 = Vector_PA.apply(null,[3].concat(arguments));
	return (new CVector3(v,argumentsToArray(arguments)[1]));
}

/****************************************************************************/
/** Created By : jaymie timperley,James Corr							   **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/
function CVector4(v,r) {
	CVector.call(this,v,r,Vector4,"xyzw");
}

Object.defineProperty(CVector4.prototype,'IsVector4', { value: true });
CVector4.prototype = Object.create(CVector.prototype);

function Vector4() {
	var v 	 = Vector_PA.apply(null,[4].concat(arguments));
	return (new CVector4(v,argumentsToArray(arguments)[1]));
}
/****************************************************************************/
/** Created By : jaymie timperley,James Corr							   **/
/** E-Mail: jaymie.timperley@eonreality.com                                **/
/****************************************************************************/
global.Vector  = Vector;

var VectorClass = {
 2 : Vector2,
 3 : Vector3,
 4 : Vector4
};

for(var i in VectorClass) {
	global['Vector'+i] = VectorClass[i];
}
(function() {

	var Proto	 = 'prototype',
		ControlP = Controller[Proto],
		CollectP = Collection[Proto];

	function Controller(node) {
		if(!node) {return;}
		this.ref = node;
		this.ID;
	}

	ControlP.start = function(name) {
		this.ref.setField('SelectedAnimation',name,0,0,'EX');
		this.stop();
		this.ref.setField('Start',true,0,0,'EX')||this.ref.start;
	};

	ControlP.stop = function(T) {
		if(T==='S' && this.ID) {
			unRegister(this.ID);
			this.ID = null;
		}
		this.ref.stop;
	};

	ControlP.loop = function(T) {
		this.start();

		if(T==='S') {
			this.ID = registerEvent('FRAME',this,function() {
				if(!this.ref.getField('Status').value) { this.start();}
			});
		}else {
			this.ref.setField('LoopMode', 1);
		}
	};

	function checkForProp(obj,name) {
		return obj.hasOwnProperty(name);
	}

	function Collection(node,type) {
		var $node;

	    $node = _GA.getNode(node);
	    if(!$node) { $node = Field(node.ref,Node(eonthis)); }
	    if(!$node) { return; }

		var Nodes = {},len = $node.count,i=0;
		this.$ = Nodes;
		this.T = type;

		for(; i<len; ++i) {
			var child = $node.child(i);
			Nodes[child.name] = new Controller(child);
		}
	}

	CollectP.start = function(name,animation) {
		if(checkForProp(this.$,name)) {
			this.$[name].start(animation);
		}
	};

	CollectP.stop = function(name) {
		if(checkForProp(this.$,name)) {
			this.$[name].stop(this.T);
		}
	};

	CollectP.loop = function(name) {
		if(checkForProp(this.$,name)) {
			this.$[name].loop(this.T);
		}
	};

	function AudioCollection(node,type) {
		Collection.call(this,node,type);
	}

	AudioCollection[Proto] = Object.create(CollectP);

	AudioCollection[Proto].play = function(name,animation) {
		this.start(name,animation);
	};

	global.AnimationController = function(node) {
		return new Collection(node,'A');
	};

	global.AudioController = function(node) {
		return new AudioCollection(node,'S');
	};
})();
/* <----- Wandifier Object START -----> */
function CWandifier(node,countDown,callback,reticle,reticleName,scaleTo,scaleFrom) {
	if(!node) { return; }
	var target 		= node.getField('Target'),
		intersected = node.getField('Intersected'),
		withinRange	= node.getField('WithinRange'),
		wandTargets	= new _GetTarget(node),
		countDown 	= countDown||1,
		excludes 	= {m:[],r:[]},
		private 	= {
			x:function() { return excludes;},
			t:function() { return GetNodePath(target.value);},
			c:function() { return continuous;},
			r:function() { return rangeMode;},
			m:function() { return selectClickMode;},
			w:function() { return withinRange.value;},
			d:function() { return cycleDone;},
			e:function() { return ease;},
			a:function() { return active;}
		},
		lastTarget		= null,
		cycleDone		= false,
		continuous		= false,
		rangeMode 		= false,
		selectClickField= null,
		selectClickMode	= false,
		ease			= false,
		active			= true,
		time			= 0;

	if(reticle) { Reticle.call(this,countDown,private,reticleName,scaleTo,scaleFrom); }

	registerEvent('FRAME', this, function(ev) {

		if(!active) { return; }

		if(rangeMode && !withinRange.value) {
			cycleDone = false;
			time = 0;
			return;
		}

		if(intersected.value&&!excludes.m.includes(private.t())) {

			var currentTarget = private.t();

			if(currentTarget != lastTarget) {time = 0; cycleDone=false;}

			time += ev.dt;

			if(time >= countDown && !cycleDone) {
				if(selectClickMode && !selectClickField.value) { return; }
				if(checkType(callback,'f')) { callback(wandTargets.target());}
				cycleDone = (continuous?false:true);
				time = 0;
			}
			if(selectClickField) { selectClickField.value = false; }
			lastTarget = currentTarget;
		} else {
			cycleDone = false;
			time = 0;
		}
	});

	Object.defineProperties(this, {
		countDown: {
			get: function () {return countDown;},
			set: function (val) {countDown = val;}
		},
		intersected: { 
			get: function() {return intersected.value;} 
		},
		target: {
			get: function() {return wandTargets.target();}
		},
		exclude: {
			value: function(v) {addExclude(v,excludes.m);} 
		},
		reticleExclude: { 
			value: function(v) {addExclude(v,excludes.r);}
		},
		removeExclude: {
			value: function(v) {excludes.m=removeExclude(v,excludes.m);}
		},
		removeReticleExclude: {
			value: function(v) {excludes.r=removeExclude(v,excludes.r);}
		},
		reset: { 
			get: function() {excludes={m:[],r:[]};} 
		},
		continuous: {
			set: function(v) {continuous=v;}
		},
		withinRange: {
			set: function(v) {rangeMode=v;}
		},
		selectAndClick: {
			value: function(v,f) {selectClickMode=f?v:null; selectClickField=v?f:null;}
		},
		ease: {
			set: function(v) {
				if(/ease/i.test(v)) {
					v = v.split(/ease/i)[1].toLowerCase();
					if(EaseTypes.hasOwnProperty(v)) {ease=v;}
				}
			}
		},
		active: {
			set: function(v) {active=v;}
		}
	});
}

global.Wandifier = function(iSector,countDown,callback,reticle,reticleName,scaleTo,scaleFrom) {
	return (new CWandifier(_GA.getNode(iSector),countDown,callback,reticle,reticleName,scaleTo,scaleFrom));
}
/* <----- Wandifier Object END -----> */
function Reticle(countDown,ref,reticleName,scaleTo,scaleFrom) {

	var scaleTo 	= scaleTo||1,
		scaleFrom 	= scaleFrom||0.1,
		reticleName = reticleName||'Reticle',
		reticleRef	= _GA.getNode(reticleName),
		innerRef	= _GA.getNode(reticleName+'-Inner'),
		reticleHide	= false,
		lastTarget  = null,
		pReset		= false,
		pScale		= scaleFrom,
		pTime		= 0,
		pTime2		= 0;

	registerEvent('FRAME',this,function(ev) {

		if(!ref.a() && !reticleHide) {
			reticleRef.hide;
			innerRef.hide;
			reticleHide = true;
		}else if(!ref.a()) {
			return;
		}

		if(ref.c() && pTime > countDown) {pTime=0;}

		if(this.intersected&&!ref.x().m.includes(ref.t())&&!ref.x().r.includes(ref.t())) {

			pReset = false;
			pTime += ev.dt;
			innerRef.hide;
			reticleRef.show;
			var p = pTime/countDown,
				currentTarget = ref.t();

			if(currentTarget != lastTarget) {pTime=0; pTime2=0;}

			if(pTime2 >= 0.25) {
				reticleRef.hide;
				innerRef.show;
			} else if(ref.m()&&ref.d()) {
				pTime2 += ev.dt
				p = EaseTypes.outcubic((pTime2/countDown)*2);
				pScale = Vector.Lerp(scaleTo,scaleFrom,p,true);
			} else if(ref.m() && p < 1) {
				if(ref.e()) {p = EaseTypes[ref.e()](p);}
				pScale = Vector.Lerp(scaleFrom,scaleTo,p,true);
			} else if(ref.m() && p >= 1) {
				pScale = scaleTo;
			} else if(p >= 1) {
				reticleRef.hide;
				innerRef.show;
			} else if (p <= 0.5) {
				//if(ref.e()) {p = EaseTypes[ref.e()](p);}
				pScale = Vector.Lerp(scaleFrom,scaleTo,p*2,true);
			} else {
				//if(ref.e()) {p = EaseTypes[ref.e()](p);}
				pScale = Vector.Lerp(scaleTo,scaleFrom,1-p*2,true);
			}
			reticleRef.scale = [pScale,pScale,pScale];

			lastTarget = currentTarget;

		} else if(!pReset){
			pReset	= true;
			pTime 	= 0;
			pTime2	= 0;
			pScale 	= scaleFrom;
			reticleRef.hide;
			innerRef.show;
			innerRef.scale = [pScale,pScale,pScale];
		}

		if(ref.r() && !ref.w()) {
			pTime 	= 0;
			pTime2	= 0;
			reticleRef.hide;
			innerRef.show;
			innerRef.scale = [pScale,pScale,pScale];
		}
	});
}


})(this);
