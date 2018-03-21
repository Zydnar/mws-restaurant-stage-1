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
                        return r.id === Number(id);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbIkRCSGVscGVyIiwiY2FsbGJhY2siLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJEQVRBQkFTRV9VUkwiLCJvbmxvYWQiLCJzdGF0dXMiLCJqc29uIiwiSlNPTiIsInBhcnNlIiwicmVzcG9uc2VUZXh0IiwicmVzdGF1cmFudHMiLCJlcnJvciIsInNlbmQiLCJpZCIsImZldGNoUmVzdGF1cmFudHMiLCJyZXN0YXVyYW50IiwiZmluZCIsInIiLCJOdW1iZXIiLCJjdWlzaW5lIiwicmVzdWx0cyIsImZpbHRlciIsImN1aXNpbmVfdHlwZSIsIm5laWdoYm9yaG9vZCIsIm5laWdoYm9yaG9vZHMiLCJtYXAiLCJ2IiwiaSIsInVuaXF1ZU5laWdoYm9yaG9vZHMiLCJpbmRleE9mIiwiY3Vpc2luZXMiLCJ1bmlxdWVDdWlzaW5lcyIsImdvb2dsZSIsIm1hcHMiLCJNYXJrZXIiLCJwb3NpdGlvbiIsImxhdGxuZyIsInRpdGxlIiwibmFtZSIsInVybCIsInVybEZvclJlc3RhdXJhbnQiLCJhbmltYXRpb24iLCJBbmltYXRpb24iLCJEUk9QIiwiaW1hZ2VVcmxGb3JSZXN0YXVyYW50IiwicGhvdG9ncmFwaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7SUFHTUEsUTs7Ozs7Ozs7O0FBVUY7Ozt5Q0FHd0JDLFEsRUFBVTtBQUM5QixnQkFBSUMsTUFBTSxJQUFJQyxjQUFKLEVBQVY7QUFDQUQsZ0JBQUlFLElBQUosQ0FBUyxLQUFULEVBQWdCSixTQUFTSyxZQUF6QjtBQUNBSCxnQkFBSUksTUFBSixHQUFhLFlBQU07QUFDZixvQkFBSUosSUFBSUssTUFBSixLQUFlLEdBQW5CLEVBQXdCO0FBQUU7QUFDdEIsd0JBQU1DLE9BQU9DLEtBQUtDLEtBQUwsQ0FBV1IsSUFBSVMsWUFBZixDQUFiO0FBQ0Esd0JBQU1DLGNBQWNKLEtBQUtJLFdBQXpCO0FBQ0FYLDZCQUFTLElBQVQsRUFBZVcsV0FBZjtBQUNILGlCQUpE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LGdCQUFULENBQTBCekIsVUFBMUIsQ0FIVDtBQUlJVSxxQkFBS0EsR0FKVDtBQUtJZ0IsMkJBQVdULE9BQU9DLElBQVAsQ0FBWVMsU0FBWixDQUFzQkM7QUFMckMsYUFERyxDQUFQO0FBU0g7Ozs7O0FBL0pEOzs7OzRCQUkwQjtBQUN0QixtQkFBTyx3QkFBUDtBQUNIOzs7Ozs7QUFSQzdDLFEsQ0E2SUswQyxnQixHQUFtQixVQUFDekIsVUFBRDtBQUFBLHFDQUF5Q0EsV0FBV0YsRUFBcEQ7QUFBQSxDOztBQTdJeEJmLFEsQ0FrSks4QyxxQixHQUF3QixVQUFDN0IsVUFBRDtBQUFBLHFCQUF5QkEsV0FBVzhCLFVBQXBDO0FBQUEsQzs7a0JBbUJwQi9DLFEiLCJmaWxlIjoiZGJoZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ29tbW9uIGRhdGFiYXNlIGhlbHBlciBmdW5jdGlvbnMuXHJcbiAqL1xyXG5jbGFzcyBEQkhlbHBlciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEYXRhYmFzZSBVUkwuXHJcbiAgICAgKiBDaGFuZ2UgdGhpcyB0byByZXN0YXVyYW50cy5qc29uIGZpbGUgbG9jYXRpb24gb24geW91ciBzZXJ2ZXIuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgREFUQUJBU0VfVVJMKCkge1xyXG4gICAgICAgIHJldHVybiAnL2RhdGEvcmVzdGF1cmFudHMuanNvbic7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGZXRjaCBhbGwgcmVzdGF1cmFudHMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRzKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBEQkhlbHBlci5EQVRBQkFTRV9VUkwpO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHsgLy8gR290IGEgc3VjY2VzcyByZXNwb25zZSBmcm9tIHNlcnZlciFcclxuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdGF1cmFudHMgPSBqc29uLnJlc3RhdXJhbnRzO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudHMpO1xyXG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBPb3BzIS4gR290IGFuIGVycm9yIGZyb20gc2VydmVyLlxyXG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSAoYFJlcXVlc3QgZmFpbGVkLiBSZXR1cm5lZCBzdGF0dXMgb2YgJHt4aHIuc3RhdHVzfWApO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmV0Y2ggYSByZXN0YXVyYW50IGJ5IGl0cyBJRC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGZldGNoUmVzdGF1cmFudEJ5SWQoaWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgLy8gZmV0Y2ggYWxsIHJlc3RhdXJhbnRzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAgICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3RhdXJhbnQgPSByZXN0YXVyYW50cy5maW5kKHIgPT4gci5pZCA9PT0gTnVtYmVyKGlkKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdGF1cmFudCkgeyAvLyBHb3QgdGhlIHJlc3RhdXJhbnRcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXN0YXVyYW50KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIFJlc3RhdXJhbnQgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGRhdGFiYXNlXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soJ1Jlc3RhdXJhbnQgZG9lcyBub3QgZXhpc3QnLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIHR5cGUgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmUoY3Vpc2luZSwgY2FsbGJhY2spIHtcclxuICAgICAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHMgIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nXHJcbiAgICAgICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBjdWlzaW5lIHR5cGVcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBjdWlzaW5lKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGZldGNoUmVzdGF1cmFudEJ5TmVpZ2hib3Job29kKG5laWdoYm9yaG9vZCwgY2FsbGJhY2spIHtcclxuICAgICAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcclxuICAgICAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBGaWx0ZXIgcmVzdGF1cmFudHMgdG8gaGF2ZSBvbmx5IGdpdmVuIG5laWdoYm9yaG9vZFxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IG5laWdoYm9yaG9vZCk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIGFuZCBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZUFuZE5laWdoYm9yaG9vZChjdWlzaW5lLCBuZWlnaGJvcmhvb2QsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXHJcbiAgICAgICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdHMgPSByZXN0YXVyYW50cztcclxuICAgICAgICAgICAgICAgIGlmIChjdWlzaW5lICE9PSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgY3Vpc2luZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5laWdoYm9yaG9vZCAhPT0gJ2FsbCcpIHsgLy8gZmlsdGVyIGJ5IG5laWdoYm9yaG9vZFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IG5laWdoYm9yaG9vZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmV0Y2ggYWxsIG5laWdoYm9yaG9vZHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sge2Z1bmN0aW9ufVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZmV0Y2hOZWlnaGJvcmhvb2RzKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXHJcbiAgICAgICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gR2V0IGFsbCBuZWlnaGJvcmhvb2RzIGZyb20gYWxsIHJlc3RhdXJhbnRzXHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZWlnaGJvcmhvb2RzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5uZWlnaGJvcmhvb2QpO1xyXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBuZWlnaGJvcmhvb2RzXHJcbiAgICAgICAgICAgICAgICBjb25zdCB1bmlxdWVOZWlnaGJvcmhvb2RzID0gbmVpZ2hib3Job29kcy5maWx0ZXIoKHYsIGkpID0+IG5laWdoYm9yaG9vZHMuaW5kZXhPZih2KSA9PT0gaSk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1bmlxdWVOZWlnaGJvcmhvb2RzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmV0Y2ggYWxsIGN1aXNpbmVzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZmV0Y2hDdWlzaW5lcyhjYWxsYmFjaykge1xyXG4gICAgICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xyXG4gICAgICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIEdldCBhbGwgY3Vpc2luZXMgZnJvbSBhbGwgcmVzdGF1cmFudHNcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1aXNpbmVzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5jdWlzaW5lX3R5cGUpO1xyXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBjdWlzaW5lc1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdW5pcXVlQ3Vpc2luZXMgPSBjdWlzaW5lcy5maWx0ZXIoKHYsIGkpID0+IGN1aXNpbmVzLmluZGV4T2YodikgPT09IGkpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdW5pcXVlQ3Vpc2luZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXN0YXVyYW50IHBhZ2UgVVJMLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdXJsRm9yUmVzdGF1cmFudCA9IChyZXN0YXVyYW50KSA9PiAoYC4vcmVzdGF1cmFudC5odG1sP2lkPSR7cmVzdGF1cmFudC5pZH1gKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc3RhdXJhbnQgaW1hZ2UgVVJMLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW1hZ2VVcmxGb3JSZXN0YXVyYW50ID0gKHJlc3RhdXJhbnQpID0+IChgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH1gKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hcCBtYXJrZXIgZm9yIGEgcmVzdGF1cmFudC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIG1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgbWFwKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBnb29nbGUubWFwcy5NYXJrZXIoXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiByZXN0YXVyYW50LmxhdGxuZyxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiByZXN0YXVyYW50Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICB1cmw6IERCSGVscGVyLnVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCksXHJcbiAgICAgICAgICAgICAgICBtYXA6IG1hcCxcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1BcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEQkhlbHBlcjsiXX0=
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
    /**
     * Initialize Google map, called from HTML.
     * @return {function}
     */
    var setInitMap = function setInitMap(type) {
        switch (type) {
            case '/':
                return self.initMap = function () {
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
            case 'restaurant.html':
                return self.initMap = function () {
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

            cuisinesSelect.addEventListener('change', function () {
                (0, _main.updateRestaurants)();
            });
            neighborhoodsSelect.addEventListener('change', function () {
                (0, _main.updateRestaurants)();
            });
            break;
        case 'restaurant.html':
            setInitMap('restaurant.html');
            break;
    }
    initSW(); //init service worker
}).call(undefined); //ensure application runs in right context
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfYzI5MDdjOGIuanMiXSwibmFtZXMiOlsibmVpZ2hib3Job29kc1NlbGVjdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJjdWlzaW5lc1NlbGVjdCIsInJvdXRlQ2hlY2tlciIsInBhdHQiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwibWF0Y2giLCJzd191cGRhdGVfcmVhZHkiLCJ3b3JrZXIiLCJjb25maXJtIiwicG9zdE1lc3NhZ2UiLCJhY3Rpb24iLCJ0cmFja19pbnN0YWxsaW5nIiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0YXRlIiwiaW5pdFNXIiwibmF2aWdhdG9yIiwic2VydmljZVdvcmtlciIsInJlZ2lzdGVyIiwidGhlbiIsInJlZyIsImNvbnRyb2xsZXIiLCJpbnN0YWxsaW5nIiwiY29uc29sZSIsImxvZyIsIndhaXRpbmciLCJhY3RpdmUiLCJzY29wZSIsImNhdGNoIiwiZXJyIiwiZXJyb3IiLCJzZXRJbml0TWFwIiwidHlwZSIsInNlbGYiLCJpbml0TWFwIiwibG9jIiwibGF0IiwibG5nIiwibWFwIiwiZ29vZ2xlIiwibWFwcyIsIk1hcCIsInpvb20iLCJjZW50ZXIiLCJzY3JvbGx3aGVlbCIsInJlc3RhdXJhbnQiLCJsYXRsbmciLCJtYXBNYXJrZXJGb3JSZXN0YXVyYW50IiwiY2FsbCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsQ0FBQyxZQUFZO0FBQ1QsUUFBTUEsc0JBQXNCQyxTQUFTQyxjQUFULENBQXdCLHNCQUF4QixDQUE1QjtBQUFBLFFBQ0lDLGlCQUFpQkYsU0FBU0MsY0FBVCxDQUF3QixpQkFBeEIsQ0FEckI7O0FBR0EsUUFBTUUsZUFBZSxTQUFmQSxZQUFlLEdBQU07QUFDdkIsWUFBTUMsT0FBTyxZQUFiO0FBQ0EsZUFBT0MsU0FBU0MsUUFBVCxDQUFrQkMsS0FBbEIsQ0FBd0JILElBQXhCLEtBQWlDLENBQUMsR0FBRCxDQUF4QztBQUNILEtBSEQ7QUFJQSxRQUFNSSxrQkFBa0Is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LEtBL0JEO0FBZ0NBLFlBQVFwQyxlQUFlLENBQWYsQ0FBUjtBQUNJLGFBQUssR0FBTDtBQUNJNkIsdUJBQVcsR0FBWDtBQUNBOzs7QUFHQWhDLHFCQUFTYyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBTTtBQUNoRDtBQUNBO0FBQ0gsYUFIRDs7QUFLQVosMkJBQWVZLGdCQUFmLENBQWdDLFFBQWhDLEVBQTBDLFlBQU07QUFDNUM7QUFDSCxhQUZEO0FBR0FmLGdDQUFvQmUsZ0JBQXBCLENBQXFDLFFBQXJDLEVBQStDLFlBQU07QUFDakQ7QUFDSCxhQUZEO0FBR0E7QUFDSixhQUFLLGlCQUFMO0FBQ0lrQix1QkFBVyxpQkFBWDtBQUNBO0FBcEJSO0FBc0JBaEIsYUF6R1MsQ0F5R0M7QUFDYixDQTFHRCxFQTBHR2lDLElBMUdILFksQ0EwR2UiLCJmaWxlIjoiZmFrZV9jMjkwN2M4Yi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZmV0Y2hDdWlzaW5lcywgZmV0Y2hOZWlnaGJvcmhvb2RzLCB1cGRhdGVSZXN0YXVyYW50c30gZnJvbSAnLi9tYWluJztcclxuaW1wb3J0IHtmZXRjaFJlc3RhdXJhbnRGcm9tVVJMLCBmaWxsQnJlYWRjcnVtYn0gZnJvbSBcIi4vcmVzdGF1cmFudF9pbmZvXCI7XHJcbmltcG9ydCBEQkhlbHBlciBmcm9tIFwiLi9kYmhlbHBlclwiO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IG5laWdoYm9yaG9vZHNTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmVpZ2hib3Job29kcy1zZWxlY3QnKSxcclxuICAgICAgICBjdWlzaW5lc1NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdWlzaW5lcy1zZWxlY3QnKTtcclxuXHJcbiAgICBjb25zdCByb3V0ZUNoZWNrZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGF0dCA9IC8oW1xcd18uXSspL2c7XHJcbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKHBhdHQpIHx8IFsnLyddO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IHN3X3VwZGF0ZV9yZWFkeSA9IGZ1bmN0aW9uICh3b3JrZXIpIHtcclxuICAgICAgICBpZiAoY29uZmlybSgnVXBkYXRlIGlzIHJlYWR5LiBSZWZyZXNoIG5vdz8nKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3NraXBXYWl0aW5nJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBjb25zdCB0cmFja19pbnN0YWxsaW5nID0gKHdvcmtlcikgPT4ge1xyXG4gICAgICAgIHJldHVybiB3b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignc3RhdGVjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh3b3JrZXIuc3RhdGUgPT09ICdpbnN0YWxsZWQnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3dfdXBkYXRlX3JlYWR5KHdvcmtlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaW5pdFNXID0gKCkgPT4ge1xyXG4gICAgICAgIGlmIChuYXZpZ2F0b3Iuc2VydmljZVdvcmtlcikge1xyXG4gICAgICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignL3N3LmpzJykudGhlbigocmVnKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlZy5pbnN0YWxsaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2Ugd29ya2VyIGluc3RhbGxpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFja19pbnN0YWxsaW5nKHJlZy5pbnN0YWxsaW5nKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVnLndhaXRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2VydmljZSB3b3JrZXIgaW5zdGFsbGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlZy5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgU2VydmljZSB3b3JrZXIgYWN0aXZlIGF0IHNjb3BlOiAke3JlZy5zY29wZX1gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZWcuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlZm91bmQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNrX2luc3RhbGxpbmcocmVnLmluc3RhbGxpbmcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQgd2l0aCBlcnJvcjogJyArIGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIEdvb2dsZSBtYXAsIGNhbGxlZCBmcm9tIEhUTUwuXHJcbiAgICAgKiBAcmV0dXJuIHtmdW5jdGlvbn1cclxuICAgICAqL1xyXG4gICAgY29uc3Qgc2V0SW5pdE1hcCA9ICh0eXBlKSA9PiB7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJy8nOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuaW5pdE1hcCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbG9jID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXQ6IDQwLjcyMjIxNixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG5nOiAtNzMuOTg3NTAxXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHpvb206IDEyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXI6IGxvYyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlUmVzdGF1cmFudHMoKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNhc2UgJ3Jlc3RhdXJhbnQuaHRtbCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5pbml0TWFwID0gKCkgPT4gZmV0Y2hSZXN0YXVyYW50RnJvbVVSTChcclxuICAgICAgICAgICAgICAgICAgICAoZXJyb3IsIHJlc3RhdXJhbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7IC8vIEdvdCBhbiBlcnJvciFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHpvb206IDE2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlcjogcmVzdGF1cmFudC5sYXRsbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxCcmVhZGNydW1iKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEQkhlbHBlci5tYXBNYXJrZXJGb3JSZXN0YXVyYW50KHNlbGYucmVzdGF1cmFudCwgc2VsZi5tYXApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHN3aXRjaCAocm91dGVDaGVja2VyKClbMF0pIHtcclxuICAgICAgICBjYXNlICcvJzpcclxuICAgICAgICAgICAgc2V0SW5pdE1hcCgnLycpO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRmV0Y2ggbmVpZ2hib3Job29kcyBhbmQgY3Vpc2luZXMgYXMgc29vbiBhcyB0aGUgcGFnZSBpcyBsb2FkZWQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZmV0Y2hOZWlnaGJvcmhvb2RzKCk7XHJcbiAgICAgICAgICAgICAgICBmZXRjaEN1aXNpbmVzKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY3Vpc2luZXNTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlUmVzdGF1cmFudHMoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG5laWdoYm9yaG9vZHNTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlUmVzdGF1cmFudHMoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3Jlc3RhdXJhbnQuaHRtbCc6XHJcbiAgICAgICAgICAgIHNldEluaXRNYXAoJ3Jlc3RhdXJhbnQuaHRtbCcpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGluaXRTVygpOyAvL2luaXQgc2VydmljZSB3b3JrZXJcclxufSkuY2FsbCh0aGlzKTsgLy9lbnN1cmUgYXBwbGljYXRpb24gcnVucyBpbiByaWdodCBjb250ZXh0XHJcbiJdfQ==
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
            ul.innerHTML += createRestaurantHTML(restaurant).outerHTML; // support for MS Edge
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
    container.innerHTML = ('<li role="banner" aria-labelledby="' + randomId + '">\n<div id="' + randomId + '">\n' + createResponsiveImg(_dbhelper2.default.imageUrlForRestaurant(restaurant), restaurant.name + ' restaurant photo') + '\n<h2 role="heading">' + restaurant.name + '</h2>\n<p>' + restaurant.neighborhood + '</p>\n<p>' + restaurant.address + '</p>\n</div>\n<a role="link" href="' + _dbhelper2.default.urlForRestaurant(restaurant) + '">View Details</a></li>').replace(/>\s+</, '><'); //just in case browser will render unwanted space
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsicmVzdGF1cmFudHMiLCJuZWlnaGJvcmhvb2RzIiwiY3Vpc2luZXMiLCJtYXAiLCJtYXJrZXJzIiwiZmV0Y2hOZWlnaGJvcmhvb2RzIiwiZXJyb3IiLCJjb25zb2xlIiwic2VsZiIsImZpbGxOZWlnaGJvcmhvb2RzSFRNTCIsInNlbGVjdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJmb3JFYWNoIiwib3B0aW9uIiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsIm5laWdoYm9yaG9vZCIsInZhbHVlIiwiYXBwZW5kIiwiZSIsIm91dGVySFRNTCIsImZldGNoQ3Vpc2luZXMiLCJmaWxsQ3Vpc2luZXNIVE1MIiwiY3Vpc2luZSIsInVwZGF0ZVJlc3RhdXJhbnRzIiwiY1NlbGVjdCIsIm5TZWxlY3QiLCJjSW5kZXgiLCJzZWxlY3RlZEluZGV4IiwibkluZGV4IiwiZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kIiwicmVzZXRSZXN0YXVyYW50cyIsImZpbGxSZXN0YXVyYW50c0hUTUwiLCJ1bCIsIm0iLCJzZXRNYXAiLCJjcmVhdGVSZXN0YXVyYW50SFRNTCIsInJlc3RhdXJhbnQiLCJhZGRNYXJrZXJzVG9NYXAiLCJjcmVhdGVSZXNwb25zaXZlSW1nIiwidXJsIiwiYWx0IiwidXJsV2l0aG91dEV4dCIsInNsaWNlIiwibGVuZ3RoIiwiY29udGFpbmVyIiwicmFuZG9tSWQiLCJTdHJpbmciLCJNYXRoIiwicmFuZG9tIiwic3BsaXQiLCJpbWFnZVVybEZvclJlc3RhdXJhbnQiLCJuYW1lIiwiYWRkcmVzcyIsInVybEZvclJlc3RhdXJhbnQiLCJyZXBsYWNlIiwiZmlyc3RDaGlsZCIsIm1hcmtlciIsIm1hcE1hcmtlckZvclJlc3RhdXJhbnQiLCJnb29nbGUiLCJtYXBzIiwiZXZlbnQiLCJhZGRMaXN0ZW5lciIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsInB1c2giXSwibWFwcGluZ3Mi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RE0sbUJBQU9DLFFBQVAsQ0FBZ0JDLElBQWhCLEdBQXVCUixPQUFPakIsR0FBOUI7QUFDSCxTQUZEO0FBR0FqQyxhQUFLSixPQUFMLENBQWErRCxJQUFiLENBQWtCVCxNQUFsQjtBQUNILEtBUGtFLENBQXBDO0FBQUEsQ0FBeEIiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEQkhlbHBlciBmcm9tICcuL2RiaGVscGVyJztcclxuXHJcbmxldCByZXN0YXVyYW50cyxcclxuICAgIG5laWdoYm9yaG9vZHMsXHJcbiAgICBjdWlzaW5lcyxcclxuICAgIG1hcCxcclxuICAgIG1hcmtlcnMgPSBbXTtcclxuXHJcbi8qKlxyXG4gKiBGZXRjaCBhbGwgbmVpZ2hib3Job29kcyBhbmQgc2V0IHRoZWlyIEhUTUwuXHJcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGZldGNoTmVpZ2hib3Job29kcyA9ICgpID0+IERCSGVscGVyLmZldGNoTmVpZ2hib3Job29kcyhcclxuICAgIChlcnJvciwgbmVpZ2hib3Job29kcykgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikgeyAvLyBHb3QgYW4gZXJyb3JcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2VsZi5uZWlnaGJvcmhvb2RzID0gbmVpZ2hib3Job29kcztcclxuICAgICAgICAgICAgZmlsbE5laWdoYm9yaG9vZHNIVE1MKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIFNldCBuZWlnaGJvcmhvb2RzIEhUTUwuXHJcbiAqIEBwYXJhbSBuZWlnaGJvcmhvb2RzIHtPYmplY3R9XHJcbiAqIEByZXR1cm4ge3ZvaWR9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZmlsbE5laWdoYm9yaG9vZHNIVE1MID0gKG5laWdoYm9yaG9vZHMgPSBzZWxmLm5laWdoYm9yaG9vZHMpID0+IHtcclxuICAgIGNvbnN0IHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZWlnaGJvcmhvb2RzLXNlbGVjdCcpO1xyXG4gICAgbmVpZ2hib3Job29kcy5mb3JFYWNoKG5laWdoYm9yaG9vZCA9PiB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9IG5laWdoYm9yaG9vZDtcclxuICAgICAgICBvcHRpb24udmFsdWUgPSBuZWlnaGJvcmhvb2Q7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgc2VsZWN0LmFwcGVuZChvcHRpb24pXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBzZWxlY3QuaW5uZXJIVE1MICs9IG9wdGlvbi5vdXRlckhUTUw7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogRmV0Y2ggYWxsIGN1aXNpbmVzIGFuZCBzZXQgdGhlaXIgSFRNTC5cclxuICogQHJldHVybiB7dm9pZH1cclxuICovXHJcbmV4cG9ydCBjb25zdCBmZXRjaEN1aXNpbmVzID0gKCkgPT4ge1xyXG4gICAgREJIZWxwZXIuZmV0Y2hDdWlzaW5lcygoZXJyb3IsIGN1aXNpbmVzKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7IC8vIEdvdCBhbiBlcnJvciFcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2VsZi5jdWlzaW5lcyA9IGN1aXNpbmVzO1xyXG4gICAgICAgICAgICBmaWxsQ3Vpc2luZXNIVE1MKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IGN1aXNpbmVzIEhUTUwuXHJcbiAqIEBwYXJhbSBjdWlzaW5lcyB7T2JqZWN0fVxyXG4gKiBAcmV0dXJuIHt2b2lkfVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGZpbGxDdWlzaW5lc0hUTUwgPSAoY3Vpc2luZXMgPSBzZWxmLmN1aXNpbmVzKSA9PiB7XHJcbiAgICBjb25zdCBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3Vpc2luZXMtc2VsZWN0Jyk7XHJcblxyXG4gICAgY3Vpc2luZXMuZm9yRWFjaChjdWlzaW5lID0+IHtcclxuICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gY3Vpc2luZTtcclxuICAgICAgICBvcHRpb24udmFsdWUgPSBjdWlzaW5lO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHNlbGVjdC5hcHBlbmQob3B0aW9uKVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgc2VsZWN0LmlubmVySFRNTCArPSBvcHRpb24ub3V0ZXJIVE1MO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgcGFnZSBhbmQgbWFwIGZvciBjdXJyZW50IHJlc3RhdXJhbnRzLlxyXG4gKiBAcmV0dXJuIHt2b2lkfVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHVwZGF0ZVJlc3RhdXJhbnRzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgY1NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdWlzaW5lcy1zZWxlY3QnKTtcclxuICAgIGNvbnN0IG5TZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmVpZ2hib3Job29kcy1zZWxlY3QnKTtcclxuXHJcbiAgICBjb25zdCBjSW5kZXggPSBjU2VsZWN0LnNlbGVjdGVkSW5kZXg7XHJcbiAgICBjb25zdCBuSW5kZXggPSBuU2VsZWN0LnNlbGVjdGVkSW5kZXg7XHJcblxyXG4gICAgY29uc3QgY3Vpc2luZSA9IGNTZWxlY3RbY0luZGV4XS52YWx1ZTtcclxuICAgIGNvbnN0IG5laWdoYm9yaG9vZCA9IG5TZWxlY3RbbkluZGV4XS52YWx1ZTtcclxuXHJcbiAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmVBbmROZWlnaGJvcmhvb2QoY3Vpc2luZSwgbmVpZ2hib3Job29kLCAoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7IC8vIEdvdCBhbiBlcnJvciFcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzZXRSZXN0YXVyYW50cyhyZXN0YXVyYW50cyk7XHJcbiAgICAgICAgICAgIGZpbGxSZXN0YXVyYW50c0hUTUwoKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsZWFyIGN1cnJlbnQgcmVzdGF1cmFudHMsIHRoZWlyIEhUTUwgYW5kIHJlbW92ZSB0aGVpciBtYXAgbWFya2Vycy5cclxuICogQHBhcmFtIHJlc3RhdXJhbnRzIHtPYmplY3R9XHJcbiAqIEByZXR1cm4ge3ZvaWR9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcmVzZXRSZXN0YXVyYW50cyA9IChyZXN0YXVyYW50cykgPT4ge1xyXG4gICAgLy8gUmVtb3ZlIGFsbCByZXN0YXVyYW50c1xyXG4gICAgc2VsZi5yZXN0YXVyYW50cyA9IFtdO1xyXG4gICAgY29uc3QgdWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudHMtbGlzdCcpO1xyXG4gICAgdWwuaW5uZXJIVE1MID0gJyc7XHJcblxyXG4gICAgLy8gUmVtb3ZlIGFsbCBtYXAgbWFya2Vyc1xyXG4gICAgc2VsZi5tYXJrZXJzID0gc2VsZi5tYXJrZXJzID8gc2VsZi5tYXJrZXJzIDogW107XHJcbiAgICBzZWxmLm1hcmtlcnMuZm9yRWFjaChtID0+IG0uc2V0TWFwKG51bGwpKTtcclxuICAgIHNlbGYucmVzdGF1cmFudHMgPSByZXN0YXVyYW50cztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYWxsIHJlc3RhdXJhbnRzIEhUTUwgYW5kIGFkZCB0aGVtIHRvIHRoZSB3ZWJwYWdlLlxyXG4gKiBAcGFyYW0gcmVzdGF1cmFudHMge09iamVjdH1cclxuICogQHJldHVybiB7dm9pZH1cclxuICovXHJcbmV4cG9ydCBjb25zdCBmaWxsUmVzdGF1cmFudHNIVE1MID0gKHJlc3RhdXJhbnRzID0gc2VsZi5yZXN0YXVyYW50cykgPT4ge1xyXG4gICAgY29uc3QgdWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudHMtbGlzdCcpO1xyXG4gICAgcmVzdGF1cmFudHMuZm9yRWFjaChyZXN0YXVyYW50ID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB1bC5hcHBlbmQoY3JlYXRlUmVzdGF1cmFudEhUTUwocmVzdGF1cmFudCkpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdWwuaW5uZXJIVE1MICs9IGNyZWF0ZVJlc3RhdXJhbnRIVE1MKHJlc3RhdXJhbnQpLm91dGVySFRNTDsgLy8gc3VwcG9ydCBmb3IgTVMgRWRnZVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgYWRkTWFya2Vyc1RvTWFwKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogR2VuZXJhdGVzIHJlc3BvbnNpdmUgaW1hZ2UgSFRNTFxyXG4gKiBAcGFyYW0gdXJsIHtzdHJpbmd9XHJcbiAqIEBwYXJhbSBhbHQge3N0cmluZ31cclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVJlc3BvbnNpdmVJbWcgPSAodXJsLCBhbHQpID0+IHtcclxuICAgIGNvbnN0IHVybFdpdGhvdXRFeHQgPSB1cmwuc2xpY2UoMCwgdXJsLmxlbmd0aCAtIDQpO1xyXG4gICAgcmV0dXJuIGA8cGljdHVyZSBjbGFzcz1cInJlc3RhdXJhbnQtaW1nXCI+XHJcbiAgPHNvdXJjZSBtZWRpYT1cIihtYXgtd2lkdGg6IDcxOXB4KVwiXHJcbiAgICBzcmNzZXQ9XCIuJHt1cmxXaXRob3V0RXh0fS0xMDAtMXguanBnIDF4LCAuJHt1cmxXaXRob3V0RXh0fS0xMDAtMnguanBnIDJ4LCAuJHt1cmxXaXRob3V0RXh0fS0xMDAtM3guanBnIDN4XCI+XHJcbiAgPHNvdXJjZSAgbWVkaWE9XCIobWluLXdpZHRoOiA3MjBweClcIlxyXG4gICAgc3Jjc2V0PVwiLiR7dXJsfSAxeFwiPlxyXG4gIDxpbWcgY2xhc3M9XCJyZXN0YXVyYW50LWltZ1wiIHNyYz1cIi4ke3VybH1cIiBhbHQ9XCIke2FsdH1cIj5cclxuPC9waWN0dXJlPmA7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSByZXN0YXVyYW50IEhUTUwuXHJcbiAqIEBwYXJhbSByZXN0YXVyYW50IHtPYmplY3R9XHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3JlYXRlUmVzdGF1cmFudEhUTUwgPSAocmVzdGF1cmFudCkgPT4ge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBjb25zdCByYW5kb21JZCA9ICduJyArIFN0cmluZyhNYXRoLnJhbmRvbSgpKS5zcGxpdCgnLicpWzFdO1xyXG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IGA8bGkgcm9sZT1cImJhbm5lclwiIGFyaWEtbGFiZWxsZWRieT1cIiR7cmFuZG9tSWR9XCI+XHJcbjxkaXYgaWQ9XCIke3JhbmRvbUlkfVwiPlxyXG4ke2NyZWF0ZVJlc3BvbnNpdmVJbWcoREJIZWxwZXIuaW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpLCBgJHtyZXN0YXVyYW50Lm5hbWV9IHJlc3RhdXJhbnQgcGhvdG9gKX1cclxuPGgyIHJvbGU9XCJoZWFkaW5nXCI+JHtyZXN0YXVyYW50Lm5hbWV9PC9oMj5cclxuPHA+JHtyZXN0YXVyYW50Lm5laWdoYm9yaG9vZH08L3A+XHJcbjxwPiR7cmVzdGF1cmFudC5hZGRyZXNzfTwvcD5cclxuPC9kaXY+XHJcbjxhIHJvbGU9XCJsaW5rXCIgaHJlZj1cIiR7REJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KX1cIj5WaWV3IERldGFpbHM8L2E+PC9saT5gXHJcbiAgICAgICAgLnJlcGxhY2UoLz5cXHMrPC8sICc+PCcpOyAvL2p1c3QgaW4gY2FzZSBicm93c2VyIHdpbGwgcmVuZGVyIHVud2FudGVkIHNwYWNlXHJcbiAgICByZXR1cm4gY29udGFpbmVyLmZpcnN0Q2hpbGQ7XHJcbn07XHJcblxyXG4vKipcclxuICogQWRkIG1hcmtlcnMgZm9yIGN1cnJlbnQgcmVzdGF1cmFudHMgdG8gdGhlIG1hcC5cclxuICogQHBhcmFtIHJlc3RhdXJhbnRzIHtPYmplY3R9XHJcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGFkZE1hcmtlcnNUb01hcCA9IChyZXN0YXVyYW50cyA9IHNlbGYucmVzdGF1cmFudHMpID0+IHJlc3RhdXJhbnRzLmZvckVhY2gocmVzdGF1cmFudCA9PiB7XHJcbiAgICAvLyBBZGQgbWFya2VyIHRvIHRoZSBtYXBcclxuICAgIGNvbnN0IG1hcmtlciA9IERCSGVscGVyLm1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgc2VsZi5tYXApO1xyXG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBtYXJrZXIudXJsXHJcbiAgICB9KTtcclxuICAgIHNlbGYubWFya2Vycy5wdXNoKG1hcmtlcik7XHJcbn0pO1xyXG5cclxuIl19
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
    var title = document.createElement('h3');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RhdXJhbnRfaW5mby5qcyJdLCJuYW1lcyI6WyJyZXN0YXVyYW50IiwiZmV0Y2hSZXN0YXVyYW50RnJvbVVSTCIsImNhbGxiYWNrIiwic2VsZiIsImlkIiwiZ2V0UGFyYW1ldGVyQnlOYW1lIiwiZXJyb3IiLCJmZXRjaFJlc3RhdXJhbnRCeUlkIiwiY29uc29sZSIsImZpbGxSZXN0YXVyYW50SFRNTCIsIm5hbWUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwiYWRkcmVzcyIsImltYWdlIiwib3V0ZXJIVE1MIiwiaW1hZ2VVcmxGb3JSZXN0YXVyYW50IiwiaW1nIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImN1aXNpbmUiLCJjdWlzaW5lX3R5cGUiLCJvcGVyYXRpbmdfaG91cnMiLCJmaWxsUmVzdGF1cmFudEhvdXJzSFRNTCIsImZpbGxSZXZpZXdzSFRNTCIsIm9wZXJhdGluZ0hvdXJzIiwiaG91cnMiLCJrZXkiLCJyb3ciLCJjcmVhdGVFbGVtZW50IiwiZGF5IiwiYXBwZW5kQ2hpbGQiLCJ0aW1lIiwicmV2aWV3cyIsImNvbnRhaW5lciIsInRpdGxlIiwibm9SZXZpZXdzIiwidWwiLCJmb3JFYWNoIiwiY3JlYXRlUmV2aWV3SFRNTCIsInJldmlldyIsImRhdGUiLCJyYXRpbmciLCJjb21tZW50cyIsInJlcGxhY2UiLCJmaXJzdENoaWxkIiwiZmlsbEJyZWFkY3J1bWIiLCJicmVhZGNydW1iIiwibGkiLCJ1cmwiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJyZWdleCIsIlJlZ0V4cCIsInJlc3VsdHMiLCJleGVjIiwiZGVjb2RlVVJJQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBLElBQUlBLG1CQUFKOztBQUVBOzs7O0FBSU8sSUFBTUMsMERBQXlCLFNBQXpCQSxzQkFBeUIsQ0FBQ0MsUUFBRCxFQUFjO0FBQ2hELFFBQUlDLEtBQUtILFVBQVQsRUFBcUI7QUFBRTtB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LGtCQUFxQixDQUFDSyxJQUFELEVBQU91QyxHQUFQLEVBQWU7QUFDN0MsUUFBSSxDQUFDQSxHQUFMLEVBQVM7QUFDTEEsY0FBTUMsT0FBT0MsUUFBUCxDQUFnQkMsSUFBdEI7QUFDSDtBQUNEMUMsV0FBT0EsS0FBS2tDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLE1BQXhCLENBQVA7QUFDQSxRQUFNUyxRQUFRLElBQUlDLE1BQUosVUFBa0I1QyxJQUFsQix1QkFBZDtBQUFBLFFBQ0k2QyxVQUFVRixNQUFNRyxJQUFOLENBQVdQLEdBQVgsQ0FEZDtBQUVBLFFBQUksQ0FBQ00sT0FBTCxFQUFhO0FBQ1QsZUFBTyxJQUFQO0FBQ0g7QUFDRCxRQUFJLENBQUNBLFFBQVEsQ0FBUixDQUFMLEVBQWdCO0FBQ1osZUFBTyxFQUFQO0FBQ0g7QUFDRCxXQUFPRSxtQkFBbUJGLFFBQVEsQ0FBUixFQUFXWCxPQUFYLENBQW1CLEtBQW5CLEVBQTBCLEdBQTFCLENBQW5CLENBQVA7QUFDSCxDQWRNIiwiZmlsZSI6InJlc3RhdXJhbnRfaW5mby5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEQkhlbHBlciBmcm9tIFwiLi9kYmhlbHBlclwiO1xyXG5pbXBvcnQge2NyZWF0ZVJlc3BvbnNpdmVJbWd9IGZyb20gJy4vbWFpbic7XHJcblxyXG5sZXQgcmVzdGF1cmFudDtcclxuXHJcbi8qKlxyXG4gKiBHZXQgY3VycmVudCByZXN0YXVyYW50IGZyb20gcGFnZSBVUkwuXHJcbiAqIEBwYXJhbSBjYWxsYmFjayB7ZnVuY3Rpb259XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZmV0Y2hSZXN0YXVyYW50RnJvbVVSTCA9IChjYWxsYmFjaykgPT4ge1xyXG4gICAgaWYgKHNlbGYucmVzdGF1cmFudCkgeyAvLyByZXN0YXVyYW50IGFscmVhZHkgZmV0Y2hlZCFcclxuICAgICAgICBjYWxsYmFjayhudWxsLCBzZWxmLnJlc3RhdXJhbnQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IGlkID0gZ2V0UGFyYW1ldGVyQnlOYW1lKCdpZCcpO1xyXG4gICAgaWYgKCFpZCkgeyAvLyBubyBpZCBmb3VuZCBpbiBVUkxcclxuICAgICAgICBjb25zdCBlcnJvciA9ICdObyByZXN0YXVyYW50IGlkIGluIFVSTCc7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCAoZXJyb3IsIHJlc3RhdXJhbnQpID0+IHtcclxuICAgICAgICAgICAgc2VsZi5yZXN0YXVyYW50ID0gcmVzdGF1cmFudDtcclxuICAgICAgICAgICAgaWYgKCFyZXN0YXVyYW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaWxsUmVzdGF1cmFudEhUTUwoKTtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudClcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBIVE1MIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2VcclxuICogQHBhcmFtIHJlc3RhdXJhbnQge09iamVjdH1cclxuICovXHJcbmV4cG9ydCBjb25zdCBmaWxsUmVzdGF1cmFudEhUTUwgPSAocmVzdGF1cmFudCA9IHNlbGYucmVzdGF1cmFudCkgPT4ge1xyXG4gICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LW5hbWUnKTtcclxuICAgIG5hbWUuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uYW1lO1xyXG5cclxuICAgIGNvbnN0IGFkZHJlc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1hZGRyZXNzJyk7XHJcbiAgICBhZGRyZXNzLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuYWRkcmVzcztcclxuXHJcbiAgICBjb25zdCBpbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWltZycpO1xyXG4gICAgaW1hZ2Uub3V0ZXJIVE1MID0gY3JlYXRlUmVzcG9uc2l2ZUltZyhEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCksIGBJbWFnZSBvZiAke3Jlc3RhdXJhbnQubmFtZX1gKTtcclxuICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Jlc3RhdXJhbnQtaW1nJylbMV07XHJcbiAgICBpbWcuaWQgPSAncmVzdGF1cmFudC1pbWcnO1xyXG5cclxuICAgIGNvbnN0IGN1aXNpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1jdWlzaW5lJyk7XHJcbiAgICBjdWlzaW5lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuY3Vpc2luZV90eXBlO1xyXG4gICAgLy8gZmlsbCBvcGVyYXRpbmcgaG91cnNcclxuICAgIGlmIChyZXN0YXVyYW50Lm9wZXJhdGluZ19ob3Vycykge1xyXG4gICAgICAgIGZpbGxSZXN0YXVyYW50SG91cnNIVE1MKCk7XHJcbiAgICB9XHJcbiAgICAvLyBmaWxsIHJldmlld3NcclxuICAgIGZpbGxSZXZpZXdzSFRNTCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSByZXN0YXVyYW50IG9wZXJhdGluZyBob3VycyBIVE1MIHRhYmxlIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2UuXHJcbiAqIEBwYXJhbSBvcGVyYXRpbmdIb3VycyB7T2JqZWN0fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGZpbGxSZXN0YXVyYW50SG91cnNIVE1MID0gKG9wZXJhdGluZ0hvdXJzID0gc2VsZi5yZXN0YXVyYW50Lm9wZXJhdGluZ19ob3VycykgPT4ge1xyXG4gICAgY29uc3QgaG91cnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1ob3VycycpO1xyXG4gICAgZm9yIChsZXQga2V5IGluIG9wZXJhdGluZ0hvdXJzKSB7XHJcbiAgICAgICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcclxuXHJcbiAgICAgICAgY29uc3QgZGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICBkYXkuaW5uZXJIVE1MID0ga2V5O1xyXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChkYXkpO1xyXG5cclxuICAgICAgICBjb25zdCB0aW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICB0aW1lLmlubmVySFRNTCA9IG9wZXJhdGluZ0hvdXJzW2tleV07XHJcbiAgICAgICAgcm93LmFwcGVuZENoaWxkKHRpbWUpO1xyXG5cclxuICAgICAgICBob3Vycy5hcHBlbmRDaGlsZChyb3cpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhbGwgcmV2aWV3cyBIVE1MIGFuZCBhZGQgdGhlbSB0byB0aGUgd2VicGFnZS5cclxuICogQHBhcmFtIHJldmlld3Mge2FycmF5fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGZpbGxSZXZpZXdzSFRNTCA9IChyZXZpZXdzID0gc2VsZi5yZXN0YXVyYW50LnJldmlld3MpID0+IHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXdzLWNvbnRhaW5lcicpO1xyXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpO1xyXG4gICAgdGl0bGUuaW5uZXJIVE1MID0gJ1Jldmlld3MnO1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcclxuXHJcbiAgICBpZiAoIXJldmlld3MpIHtcclxuICAgICAgICBjb25zdCBub1Jldmlld3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgbm9SZXZpZXdzLmlubmVySFRNTCA9ICdObyByZXZpZXdzIHlldCEnO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChub1Jldmlld3MpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlld3MtbGlzdCcpO1xyXG4gICAgcmV2aWV3cy5mb3JFYWNoKHJldmlldyA9PiB7XHJcbiAgICAgICAgdWwuYXBwZW5kQ2hpbGQoY3JlYXRlUmV2aWV3SFRNTChyZXZpZXcpKTtcclxuICAgIH0pO1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHVsKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgcmV2aWV3IEhUTUwgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZS5cclxuICogQHBhcmFtIHJldmlldyB7T2JqZWN0fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVJldmlld0hUTUwgPSAocmV2aWV3KSA9PiB7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBgPGxpPjxwPiR7cmV2aWV3Lm5hbWV9PC9wPlxyXG48cD4ke3Jldmlldy5kYXRlfTwvcD5cclxuPHAgY2xhc3M9XCJyZXZpZXctcmF0aW5nXCI+UmF0aW5nOiAke3Jldmlldy5yYXRpbmd9PC9wPlxyXG48cD4ke3Jldmlldy5jb21tZW50c308L3A+PC9saT5gXHJcbiAgICAgICAgLnJlcGxhY2UoLz5cXHMrPC8sICc+PCcpO1xyXG5cclxuICAgIHJldHVybiBjb250YWluZXIuZmlyc3RDaGlsZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgcmVzdGF1cmFudCBuYW1lIHRvIHRoZSBicmVhZGNydW1iIG5hdmlnYXRpb24gbWVudVxyXG4gKiBAcGFyYW0gcmVzdGF1cmFudCB7T2JqZWN0fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGZpbGxCcmVhZGNydW1iID0gKHJlc3RhdXJhbnQgPSBzZWxmLnJlc3RhdXJhbnQpID0+IHtcclxuICAgIGNvbnN0IGJyZWFkY3J1bWIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnJlYWRjcnVtYicpO1xyXG4gICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgbGkuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uYW1lO1xyXG4gICAgYnJlYWRjcnVtYi5hcHBlbmRDaGlsZChsaSk7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IGEgcGFyYW1ldGVyIGJ5IG5hbWUgZnJvbSBwYWdlIFVSTC5cclxuICogQHBhcmFtIG5hbWUge1N0cmluZ31cclxuICogQHBhcmFtIHVybCB7U3RyaW5nPX1cclxuICovXHJcbmV4cG9ydCBjb25zdCBnZXRQYXJhbWV0ZXJCeU5hbWUgPSAobmFtZSwgdXJsKSA9PiB7XHJcbiAgICBpZiAoIXVybCl7XHJcbiAgICAgICAgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICB9XHJcbiAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCAnXFxcXCQmJyk7XHJcbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFs/Jl0ke25hbWV9KD0oW14mI10qKXwmfCN8JClgKSxcclxuICAgICAgICByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG4gICAgaWYgKCFyZXN1bHRzKXtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIGlmICghcmVzdWx0c1syXSl7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcclxufTtcclxuIl19
},{"./dbhelper":1,"./main":3}]},{},[2])