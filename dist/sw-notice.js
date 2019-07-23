/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "dJh7");
/******/ })
/************************************************************************/
/******/ ({

/***/ "dJh7":
/*!*******************!*\
  !*** ./src/sw.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports) {

//self.importScripts('/script1.js');
self.addEventListener('activate', function (e) {
  console.log("%c activate event received", 'color:green');
  e.waitUntil(new Promise(function (resolve) {
    setTimeout(function () {
      console.log("%c activate event finished", 'color:green');
      resolve();
    }, 5000);
  }).then(function () {
    return self.clients.claim();
  }));
});
self.addEventListener('fetch', function (e) {
  console.log("%c fetching url: ".concat(e.request.url), 'color:green');
  e.respondWith(fetch(e.request));
});
self.addEventListener('install', function (e) {
  var activeWorker = e.activeWorker;
  console.log("%c install event received", 'color:green');
  self.skipWaiting();
  e.waitUntil(new Promise(function (resolve) {
    setTimeout(function () {
      console.log("%c install event finished", 'color:green');
      resolve();
    }, 5000);
  }));
});
self.addEventListener('message', function (e) {
  console.log("%c message event received", 'color:green', e); // we are a service worker so this is either a Channel or a WindowClient

  var src = e.source;
  self.clients.matchAll({
    includeUncontrolled: true
  }).then(function (clients) {
    // do something with your clients list
    console.log("CLIENTS>>>>", clients);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = clients[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var client = _step.value;

        if (client.visibilityState === 'visible') {// only allowed after you click on "notification", no permission here
          // you will get
          // code: 15
          // message: "Not allowed to focus a window."
          // name: "InvalidAccessError"
          // "Not allowed to focus a window."

          /*client.focus()
          .then(wc => {
              console.log(wc.id);
          })
          .catch(err => {
              console.log('oops something went wrong', err);
          });*/
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }); // showNotifcation do it here

  var body = 'this is the  body of the text'; //const actions = [{ action:'confirm-1', title:'WHAT the fuck', icon: confirm}];
  //e.waitUntil(self.registration.showNotification("Shiny", { actions, tag, badge, body, icon, image, renotify: false, requireInteraction: true, timestamp: Date.now() + 24 * 3600 * 1000 }));
});
self.addEventListener('messageerror', function (e) {
  console.log("%c messageerror event received", 'color:red');
});
self.addEventListener('notificationclick', function (e) {
  var no = e.notification;
  no.onclick;
  no.onerror;
  no.onshow; // doesnt work here

  no.onclose = function () {
    return console.log('notification is closing??');
  };

  no.close();
  var promise = self.clients.matchAll({
    type: 'window'
  }).then(function (clients) {
    var cl = clients;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = cl[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var client = _step2.value;

        if (client.visibilityState === 'visible') {
          return client.focus();
          break;
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return cl[0].focus();
  });
  e.waitUntil(promise);
  console.log("%c notificationclick event received", 'color:green', e);
});
self.addEventListener('notificationclose', function (e) {
  var no = e.notification;
  no.close();
  console.log("%c notificationclose event received", 'color:green');
});
self.addEventListener('push', function (e) {
  console.log("%c push event received", 'color:green');
});
self.addEventListener('pushsubscriptionchange', function (e) {
  console.log("%c pushsubscriptionchange event received", 'color:green');
});
self.addEventListener('sync', function (e) {
  console.log("%c sync event received", 'color:green');
});
self.addEventListener('error', function (e) {
  console.log("%c error event received", 'color:red');
});

/***/ })

/******/ });
//# sourceMappingURL=sw-notice.js.map