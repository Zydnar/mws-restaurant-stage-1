(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Common database helper functions.
 */
var DBHelper = function () {
    function DBHelper() {
        _classCallCheck(this, DBHelper);
    }

    _createClass(DBHelper, null, [{
        key: 'fetchRestaurants',


        /**
         * Fetch all restaurants.
         */
        value: function fetchRestaurants(callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', DBHelper.DATABASE_URL);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    // Got a success response from server!
                    var json = JSON.parse(xhr.responseText);
                    var restaurants = json.restaurants;
                    callback(null, restaurants);
                } else {
                    // Oops!. Got an error from server.
                    var error = 'Request failed. Returned status of ' + xhr.status;
                    callback(error, null);
                }
            };
            xhr.send();
        }

        /**
         * Fetch a restaurant by its ID.
         */

    }, {
        key: 'fetchRestaurantById',
        value: function fetchRestaurantById(id, callback) {
            // fetch all restaurants with proper error handling.
            DBHelper.fetchRestaurants(function (error, restaurants) {
                if (error) {
                    callback(error, null);
                } else {
                    var restaurant = restaurants.find(function (r) {
                        return r.id === 1;
                    });
                    if (restaurant) {
                        // Got the restaurant
                        callback(null, restaurant);
                    } else {
                        // Restaurant does not exist in the database
                        callback('Restaurant does not exist', null);
                    }
                }
            });
        }

        /**
         * Fetch restaurants by a cuisine type with proper error handling.
         */

    }, {
        key: 'fetchRestaurantByCuisine',
        value: function fetchRestaurantByCuisine(cuisine, callback) {
            // Fetch all restaurants  with proper error handling
            DBHelper.fetchRestaurants(function (error, restaurants) {
                if (error) {
                    callback(error, null);
                } else {
                    // Filter restaurants to have only given cuisine type
                    var results = restaurants.filter(function (r) {
                        return r.cuisine_type == cuisine;
                    });
                    callback(null, results);
                }
            });
        }

        /**
         * Fetch restaurants by a neighborhood with proper error handling.
         */

    }, {
        key: 'fetchRestaurantByNeighborhood',
        value: function fetchRestaurantByNeighborhood(neighborhood, callback) {
            // Fetch all restaurants
            DBHelper.fetchRestaurants(function (error, restaurants) {
                if (error) {
                    callback(error, null);
                } else {
                    // Filter restaurants to have only given neighborhood
                    var results = restaurants.filter(function (r) {
                        return r.neighborhood == neighborhood;
                    });
                    callback(null, results);
                }
            });
        }

        /**
         * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
         */

    }, {
        key: 'fetchRestaurantByCuisineAndNeighborhood',
        value: function fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
            // Fetch all restaurants
            DBHelper.fetchRestaurants(function (error, restaurants) {
                if (error) {
                    callback(error, null);
                } else {
                    var results = restaurants;
                    if (cuisine !== 'all') {
                        // filter by cuisine
                        results = results.filter(function (r) {
                            return r.cuisine_type == cuisine;
                        });
                    }
                    if (neighborhood !== 'all') {
                        // filter by neighborhood
                        results = results.filter(function (r) {
                            return r.neighborhood == neighborhood;
                        });
                    }
                    callback(null, results);
                }
            });
        }

        /**
         * Fetch all neighborhoods with proper error handling.
         * @param callback {function}
         */

    }, {
        key: 'fetchNeighborhoods',
        value: function fetchNeighborhoods(callback) {
            // Fetch all restaurants
            DBHelper.fetchRestaurants(function (error, restaurants) {
                if (error) {
                    callback(error, null);
                } else {
                    // Get all neighborhoods from all restaurants
                    var neighborhoods = restaurants.map(function (v, i) {
                        return restaurants[i].neighborhood;
                    });
                    // Remove duplicates from neighborhoods
                    var uniqueNeighborhoods = neighborhoods.filter(function (v, i) {
                        return neighborhoods.indexOf(v) === i;
                    });
                    callback(null, uniqueNeighborhoods);
                }
            });
        }

        /**
         * Fetch all cuisines with proper error handling.
         */

    }, {
        key: 'fetchCuisines',
        value: function fetchCuisines(callback) {
            // Fetch all restaurants
            DBHelper.fetchRestaurants(function (error, restaurants) {
                if (error) {
                    callback(error, null);
                } else {
                    // Get all cuisines from all restaurants
                    var cuisines = restaurants.map(function (v, i) {
                        return restaurants[i].cuisine_type;
                    });
                    // Remove duplicates from cuisines
                    var uniqueCuisines = cuisines.filter(function (v, i) {
                        return cuisines.indexOf(v) === i;
                    });
                    callback(null, uniqueCuisines);
                }
            });
        }

        /**
         * Restaurant page URL.
         */


        /**
         * Restaurant image URL.
         */

    }, {
        key: 'mapMarkerForRestaurant',


        /**
         * Map marker for a restaurant.
         */
        value: function mapMarkerForRestaurant(restaurant, map) {
            return new google.maps.Marker({
                position: restaurant.latlng,
                title: restaurant.name,
                url: DBHelper.urlForRestaurant(restaurant),
                map: map,
                animation: google.maps.Animation.DROP
            });
        }
    }, {
        key: 'DATABASE_URL',


        /**
         * Database URL.
         * Change this to restaurants.json file location on your server.
         */
        get: function get() {
            return '/data/restaurants.json';
        }
    }]);

    return DBHelper;
}();

DBHelper.urlForRestaurant = function (restaurant) {
    return './restaurant.html?id=' + restaurant.id;
};

DBHelper.imageUrlForRestaurant = function (restaurant) {
    return '/img/' + restaurant.photograph;
};

exports.default = DBHelper;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbIkRCSGVscGVyIiwiY2FsbGJhY2siLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJEQVRBQkFTRV9VUkwiLCJvbmxvYWQiLCJzdGF0dXMiLCJqc29uIiwiSlNPTiIsInBhcnNlIiwicmVzcG9uc2VUZXh0IiwicmVzdGF1cmFudHMiLCJlcnJvciIsInNlbmQiLCJpZCIsImZldGNoUmVzdGF1cmFudHMiLCJyZXN0YXVyYW50IiwiZmluZCIsInIiLCJjdWlzaW5lIiwicmVzdWx0cyIsImZpbHRlciIsImN1aXNpbmVfdHlwZSIsIm5laWdoYm9yaG9vZCIsIm5laWdoYm9yaG9vZHMiLCJtYXAiLCJ2IiwiaSIsInVuaXF1ZU5laWdoYm9yaG9vZHMiLCJpbmRleE9mIiwiY3Vpc2luZXMiLCJ1bmlxdWVDdWlzaW5lcyIsImdvb2dsZSIsIm1hcHMiLCJNYXJrZXIiLCJwb3NpdGlvbiIsImxhdGxuZyIsInRpdGxlIiwibmFtZSIsInVybCIsInVybEZvclJlc3RhdXJhbnQiLCJhbmltYXRpb24iLCJBbmltYXRpb24iLCJEUk9QIiwiaW1hZ2VVcmxGb3JSZXN0YXVyYW50IiwicGhvdG9ncmFwaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7SUFHTUEsUTs7Ozs7Ozs7O0FBVUY7Ozt5Q0FHd0JDLFEsRUFBVTtBQUM5QixnQkFBSUMsTUFBTSxJQUFJQyxjQUFKLEVBQVY7QUFDQUQsZ0JBQUlFLElBQUosQ0FBUyxLQUFULEVBQWdCSixTQUFTSyxZQUF6QjtBQUNBSCxnQkFBSUksTUFBSixHQUFhLFlBQU07QUFDZixvQkFBSUosSUFBSUssTUFBSixLQUFlLEdBQW5CLEVBQXdCO0FBQUU7QUFDdEIsd0JBQU1DLE9BQU9DLEtBQUtDLEtBQUwsQ0FBV1IsSUFBSVMsWUFBZixDQUFiO0FBQ0Esd0JBQU1DLGNBQWNKLEtBQUtJLFdBQXpCO0FBQ0FYLDZCQUFTLElBQVQsRUFBZVcsV0FBZjtBQUNILGlCQUpELE1BSU87QUFB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QUhUO0FBSUlTLHFCQUFLQSxHQUpUO0FBS0lnQiwyQkFBV1QsT0FBT0MsSUFBUCxDQUFZUyxTQUFaLENBQXNCQztBQUxyQyxhQURHLENBQVA7QUFTSDs7Ozs7QUEvSkQ7Ozs7NEJBSTBCO0FBQ3RCLG1CQUFPLHdCQUFQO0FBQ0g7Ozs7OztBQVJDNUMsUSxDQTZJS3lDLGdCLEdBQW1CLFVBQUN4QixVQUFEO0FBQUEscUNBQXlDQSxXQUFXRixFQUFwRDtBQUFBLEM7O0FBN0l4QmYsUSxDQWtKSzZDLHFCLEdBQXdCLFVBQUM1QixVQUFEO0FBQUEscUJBQXlCQSxXQUFXNkIsVUFBcEM7QUFBQSxDOztrQkFtQnBCOUMsUSIsImZpbGUiOiJkYmhlbHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDb21tb24gZGF0YWJhc2UgaGVscGVyIGZ1bmN0aW9ucy5cclxuICovXHJcbmNsYXNzIERCSGVscGVyIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERhdGFiYXNlIFVSTC5cclxuICAgICAqIENoYW5nZSB0aGlzIHRvIHJlc3RhdXJhbnRzLmpzb24gZmlsZSBsb2NhdGlvbiBvbiB5b3VyIHNlcnZlci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCBEQVRBQkFTRV9VUkwoKSB7XHJcbiAgICAgICAgcmV0dXJuICcvZGF0YS9yZXN0YXVyYW50cy5qc29uJztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZldGNoIGFsbCByZXN0YXVyYW50cy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGZldGNoUmVzdGF1cmFudHMoY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIERCSGVscGVyLkRBVEFCQVNFX1VSTCk7XHJcbiAgICAgICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkgeyAvLyBHb3QgYSBzdWNjZXNzIHJlc3BvbnNlIGZyb20gc2VydmVyIVxyXG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN0YXVyYW50cyA9IGpzb24ucmVzdGF1cmFudHM7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXN0YXVyYW50cyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIE9vcHMhLiBHb3QgYW4gZXJyb3IgZnJvbSBzZXJ2ZXIuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IChgUmVxdWVzdCBmYWlsZWQuIFJldHVybmVkIHN0YXR1cyBvZiAke3hoci5zdGF0dXN9YCk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGZXRjaCBhIHJlc3RhdXJhbnQgYnkgaXRzIElELlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlJZChpZCwgY2FsbGJhY2spIHtcclxuICAgICAgICAvLyBmZXRjaCBhbGwgcmVzdGF1cmFudHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICAgICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdGF1cmFudCA9IHJlc3RhdXJhbnRzLmZpbmQociA9PiByLmlkID09PSAxKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN0YXVyYW50KSB7IC8vIEdvdCB0aGUgcmVzdGF1cmFudFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3RhdXJhbnQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgZGF0YWJhc2VcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygnUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCcsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgdHlwZSB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZShjdWlzaW5lLCBjYWxsYmFjaykge1xyXG4gICAgICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50cyAgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmdcclxuICAgICAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBGaWx0ZXIgcmVzdGF1cmFudHMgdG8gaGF2ZSBvbmx5IGdpdmVuIGN1aXNpbmUgdHlwZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlOZWlnaGJvcmhvb2QobmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xyXG4gICAgICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xyXG4gICAgICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gbmVpZ2hib3Job29kXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgYW5kIGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kKGN1aXNpbmUsIG5laWdoYm9yaG9vZCwgY2FsbGJhY2spIHtcclxuICAgICAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcclxuICAgICAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0cyA9IHJlc3RhdXJhbnRzO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1aXNpbmUgIT09ICdhbGwnKSB7IC8vIGZpbHRlciBieSBjdWlzaW5lXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gY3Vpc2luZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobmVpZ2hib3Job29kICE9PSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgbmVpZ2hib3Job29kXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGZXRjaCBhbGwgbmVpZ2hib3Job29kcyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayB7ZnVuY3Rpb259XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBmZXRjaE5laWdoYm9yaG9vZHMoY2FsbGJhY2spIHtcclxuICAgICAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcclxuICAgICAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBHZXQgYWxsIG5laWdoYm9yaG9vZHMgZnJvbSBhbGwgcmVzdGF1cmFudHNcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5laWdoYm9yaG9vZHMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLm5laWdoYm9yaG9vZCk7XHJcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIG5laWdoYm9yaG9vZHNcclxuICAgICAgICAgICAgICAgIGNvbnN0IHVuaXF1ZU5laWdoYm9yaG9vZHMgPSBuZWlnaGJvcmhvb2RzLmZpbHRlcigodiwgaSkgPT4gbmVpZ2hib3Job29kcy5pbmRleE9mKHYpID09PSBpKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVuaXF1ZU5laWdoYm9yaG9vZHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGZXRjaCBhbGwgY3Vpc2luZXMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBmZXRjaEN1aXNpbmVzKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXHJcbiAgICAgICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gR2V0IGFsbCBjdWlzaW5lcyBmcm9tIGFsbCByZXN0YXVyYW50c1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3Vpc2luZXMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLmN1aXNpbmVfdHlwZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGN1aXNpbmVzXHJcbiAgICAgICAgICAgICAgICBjb25zdCB1bmlxdWVDdWlzaW5lcyA9IGN1aXNpbmVzLmZpbHRlcigodiwgaSkgPT4gY3Vpc2luZXMuaW5kZXhPZih2KSA9PT0gaSk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1bmlxdWVDdWlzaW5lcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc3RhdXJhbnQgcGFnZSBVUkwuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB1cmxGb3JSZXN0YXVyYW50ID0gKHJlc3RhdXJhbnQpID0+IChgLi9yZXN0YXVyYW50Lmh0bWw/aWQ9JHtyZXN0YXVyYW50LmlkfWApO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzdGF1cmFudCBpbWFnZSBVUkwuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbWFnZVVybEZvclJlc3RhdXJhbnQgPSAocmVzdGF1cmFudCkgPT4gKGAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBofWApO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFwIG1hcmtlciBmb3IgYSByZXN0YXVyYW50LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbWFwTWFya2VyRm9yUmVzdGF1cmFudChyZXN0YXVyYW50LCBtYXApIHtcclxuICAgICAgICByZXR1cm4gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcihcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHJlc3RhdXJhbnQubGF0bG5nLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6IHJlc3RhdXJhbnQubmFtZSxcclxuICAgICAgICAgICAgICAgIHVybDogREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSxcclxuICAgICAgICAgICAgICAgIG1hcDogbWFwLFxyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERCSGVscGVyOyJdfQ==
},{}],2:[function(require,module,exports){
"use strict";

var _main = require("./main");

var _restaurant_info = require("./restaurant_info");

var _dbhelper = require("./dbhelper");

var _dbhelper2 = _interopRequireDefault(_dbhelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var neighborhoodsSelect = document.getElementById('neighborhoods-select'),
        cuisinesSelect = document.getElementById('cuisines-select');

    var routeChecker = function routeChecker() {
        var patt = /([\w_.]+)/g;
        return location.pathname.match(patt) || ['/'];
    };
    var sw_update_ready = function sw_update_ready(worker) {
        if (confirm('Update is ready. Refresh now?')) {
            return worker.postMessage({
                action: 'skipWaiting'
            });
        }
    };
    var track_installing = function track_installing(worker) {
        return worker.addEventListener('statechange', function () {
            if (worker.state === 'installed') {
                return sw_update_ready(worker);
            }
        });
    };

    var initSW = function initSW() {
        if (navigator.serviceWorker) {
            navigator.serviceWorker.register('/sw.js').then(function (reg) {
                if (!navigator.serviceWorker.controller) {
                    return;
                } else if (reg.installing) {
                    console.log('Service worker installing');
                    track_installing(reg.installing);
                } else if (reg.waiting) {
                    console.log('Service worker installed');
                } else if (reg.active) {
                    console.log("Service worker active at scope: " + reg.scope);
                }
                return reg.addEventListener('updatefound', function () {
                    return track_installing(reg.installing);
                });
            }).catch(function (err) {
                return console.error('ServiceWorker registration failed with error: ' + err);
            });
        }
    };
    var setInitMap = function setInitMap(type) {
        /**
         * Initialize Google map, called from HTML.
         * @return {function}
         */
        switch (type) {
            case '/':
                self.initMap = function () {
                    var loc = {
                        lat: 40.722216,
                        lng: -73.987501
                    };
                    self.map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 12,
                        center: loc,
                        scrollwheel: false
                    });
                    (0, _main.updateRestaurants)();
                };
                break;
            case 'restaurant.html':
                self.initMap = function () {
                    return (0, _restaurant_info.fetchRestaurantFromURL)(function (error, restaurant) {
                        if (error) {
                            // Got an error!
                            console.error(error);
                        } else {
                            self.map = new google.maps.Map(document.getElementById('map'), {
                                zoom: 16,
                                center: restaurant.latlng,
                                scrollwheel: false
                            });
                            (0, _restaurant_info.fillBreadcrumb)();
                            _dbhelper2.default.mapMarkerForRestaurant(self.restaurant, self.map);
                        }
                    });
                };
                break;
        }
    };
    switch (routeChecker()[0]) {
        case '/':
            setInitMap('/');
            /**
             * Fetch neighborhoods and cuisines as soon as the page is loaded.
             */
            document.addEventListener('DOMContentLoaded', function () {
                (0, _main.fetchNeighborhoods)();
                (0, _main.fetchCuisines)();
            });

            cuisinesSelect.addEventListener('change', function (event) {
                (0, _main.updateRestaurants)();
            });
            neighborhoodsSelect.addEventListener('change', function (event) {
                (0, _main.updateRestaurants)();
            });
            break;
        case 'restaurant.html':
            setInitMap('restaurant.html');
            break;
    }
    initSW(); //init service worker
}).call(undefined); //ensure application runs in right context
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfMTM0MzMwMzcuanMiXSwibmFtZXMiOlsibmVpZ2hib3Job29kc1NlbGVjdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJjdWlzaW5lc1NlbGVjdCIsInJvdXRlQ2hlY2tlciIsInBhdHQiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwibWF0Y2giLCJzd191cGRhdGVfcmVhZHkiLCJ3b3JrZXIiLCJjb25maXJtIiwicG9zdE1lc3NhZ2UiLCJhY3Rpb24iLCJ0cmFja19pbnN0YWxsaW5nIiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0YXRlIiwiaW5pdFNXIiwibmF2aWdhdG9yIiwic2VydmljZVdvcmtlciIsInJlZ2lzdGVyIiwidGhlbiIsInJlZyIsImNvbnRyb2xsZXIiLCJpbnN0YWxsaW5nIiwiY29uc29sZSIsImxvZyIsIndhaXRpbmciLCJhY3RpdmUiLCJzY29wZSIsImNhdGNoIiwiZXJyIiwiZXJyb3IiLCJzZXRJbml0TWFwIiwidHlwZSIsInNlbGYiLCJpbml0TWFwIiwibG9jIiwibGF0IiwibG5nIiwibWFwIiwiZ29vZ2xlIiwibWFwcyIsIk1hcCIsInpvb20iLCJjZW50ZXIiLCJzY3JvbGx3aGVlbCIsInJlc3RhdXJhbnQiLCJsYXRsbmciLCJtYXBNYXJrZXJGb3JSZXN0YXVyYW50IiwiZXZlbnQiLCJjYWxsIl0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxDQUFDLFlBQVk7QUFDVCxRQUFNQSxzQkFBc0JDLFNBQVNDLGNBQVQsQ0FBd0Isc0JBQXhCLENBQTVCO0FBQUEsUUFDSUMsaUJBQWlCRixTQUFTQyxjQUFULENBQXdCLGlCQUF4QixDQURyQjs7QUFHQSxRQUFNRSxlQUFlLFNBQWZBLFlBQWUsR0FBTTtBQUN2QixZQUFNQyxPQUFPLFlBQWI7QUFDQSxlQUFPQyxTQUFTQyxRQUFULENBQWtCQyxLQUFsQixDQUF3QkgsSUFBeEIsS0FBaUMsQ0FBQyxHQUFELENBQXhDO0FBQ0gsS0FIRDtBQUlBLFFBQU1J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QlI7QUFnQ0gsS0FyQ0Q7QUFzQ0EsWUFBUXBDLGVBQWUsQ0FBZixDQUFSO0FBQ0ksYUFBSyxHQUFMO0FBQ0k2Qix1QkFBVyxHQUFYO0FBQ0E7OztBQUdBaEMscUJBQVNjLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxZQUFNO0FBQ2hEO0FBQ0E7QUFDSCxhQUhEOztBQUtBWiwyQkFBZVksZ0JBQWYsQ0FBZ0MsUUFBaEMsRUFBMEMsVUFBQ21DLEtBQUQsRUFBVztBQUNqRDtBQUNILGFBRkQ7QUFHQWxELGdDQUFvQmUsZ0JBQXBCLENBQXFDLFFBQXJDLEVBQStDLFVBQUNtQyxLQUFELEVBQVc7QUFDdEQ7QUFDSCxhQUZEO0FBR0E7QUFDSixhQUFLLGlCQUFMO0FBQ0lqQix1QkFBVyxpQkFBWDtBQUNBO0FBcEJSO0FBc0JBaEIsYUEzR1MsQ0EyR0M7QUFDYixDQTVHRCxFQTRHR2tDLElBNUdILFksQ0E0R2UiLCJmaWxlIjoiZmFrZV8xMzQzMzAzNy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZmV0Y2hDdWlzaW5lcywgZmV0Y2hOZWlnaGJvcmhvb2RzLCB1cGRhdGVSZXN0YXVyYW50c30gZnJvbSAnLi9tYWluJztcclxuaW1wb3J0IHtmZXRjaFJlc3RhdXJhbnRGcm9tVVJMLCBmaWxsQnJlYWRjcnVtYn0gZnJvbSBcIi4vcmVzdGF1cmFudF9pbmZvXCI7XHJcbmltcG9ydCBEQkhlbHBlciBmcm9tIFwiLi9kYmhlbHBlclwiO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IG5laWdoYm9yaG9vZHNTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmVpZ2hib3Job29kcy1zZWxlY3QnKSxcclxuICAgICAgICBjdWlzaW5lc1NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdWlzaW5lcy1zZWxlY3QnKTtcclxuXHJcbiAgICBjb25zdCByb3V0ZUNoZWNrZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGF0dCA9IC8oW1xcd18uXSspL2c7XHJcbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKHBhdHQpIHx8IFsnLyddO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IHN3X3VwZGF0ZV9yZWFkeSA9IGZ1bmN0aW9uICh3b3JrZXIpIHtcclxuICAgICAgICBpZiAoY29uZmlybSgnVXBkYXRlIGlzIHJlYWR5LiBSZWZyZXNoIG5vdz8nKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3NraXBXYWl0aW5nJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBjb25zdCB0cmFja19pbnN0YWxsaW5nID0gKHdvcmtlcikgPT4ge1xyXG4gICAgICAgIHJldHVybiB3b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignc3RhdGVjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh3b3JrZXIuc3RhdGUgPT09ICdpbnN0YWxsZWQnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3dfdXBkYXRlX3JlYWR5KHdvcmtlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaW5pdFNXID0gKCkgPT4ge1xyXG4gICAgICAgIGlmIChuYXZpZ2F0b3Iuc2VydmljZVdvcmtlcikge1xyXG4gICAgICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignL3N3LmpzJykudGhlbigocmVnKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlZy5pbnN0YWxsaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2Ugd29ya2VyIGluc3RhbGxpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFja19pbnN0YWxsaW5nKHJlZy5pbnN0YWxsaW5nKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVnLndhaXRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2VydmljZSB3b3JrZXIgaW5zdGFsbGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlZy5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgU2VydmljZSB3b3JrZXIgYWN0aXZlIGF0IHNjb3BlOiAke3JlZy5zY29wZX1gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZWcuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlZm91bmQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNrX2luc3RhbGxpbmcocmVnLmluc3RhbGxpbmcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQgd2l0aCBlcnJvcjogJyArIGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG4gICAgY29uc3Qgc2V0SW5pdE1hcCA9ICh0eXBlKSA9PiB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5pdGlhbGl6ZSBHb29nbGUgbWFwLCBjYWxsZWQgZnJvbSBIVE1MLlxyXG4gICAgICAgICAqIEByZXR1cm4ge2Z1bmN0aW9ufVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICcvJzpcclxuICAgICAgICAgICAgICAgIHNlbGYuaW5pdE1hcCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbG9jID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXQ6IDQwLjcyMjIxNixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG5nOiAtNzMuOTg3NTAxXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHpvb206IDEyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXI6IGxvYyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlUmVzdGF1cmFudHMoKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncmVzdGF1cmFudC5odG1sJzpcclxuICAgICAgICAgICAgICAgIHNlbGYuaW5pdE1hcCA9ICgpID0+IGZldGNoUmVzdGF1cmFudEZyb21VUkwoXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yLCByZXN0YXVyYW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikgeyAvLyBHb3QgYW4gZXJyb3IhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6b29tOiAxNixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXI6IHJlc3RhdXJhbnQubGF0bG5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsQnJlYWRjcnVtYigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgREJIZWxwZXIubWFwTWFya2VyRm9yUmVzdGF1cmFudChzZWxmLnJlc3RhdXJhbnQsIHNlbGYubWFwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHN3aXRjaCAocm91dGVDaGVja2VyKClbMF0pIHtcclxuICAgICAgICBjYXNlICcvJzpcclxuICAgICAgICAgICAgc2V0SW5pdE1hcCgnLycpO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRmV0Y2ggbmVpZ2hib3Job29kcyBhbmQgY3Vpc2luZXMgYXMgc29vbiBhcyB0aGUgcGFnZSBpcyBsb2FkZWQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZmV0Y2hOZWlnaGJvcmhvb2RzKCk7XHJcbiAgICAgICAgICAgICAgICBmZXRjaEN1aXNpbmVzKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY3Vpc2luZXNTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVSZXN0YXVyYW50cygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbmVpZ2hib3Job29kc1NlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZVJlc3RhdXJhbnRzKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdyZXN0YXVyYW50Lmh0bWwnOlxyXG4gICAgICAgICAgICBzZXRJbml0TWFwKCdyZXN0YXVyYW50Lmh0bWwnKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBpbml0U1coKTsgLy9pbml0IHNlcnZpY2Ugd29ya2VyXHJcbn0pLmNhbGwodGhpcyk7IC8vZW5zdXJlIGFwcGxpY2F0aW9uIHJ1bnMgaW4gcmlnaHQgY29udGV4dFxyXG4iXX0=
},{"./dbhelper":1,"./main":3,"./restaurant_info":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addMarkersToMap = exports.createRestaurantHTML = exports.createResponsiveImg = exports.fillRestaurantsHTML = exports.resetRestaurants = exports.updateRestaurants = exports.fillCuisinesHTML = exports.fetchCuisines = exports.fillNeighborhoodsHTML = exports.fetchNeighborhoods = undefined;

var _dbhelper = require('./dbhelper');

var _dbhelper2 = _interopRequireDefault(_dbhelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var restaurants = void 0,
    neighborhoods = void 0,
    cuisines = void 0,
    map = void 0,
    markers = [];

/**
 * Fetch all neighborhoods and set their HTML.
 * @return {Function}
 */
var fetchNeighborhoods = exports.fetchNeighborhoods = function fetchNeighborhoods() {
    return _dbhelper2.default.fetchNeighborhoods(function (error, neighborhoods) {
        if (error) {
            // Got an error
            console.error(error);
        } else {
            self.neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        }
    });
};

/**
 * Set neighborhoods HTML.
 * @param neighborhoods {Object}
 * @return {void}
 */
var fillNeighborhoodsHTML = exports.fillNeighborhoodsHTML = function fillNeighborhoodsHTML() {
    var neighborhoods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.neighborhoods;

    var select = document.getElementById('neighborhoods-select');
    neighborhoods.forEach(function (neighborhood) {
        var option = document.createElement('option');
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        try {
            select.append(option);
        } catch (e) {
            select.innerHTML += option.outerHTML;
        }
    });
};

/**
 * Fetch all cuisines and set their HTML.
 * @return {void}
 */
var fetchCuisines = exports.fetchCuisines = function fetchCuisines() {
    _dbhelper2.default.fetchCuisines(function (error, cuisines) {
        if (error) {
            // Got an error!
            console.error(error);
        } else {
            self.cuisines = cuisines;
            fillCuisinesHTML();
        }
    });
};

/**
 * Set cuisines HTML.
 * @param cuisines {Object}
 * @return {void}
 */
var fillCuisinesHTML = exports.fillCuisinesHTML = function fillCuisinesHTML() {
    var cuisines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.cuisines;

    var select = document.getElementById('cuisines-select');

    cuisines.forEach(function (cuisine) {
        var option = document.createElement('option');
        option.innerHTML = cuisine;
        option.value = cuisine;
        try {
            select.append(option);
        } catch (e) {
            select.innerHTML += option.outerHTML;
        }
    });
};

/**
 * Update page and map for current restaurants.
 * @return {void}
 */
var updateRestaurants = exports.updateRestaurants = function updateRestaurants() {
    var cSelect = document.getElementById('cuisines-select');
    var nSelect = document.getElementById('neighborhoods-select');

    var cIndex = cSelect.selectedIndex;
    var nIndex = nSelect.selectedIndex;

    var cuisine = cSelect[cIndex].value;
    var neighborhood = nSelect[nIndex].value;

    _dbhelper2.default.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, function (error, restaurants) {
        if (error) {
            // Got an error!
            console.error(error);
        } else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();
        }
    });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 * @param restaurants {Object}
 * @return {void}
 */
var resetRestaurants = exports.resetRestaurants = function resetRestaurants(restaurants) {
    // Remove all restaurants
    self.restaurants = [];
    var ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';

    // Remove all map markers
    self.markers = self.markers ? self.markers : [];
    self.markers.forEach(function (m) {
        return m.setMap(null);
    });
    self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 * @param restaurants {Object}
 * @return {void}
 */
var fillRestaurantsHTML = exports.fillRestaurantsHTML = function fillRestaurantsHTML() {
    var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;

    var ul = document.getElementById('restaurants-list');
    restaurants.forEach(function (restaurant) {
        try {
            ul.append(createRestaurantHTML(restaurant));
        } catch (e) {
            ul.innerHTML += createRestaurantHTML(restaurant).outerHTML;
        }
    });
    addMarkersToMap();
};

/**
 * Generates responsive image HTML
 * @param url {string}
 * @param alt {string}
 * @return {string}
 */
var createResponsiveImg = exports.createResponsiveImg = function createResponsiveImg(url, alt) {
    var urlWithoutExt = url.slice(0, url.length - 4);
    return '<picture class="restaurant-img">\n  <source media="(max-width: 719px)"\n    srcset=".' + urlWithoutExt + '-100-1x.jpg 1x, .' + urlWithoutExt + '-100-2x.jpg 2x, .' + urlWithoutExt + '-100-3x.jpg 3x">\n  <source  media="(min-width: 720px)"\n    srcset=".' + url + ' 1x">\n  <img class="restaurant-img" src=".' + url + '" alt="' + alt + '">\n</picture>';
};

/**
 * Create restaurant HTML.
 * @param restaurant {Object}
 * @return {Element}
 */
var createRestaurantHTML = exports.createRestaurantHTML = function createRestaurantHTML(restaurant) {
    var container = document.createElement('div');
    var randomId = 'n' + String(Math.random()).split('.')[1];
    container.innerHTML = ('<li role="banner" aria-labelledby="' + randomId + '">\n<div id="' + randomId + '">\n' + createResponsiveImg(_dbhelper2.default.imageUrlForRestaurant(restaurant), restaurant.name) + '\n<h1 role="heading">' + restaurant.name + '</h1>\n<p>' + restaurant.neighborhood + '</p>\n<p>' + restaurant.address + '</p>\n</div>\n<a role="link" href="' + _dbhelper2.default.urlForRestaurant(restaurant) + '">View Details</a></li>').replace(/>\s+</, '><'); //just in case browser will render unwanted space
    return container.firstChild;
};

/**
 * Add markers for current restaurants to the map.
 * @param restaurants {Object}
 * @return {Function}
 */
var addMarkersToMap = exports.addMarkersToMap = function addMarkersToMap() {
    var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;
    return restaurants.forEach(function (restaurant) {
        // Add marker to the map
        var marker = _dbhelper2.default.mapMarkerForRestaurant(restaurant, self.map);
        google.maps.event.addListener(marker, 'click', function () {
            window.location.href = marker.url;
        });
        self.markers.push(marker);
    });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsicmVzdGF1cmFudHMiLCJuZWlnaGJvcmhvb2RzIiwiY3Vpc2luZXMiLCJtYXAiLCJtYXJrZXJzIiwiZmV0Y2hOZWlnaGJvcmhvb2RzIiwiZXJyb3IiLCJjb25zb2xlIiwic2VsZiIsImZpbGxOZWlnaGJvcmhvb2RzSFRNTCIsInNlbGVjdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJmb3JFYWNoIiwib3B0aW9uIiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsIm5laWdoYm9yaG9vZCIsInZhbHVlIiwiYXBwZW5kIiwiZSIsIm91dGVySFRNTCIsImZldGNoQ3Vpc2luZXMiLCJmaWxsQ3Vpc2luZXNIVE1MIiwiY3Vpc2luZSIsInVwZGF0ZVJlc3RhdXJhbnRzIiwiY1NlbGVjdCIsIm5TZWxlY3QiLCJjSW5kZXgiLCJzZWxlY3RlZEluZGV4IiwibkluZGV4IiwiZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kIiwicmVzZXRSZXN0YXVyYW50cyIsImZpbGxSZXN0YXVyYW50c0hUTUwiLCJ1bCIsIm0iLCJzZXRNYXAiLCJjcmVhdGVSZXN0YXVyYW50SFRNTCIsInJlc3RhdXJhbnQiLCJhZGRNYXJrZXJzVG9NYXAiLCJjcmVhdGVSZXNwb25zaXZlSW1nIiwidXJsIiwiYWx0IiwidXJsV2l0aG91dEV4dCIsInNsaWNlIiwibGVuZ3RoIiwiY29udGFpbmVyIiwicmFuZG9tSWQiLCJTdHJpbmciLCJNYXRoIiwicmFuZG9tIiwic3BsaXQiLCJpbWFnZVVybEZvclJlc3RhdXJhbnQiLCJuYW1lIiwiYWRkcmVzcyIsInVybEZvclJlc3RhdXJhbnQiLCJyZXBsYWNlIiwiZmlyc3RDaGlsZCIsIm1hcmtlciIsIm1hcE1hcmtlckZvclJlc3RhdXJhbnQiLCJnb29nbGUiLCJtYXBzIiwiZXZlbnQiLCJhZGRMaXN0ZW5lciIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsInB1c2giXSwibWFwcGluZ3Mi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UCxDQUFnQkMsSUFBaEIsR0FBdUJSLE9BQU9qQixHQUE5QjtBQUNILFNBRkQ7QUFHQWpDLGFBQUtKLE9BQUwsQ0FBYStELElBQWIsQ0FBa0JULE1BQWxCO0FBQ0gsS0FQa0UsQ0FBcEM7QUFBQSxDQUF4QiIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERCSGVscGVyIGZyb20gJy4vZGJoZWxwZXInO1xyXG5cclxubGV0IHJlc3RhdXJhbnRzLFxyXG4gICAgbmVpZ2hib3Job29kcyxcclxuICAgIGN1aXNpbmVzLFxyXG4gICAgbWFwLFxyXG4gICAgbWFya2VycyA9IFtdO1xyXG5cclxuLyoqXHJcbiAqIEZldGNoIGFsbCBuZWlnaGJvcmhvb2RzIGFuZCBzZXQgdGhlaXIgSFRNTC5cclxuICogQHJldHVybiB7RnVuY3Rpb259XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZmV0Y2hOZWlnaGJvcmhvb2RzID0gKCkgPT4gREJIZWxwZXIuZmV0Y2hOZWlnaGJvcmhvb2RzKFxyXG4gICAgKGVycm9yLCBuZWlnaGJvcmhvb2RzKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7IC8vIEdvdCBhbiBlcnJvclxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZWxmLm5laWdoYm9yaG9vZHMgPSBuZWlnaGJvcmhvb2RzO1xyXG4gICAgICAgICAgICBmaWxsTmVpZ2hib3Job29kc0hUTUwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbik7XHJcblxyXG4vKipcclxuICogU2V0IG5laWdoYm9yaG9vZHMgSFRNTC5cclxuICogQHBhcmFtIG5laWdoYm9yaG9vZHMge09iamVjdH1cclxuICogQHJldHVybiB7dm9pZH1cclxuICovXHJcbmV4cG9ydCBjb25zdCBmaWxsTmVpZ2hib3Job29kc0hUTUwgPSAobmVpZ2hib3Job29kcyA9IHNlbGYubmVpZ2hib3Job29kcykgPT4ge1xyXG4gICAgY29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25laWdoYm9yaG9vZHMtc2VsZWN0Jyk7XHJcbiAgICBuZWlnaGJvcmhvb2RzLmZvckVhY2gobmVpZ2hib3Job29kID0+IHtcclxuICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gbmVpZ2hib3Job29kO1xyXG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IG5laWdoYm9yaG9vZDtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBzZWxlY3QuYXBwZW5kKG9wdGlvbilcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdC5pbm5lckhUTUwgKz0gb3B0aW9uLm91dGVySFRNTDtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGZXRjaCBhbGwgY3Vpc2luZXMgYW5kIHNldCB0aGVpciBIVE1MLlxyXG4gKiBAcmV0dXJuIHt2b2lkfVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGZldGNoQ3Vpc2luZXMgPSAoKSA9PiB7XHJcbiAgICBEQkhlbHBlci5mZXRjaEN1aXNpbmVzKChlcnJvciwgY3Vpc2luZXMpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHsgLy8gR290IGFuIGVycm9yIVxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZWxmLmN1aXNpbmVzID0gY3Vpc2luZXM7XHJcbiAgICAgICAgICAgIGZpbGxDdWlzaW5lc0hUTUwoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgY3Vpc2luZXMgSFRNTC5cclxuICogQHBhcmFtIGN1aXNpbmVzIHtPYmplY3R9XHJcbiAqIEByZXR1cm4ge3ZvaWR9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZmlsbEN1aXNpbmVzSFRNTCA9IChjdWlzaW5lcyA9IHNlbGYuY3Vpc2luZXMpID0+IHtcclxuICAgIGNvbnN0IHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdWlzaW5lcy1zZWxlY3QnKTtcclxuXHJcbiAgICBjdWlzaW5lcy5mb3JFYWNoKGN1aXNpbmUgPT4ge1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSBjdWlzaW5lO1xyXG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IGN1aXNpbmU7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgc2VsZWN0LmFwcGVuZChvcHRpb24pXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBzZWxlY3QuaW5uZXJIVE1MICs9IG9wdGlvbi5vdXRlckhUTUw7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBwYWdlIGFuZCBtYXAgZm9yIGN1cnJlbnQgcmVzdGF1cmFudHMuXHJcbiAqIEByZXR1cm4ge3ZvaWR9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgdXBkYXRlUmVzdGF1cmFudHMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBjU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1aXNpbmVzLXNlbGVjdCcpO1xyXG4gICAgY29uc3QgblNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZWlnaGJvcmhvb2RzLXNlbGVjdCcpO1xyXG5cclxuICAgIGNvbnN0IGNJbmRleCA9IGNTZWxlY3Quc2VsZWN0ZWRJbmRleDtcclxuICAgIGNvbnN0IG5JbmRleCA9IG5TZWxlY3Quc2VsZWN0ZWRJbmRleDtcclxuXHJcbiAgICBjb25zdCBjdWlzaW5lID0gY1NlbGVjdFtjSW5kZXhdLnZhbHVlO1xyXG4gICAgY29uc3QgbmVpZ2hib3Job29kID0gblNlbGVjdFtuSW5kZXhdLnZhbHVlO1xyXG5cclxuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZUFuZE5laWdoYm9yaG9vZChjdWlzaW5lLCBuZWlnaGJvcmhvb2QsIChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHsgLy8gR290IGFuIGVycm9yIVxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXNldFJlc3RhdXJhbnRzKHJlc3RhdXJhbnRzKTtcclxuICAgICAgICAgICAgZmlsbFJlc3RhdXJhbnRzSFRNTCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn07XHJcblxyXG4vKipcclxuICogQ2xlYXIgY3VycmVudCByZXN0YXVyYW50cywgdGhlaXIgSFRNTCBhbmQgcmVtb3ZlIHRoZWlyIG1hcCBtYXJrZXJzLlxyXG4gKiBAcGFyYW0gcmVzdGF1cmFudHMge09iamVjdH1cclxuICogQHJldHVybiB7dm9pZH1cclxuICovXHJcbmV4cG9ydCBjb25zdCByZXNldFJlc3RhdXJhbnRzID0gKHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAvLyBSZW1vdmUgYWxsIHJlc3RhdXJhbnRzXHJcbiAgICBzZWxmLnJlc3RhdXJhbnRzID0gW107XHJcbiAgICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0Jyk7XHJcbiAgICB1bC5pbm5lckhUTUwgPSAnJztcclxuXHJcbiAgICAvLyBSZW1vdmUgYWxsIG1hcCBtYXJrZXJzXHJcbiAgICBzZWxmLm1hcmtlcnMgPSBzZWxmLm1hcmtlcnMgPyBzZWxmLm1hcmtlcnMgOiBbXTtcclxuICAgIHNlbGYubWFya2Vycy5mb3JFYWNoKG0gPT4gbS5zZXRNYXAobnVsbCkpO1xyXG4gICAgc2VsZi5yZXN0YXVyYW50cyA9IHJlc3RhdXJhbnRzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhbGwgcmVzdGF1cmFudHMgSFRNTCBhbmQgYWRkIHRoZW0gdG8gdGhlIHdlYnBhZ2UuXHJcbiAqIEBwYXJhbSByZXN0YXVyYW50cyB7T2JqZWN0fVxyXG4gKiBAcmV0dXJuIHt2b2lkfVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGZpbGxSZXN0YXVyYW50c0hUTUwgPSAocmVzdGF1cmFudHMgPSBzZWxmLnJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0Jyk7XHJcbiAgICByZXN0YXVyYW50cy5mb3JFYWNoKHJlc3RhdXJhbnQgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHVsLmFwcGVuZChjcmVhdGVSZXN0YXVyYW50SFRNTChyZXN0YXVyYW50KSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB1bC5pbm5lckhUTUwgKz0gY3JlYXRlUmVzdGF1cmFudEhUTUwocmVzdGF1cmFudCkub3V0ZXJIVE1MXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBhZGRNYXJrZXJzVG9NYXAoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgcmVzcG9uc2l2ZSBpbWFnZSBIVE1MXHJcbiAqIEBwYXJhbSB1cmwge3N0cmluZ31cclxuICogQHBhcmFtIGFsdCB7c3RyaW5nfVxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3JlYXRlUmVzcG9uc2l2ZUltZyA9ICh1cmwsIGFsdCkgPT4ge1xyXG4gICAgY29uc3QgdXJsV2l0aG91dEV4dCA9IHVybC5zbGljZSgwLCB1cmwubGVuZ3RoIC0gNCk7XHJcbiAgICByZXR1cm4gYDxwaWN0dXJlIGNsYXNzPVwicmVzdGF1cmFudC1pbWdcIj5cclxuICA8c291cmNlIG1lZGlhPVwiKG1heC13aWR0aDogNzE5cHgpXCJcclxuICAgIHNyY3NldD1cIi4ke3VybFdpdGhvdXRFeHR9LTEwMC0xeC5qcGcgMXgsIC4ke3VybFdpdGhvdXRFeHR9LTEwMC0yeC5qcGcgMngsIC4ke3VybFdpdGhvdXRFeHR9LTEwMC0zeC5qcGcgM3hcIj5cclxuICA8c291cmNlICBtZWRpYT1cIihtaW4td2lkdGg6IDcyMHB4KVwiXHJcbiAgICBzcmNzZXQ9XCIuJHt1cmx9IDF4XCI+XHJcbiAgPGltZyBjbGFzcz1cInJlc3RhdXJhbnQtaW1nXCIgc3JjPVwiLiR7dXJsfVwiIGFsdD1cIiR7YWx0fVwiPlxyXG48L3BpY3R1cmU+YDtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQ3JlYXRlIHJlc3RhdXJhbnQgSFRNTC5cclxuICogQHBhcmFtIHJlc3RhdXJhbnQge09iamVjdH1cclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVSZXN0YXVyYW50SFRNTCA9IChyZXN0YXVyYW50KSA9PiB7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGNvbnN0IHJhbmRvbUlkID0gJ24nICsgU3RyaW5nKE1hdGgucmFuZG9tKCkpLnNwbGl0KCcuJylbMV07XHJcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gYDxsaSByb2xlPVwiYmFubmVyXCIgYXJpYS1sYWJlbGxlZGJ5PVwiJHtyYW5kb21JZH1cIj5cclxuPGRpdiBpZD1cIiR7cmFuZG9tSWR9XCI+XHJcbiR7Y3JlYXRlUmVzcG9uc2l2ZUltZyhEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCksIHJlc3RhdXJhbnQubmFtZSl9XHJcbjxoMSByb2xlPVwiaGVhZGluZ1wiPiR7cmVzdGF1cmFudC5uYW1lfTwvaDE+XHJcbjxwPiR7cmVzdGF1cmFudC5uZWlnaGJvcmhvb2R9PC9wPlxyXG48cD4ke3Jlc3RhdXJhbnQuYWRkcmVzc308L3A+XHJcbjwvZGl2PlxyXG48YSByb2xlPVwibGlua1wiIGhyZWY9XCIke0RCSGVscGVyLnVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCl9XCI+VmlldyBEZXRhaWxzPC9hPjwvbGk+YFxyXG4gICAgICAgIC5yZXBsYWNlKC8+XFxzKzwvLCAnPjwnKTsgLy9qdXN0IGluIGNhc2UgYnJvd3NlciB3aWxsIHJlbmRlciB1bndhbnRlZCBzcGFjZVxyXG4gICAgcmV0dXJuIGNvbnRhaW5lci5maXJzdENoaWxkO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZCBtYXJrZXJzIGZvciBjdXJyZW50IHJlc3RhdXJhbnRzIHRvIHRoZSBtYXAuXHJcbiAqIEBwYXJhbSByZXN0YXVyYW50cyB7T2JqZWN0fVxyXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cclxuICovXHJcbmV4cG9ydCBjb25zdCBhZGRNYXJrZXJzVG9NYXAgPSAocmVzdGF1cmFudHMgPSBzZWxmLnJlc3RhdXJhbnRzKSA9PiByZXN0YXVyYW50cy5mb3JFYWNoKHJlc3RhdXJhbnQgPT4ge1xyXG4gICAgLy8gQWRkIG1hcmtlciB0byB0aGUgbWFwXHJcbiAgICBjb25zdCBtYXJrZXIgPSBEQkhlbHBlci5tYXBNYXJrZXJGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQsIHNlbGYubWFwKTtcclxuICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbWFya2VyLnVybFxyXG4gICAgfSk7XHJcbiAgICBzZWxmLm1hcmtlcnMucHVzaChtYXJrZXIpO1xyXG59KTtcclxuXHJcbiJdfQ==
},{"./dbhelper":1}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getParameterByName = exports.fillBreadcrumb = exports.createReviewHTML = exports.fillReviewsHTML = exports.fillRestaurantHoursHTML = exports.fillRestaurantHTML = exports.fetchRestaurantFromURL = undefined;

var _dbhelper = require('./dbhelper');

var _dbhelper2 = _interopRequireDefault(_dbhelper);

var _main = require('./main');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var restaurant = void 0;

/**
 * Get current restaurant from page URL.
 * @param callback {function}
 */
var fetchRestaurantFromURL = exports.fetchRestaurantFromURL = function fetchRestaurantFromURL(callback) {
    if (self.restaurant) {
        // restaurant already fetched!
        callback(null, self.restaurant);
        return;
    }
    var id = getParameterByName('id');
    if (!id) {
        // no id found in URL
        var error = 'No restaurant id in URL';
        callback(error, null);
    } else {
        _dbhelper2.default.fetchRestaurantById(id, function (error, restaurant) {
            self.restaurant = restaurant;
            if (!restaurant) {
                console.error(error);
                return;
            }
            fillRestaurantHTML();
            callback(null, restaurant);
        });
    }
};

/**
 * Create restaurant HTML and add it to the webpage
 * @param restaurant {Object}
 */
var fillRestaurantHTML = exports.fillRestaurantHTML = function fillRestaurantHTML() {
    var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

    var name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;

    var address = document.getElementById('restaurant-address');
    address.innerHTML = restaurant.address;

    var image = document.getElementById('restaurant-img');
    image.outerHTML = (0, _main.createResponsiveImg)(_dbhelper2.default.imageUrlForRestaurant(restaurant), 'Image of ' + restaurant.name);
    var img = document.getElementsByClassName('restaurant-img')[1];
    img.id = 'restaurant-img';

    var cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;
    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }
    // fill reviews
    fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 * @param operatingHours {Object}
 */
var fillRestaurantHoursHTML = exports.fillRestaurantHoursHTML = function fillRestaurantHoursHTML() {
    var operatingHours = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.operating_hours;

    var hours = document.getElementById('restaurant-hours');
    for (var key in operatingHours) {
        var row = document.createElement('tr');

        var day = document.createElement('td');
        day.innerHTML = key;
        row.appendChild(day);

        var time = document.createElement('td');
        time.innerHTML = operatingHours[key];
        row.appendChild(time);

        hours.appendChild(row);
    }
};

/**
 * Create all reviews HTML and add them to the webpage.
 * @param reviews {array}
 */
var fillReviewsHTML = exports.fillReviewsHTML = function fillReviewsHTML() {
    var reviews = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.reviews;

    var container = document.getElementById('reviews-container');
    var title = document.createElement('h2');
    title.innerHTML = 'Reviews';
    container.appendChild(title);

    if (!reviews) {
        var noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    }
    var ul = document.getElementById('reviews-list');
    reviews.forEach(function (review) {
        ul.appendChild(createReviewHTML(review));
    });
    container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 * @param review {Object}
 */
var createReviewHTML = exports.createReviewHTML = function createReviewHTML(review) {
    var container = document.createElement('div');
    container.innerHTML = ('<li><p>' + review.name + '</p>\n<p>' + review.date + '</p>\n<p class="review-rating">Rating: ' + review.rating + '</p>\n<p>' + review.comments + '</p></li>').replace(/>\s+</, '><');

    return container.firstChild;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 * @param restaurant {Object}
 */
var fillBreadcrumb = exports.fillBreadcrumb = function fillBreadcrumb() {
    var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

    var breadcrumb = document.getElementById('breadcrumb');
    var li = document.createElement('li');
    li.innerHTML = restaurant.name;
    breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 * @param name {String}
 * @param url {String=}
 */
var getParameterByName = exports.getParameterByName = function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RhdXJhbnRfaW5mby5qcyJdLCJuYW1lcyI6WyJyZXN0YXVyYW50IiwiZmV0Y2hSZXN0YXVyYW50RnJvbVVSTCIsImNhbGxiYWNrIiwic2VsZiIsImlkIiwiZ2V0UGFyYW1ldGVyQnlOYW1lIiwiZXJyb3IiLCJmZXRjaFJlc3RhdXJhbnRCeUlkIiwiY29uc29sZSIsImZpbGxSZXN0YXVyYW50SFRNTCIsIm5hbWUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwiYWRkcmVzcyIsImltYWdlIiwib3V0ZXJIVE1MIiwiaW1hZ2VVcmxGb3JSZXN0YXVyYW50IiwiaW1nIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImN1aXNpbmUiLCJjdWlzaW5lX3R5cGUiLCJvcGVyYXRpbmdfaG91cnMiLCJmaWxsUmVzdGF1cmFudEhvdXJzSFRNTCIsImZpbGxSZXZpZXdzSFRNTCIsIm9wZXJhdGluZ0hvdXJzIiwiaG91cnMiLCJrZXkiLCJyb3ciLCJjcmVhdGVFbGVtZW50IiwiZGF5IiwiYXBwZW5kQ2hpbGQiLCJ0aW1lIiwicmV2aWV3cyIsImNvbnRhaW5lciIsInRpdGxlIiwibm9SZXZpZXdzIiwidWwiLCJmb3JFYWNoIiwiY3JlYXRlUmV2aWV3SFRNTCIsInJldmlldyIsImRhdGUiLCJyYXRpbmciLCJjb21tZW50cyIsInJlcGxhY2UiLCJmaXJzdENoaWxkIiwiZmlsbEJyZWFkY3J1bWIiLCJicmVhZGNydW1iIiwibGkiLCJ1cmwiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJyZWdleCIsIlJlZ0V4cCIsInJlc3VsdHMiLCJleGVjIiwiZGVjb2RlVVJJQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBLElBQUlBLG1CQUFKOztBQUVBOzs7O0FBSU8sSUFBTUMsMERBQXlCLFNBQXpCQSxzQkFBeUIsQ0FBQ0MsUUFBRCxFQUFjO0FBQ2hELFFBQUlDLEtBQUtILFVBQVQsRUFBcUI7QUFBRTtB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LGtCQUFxQixDQUFDSyxJQUFELEVBQU91QyxHQUFQLEVBQWU7QUFDN0MsUUFBSSxDQUFDQSxHQUFMLEVBQVM7QUFDTEEsY0FBTUMsT0FBT0MsUUFBUCxDQUFnQkMsSUFBdEI7QUFDSDtBQUNEMUMsV0FBT0EsS0FBS2tDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLE1BQXhCLENBQVA7QUFDQSxRQUFNUyxRQUFRLElBQUlDLE1BQUosVUFBa0I1QyxJQUFsQix1QkFBZDtBQUFBLFFBQ0k2QyxVQUFVRixNQUFNRyxJQUFOLENBQVdQLEdBQVgsQ0FEZDtBQUVBLFFBQUksQ0FBQ00sT0FBTCxFQUFhO0FBQ1QsZUFBTyxJQUFQO0FBQ0g7QUFDRCxRQUFJLENBQUNBLFFBQVEsQ0FBUixDQUFMLEVBQWdCO0FBQ1osZUFBTyxFQUFQO0FBQ0g7QUFDRCxXQUFPRSxtQkFBbUJGLFFBQVEsQ0FBUixFQUFXWCxPQUFYLENBQW1CLEtBQW5CLEVBQTBCLEdBQTFCLENBQW5CLENBQVA7QUFDSCxDQWRNIiwiZmlsZSI6InJlc3RhdXJhbnRfaW5mby5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEQkhlbHBlciBmcm9tIFwiLi9kYmhlbHBlclwiO1xyXG5pbXBvcnQge2NyZWF0ZVJlc3BvbnNpdmVJbWd9IGZyb20gJy4vbWFpbic7XHJcblxyXG5sZXQgcmVzdGF1cmFudDtcclxuXHJcbi8qKlxyXG4gKiBHZXQgY3VycmVudCByZXN0YXVyYW50IGZyb20gcGFnZSBVUkwuXHJcbiAqIEBwYXJhbSBjYWxsYmFjayB7ZnVuY3Rpb259XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZmV0Y2hSZXN0YXVyYW50RnJvbVVSTCA9IChjYWxsYmFjaykgPT4ge1xyXG4gICAgaWYgKHNlbGYucmVzdGF1cmFudCkgeyAvLyByZXN0YXVyYW50IGFscmVhZHkgZmV0Y2hlZCFcclxuICAgICAgICBjYWxsYmFjayhudWxsLCBzZWxmLnJlc3RhdXJhbnQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IGlkID0gZ2V0UGFyYW1ldGVyQnlOYW1lKCdpZCcpO1xyXG4gICAgaWYgKCFpZCkgeyAvLyBubyBpZCBmb3VuZCBpbiBVUkxcclxuICAgICAgICBjb25zdCBlcnJvciA9ICdObyByZXN0YXVyYW50IGlkIGluIFVSTCc7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCAoZXJyb3IsIHJlc3RhdXJhbnQpID0+IHtcclxuICAgICAgICAgICAgc2VsZi5yZXN0YXVyYW50ID0gcmVzdGF1cmFudDtcclxuICAgICAgICAgICAgaWYgKCFyZXN0YXVyYW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaWxsUmVzdGF1cmFudEhUTUwoKTtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudClcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBIVE1MIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2VcclxuICogQHBhcmFtIHJlc3RhdXJhbnQge09iamVjdH1cclxuICovXHJcbmV4cG9ydCBjb25zdCBmaWxsUmVzdGF1cmFudEhUTUwgPSAocmVzdGF1cmFudCA9IHNlbGYucmVzdGF1cmFudCkgPT4ge1xyXG4gICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LW5hbWUnKTtcclxuICAgIG5hbWUuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uYW1lO1xyXG5cclxuICAgIGNvbnN0IGFkZHJlc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1hZGRyZXNzJyk7XHJcbiAgICBhZGRyZXNzLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuYWRkcmVzcztcclxuXHJcbiAgICBjb25zdCBpbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWltZycpO1xyXG4gICAgaW1hZ2Uub3V0ZXJIVE1MID0gY3JlYXRlUmVzcG9uc2l2ZUltZyhEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCksIGBJbWFnZSBvZiAke3Jlc3RhdXJhbnQubmFtZX1gKTtcclxuICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Jlc3RhdXJhbnQtaW1nJylbMV07XHJcbiAgICBpbWcuaWQgPSAncmVzdGF1cmFudC1pbWcnO1xyXG5cclxuICAgIGNvbnN0IGN1aXNpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1jdWlzaW5lJyk7XHJcbiAgICBjdWlzaW5lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuY3Vpc2luZV90eXBlO1xyXG4gICAgLy8gZmlsbCBvcGVyYXRpbmcgaG91cnNcclxuICAgIGlmIChyZXN0YXVyYW50Lm9wZXJhdGluZ19ob3Vycykge1xyXG4gICAgICAgIGZpbGxSZXN0YXVyYW50SG91cnNIVE1MKCk7XHJcbiAgICB9XHJcbiAgICAvLyBmaWxsIHJldmlld3NcclxuICAgIGZpbGxSZXZpZXdzSFRNTCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSByZXN0YXVyYW50IG9wZXJhdGluZyBob3VycyBIVE1MIHRhYmxlIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2UuXHJcbiAqIEBwYXJhbSBvcGVyYXRpbmdIb3VycyB7T2JqZWN0fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGZpbGxSZXN0YXVyYW50SG91cnNIVE1MID0gKG9wZXJhdGluZ0hvdXJzID0gc2VsZi5yZXN0YXVyYW50Lm9wZXJhdGluZ19ob3VycykgPT4ge1xyXG4gICAgY29uc3QgaG91cnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1ob3VycycpO1xyXG4gICAgZm9yIChsZXQga2V5IGluIG9wZXJhdGluZ0hvdXJzKSB7XHJcbiAgICAgICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcclxuXHJcbiAgICAgICAgY29uc3QgZGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICBkYXkuaW5uZXJIVE1MID0ga2V5O1xyXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChkYXkpO1xyXG5cclxuICAgICAgICBjb25zdCB0aW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICB0aW1lLmlubmVySFRNTCA9IG9wZXJhdGluZ0hvdXJzW2tleV07XHJcbiAgICAgICAgcm93LmFwcGVuZENoaWxkKHRpbWUpO1xyXG5cclxuICAgICAgICBob3Vycy5hcHBlbmRDaGlsZChyb3cpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhbGwgcmV2aWV3cyBIVE1MIGFuZCBhZGQgdGhlbSB0byB0aGUgd2VicGFnZS5cclxuICogQHBhcmFtIHJldmlld3Mge2FycmF5fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGZpbGxSZXZpZXdzSFRNTCA9IChyZXZpZXdzID0gc2VsZi5yZXN0YXVyYW50LnJldmlld3MpID0+IHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXdzLWNvbnRhaW5lcicpO1xyXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xyXG4gICAgdGl0bGUuaW5uZXJIVE1MID0gJ1Jldmlld3MnO1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcclxuXHJcbiAgICBpZiAoIXJldmlld3MpIHtcclxuICAgICAgICBjb25zdCBub1Jldmlld3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgbm9SZXZpZXdzLmlubmVySFRNTCA9ICdObyByZXZpZXdzIHlldCEnO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChub1Jldmlld3MpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlld3MtbGlzdCcpO1xyXG4gICAgcmV2aWV3cy5mb3JFYWNoKHJldmlldyA9PiB7XHJcbiAgICAgICAgdWwuYXBwZW5kQ2hpbGQoY3JlYXRlUmV2aWV3SFRNTChyZXZpZXcpKTtcclxuICAgIH0pO1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHVsKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgcmV2aWV3IEhUTUwgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZS5cclxuICogQHBhcmFtIHJldmlldyB7T2JqZWN0fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVJldmlld0hUTUwgPSAocmV2aWV3KSA9PiB7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBgPGxpPjxwPiR7cmV2aWV3Lm5hbWV9PC9wPlxyXG48cD4ke3Jldmlldy5kYXRlfTwvcD5cclxuPHAgY2xhc3M9XCJyZXZpZXctcmF0aW5nXCI+UmF0aW5nOiAke3Jldmlldy5yYXRpbmd9PC9wPlxyXG48cD4ke3Jldmlldy5jb21tZW50c308L3A+PC9saT5gXHJcbiAgICAgICAgLnJlcGxhY2UoLz5cXHMrPC8sICc+PCcpO1xyXG5cclxuICAgIHJldHVybiBjb250YWluZXIuZmlyc3RDaGlsZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgcmVzdGF1cmFudCBuYW1lIHRvIHRoZSBicmVhZGNydW1iIG5hdmlnYXRpb24gbWVudVxyXG4gKiBAcGFyYW0gcmVzdGF1cmFudCB7T2JqZWN0fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGZpbGxCcmVhZGNydW1iID0gKHJlc3RhdXJhbnQgPSBzZWxmLnJlc3RhdXJhbnQpID0+IHtcclxuICAgIGNvbnN0IGJyZWFkY3J1bWIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnJlYWRjcnVtYicpO1xyXG4gICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgbGkuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uYW1lO1xyXG4gICAgYnJlYWRjcnVtYi5hcHBlbmRDaGlsZChsaSk7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IGEgcGFyYW1ldGVyIGJ5IG5hbWUgZnJvbSBwYWdlIFVSTC5cclxuICogQHBhcmFtIG5hbWUge1N0cmluZ31cclxuICogQHBhcmFtIHVybCB7U3RyaW5nPX1cclxuICovXHJcbmV4cG9ydCBjb25zdCBnZXRQYXJhbWV0ZXJCeU5hbWUgPSAobmFtZSwgdXJsKSA9PiB7XHJcbiAgICBpZiAoIXVybCl7XHJcbiAgICAgICAgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICB9XHJcbiAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCAnXFxcXCQmJyk7XHJcbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFs/Jl0ke25hbWV9KD0oW14mI10qKXwmfCN8JClgKSxcclxuICAgICAgICByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG4gICAgaWYgKCFyZXN1bHRzKXtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIGlmICghcmVzdWx0c1syXSl7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcclxufTtcclxuIl19
},{"./dbhelper":1,"./main":3}]},{},[2])