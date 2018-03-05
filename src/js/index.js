import {fetchCuisines, fetchNeighborhoods, updateRestaurants} from './main';
import {fetchRestaurantFromURL, fillBreadcrumb} from "./restaurant_info";
import DBHelper from "./dbhelper";

(function () {
    const neighborhoodsSelect = document.getElementById('neighborhoods-select'),
        cuisinesSelect = document.getElementById('cuisines-select');

    const routeChecker = () => {
        const patt = /([\w_.]+)/g;
        return location.pathname.match(patt) || ['/'];
    };
    const sw_update_ready = function (worker) {
        if (confirm('Update is ready. Refresh now?')) {
            return worker.postMessage(
                {
                    action: 'skipWaiting'
                }
            );
        }
    };
    const track_installing = (worker) => {
        return worker.addEventListener('statechange', () => {
            if (worker.state === 'installed') {
                return sw_update_ready(worker);
            }
        });
    };

    const initSW = () => {
        if (navigator.serviceWorker) {
            navigator.serviceWorker.register('/sw.js').then((reg) => {
                if (!navigator.serviceWorker.controller) {
                    return;
                } else if (reg.installing) {
                    console.log('Service worker installing');
                    track_installing(reg.installing);
                } else if (reg.waiting) {
                    console.log('Service worker installed');
                } else if (reg.active) {
                    console.log(`Service worker active at scope: ${reg.scope}`);
                }
                return reg.addEventListener('updatefound', () => {
                    return track_installing(reg.installing);
                });
            }).catch(function (err) {
                return console.error('ServiceWorker registration failed with error: ' + err);
            });
        }

    };
    const setInitMap = (type) => {
        /**
         * Initialize Google map, called from HTML.
         * @return {function}
         */
        switch (type) {
            case '/':
                self.initMap = () => {
                    let loc = {
                        lat: 40.722216,
                        lng: -73.987501
                    };
                    self.map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 12,
                        center: loc,
                        scrollwheel: false
                    });
                    updateRestaurants();
                };
                break;
            case 'restaurant.html':
                self.initMap = () => fetchRestaurantFromURL(
                    (error, restaurant) => {
                        if (error) { // Got an error!
                            console.error(error);
                        } else {
                            self.map = new google.maps.Map(document.getElementById('map'), {
                                zoom: 16,
                                center: restaurant.latlng,
                                scrollwheel: false
                            });
                            fillBreadcrumb();
                            DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
                        }
                    });
                break;
        }
    };
    switch (routeChecker()[0]) {
        case '/':
            setInitMap('/');
            /**
             * Fetch neighborhoods and cuisines as soon as the page is loaded.
             */
            document.addEventListener('DOMContentLoaded', () => {
                fetchNeighborhoods();
                fetchCuisines();
            });

            cuisinesSelect.addEventListener('change', (event) => {
                updateRestaurants();
            });
            neighborhoodsSelect.addEventListener('change', (event) => {
                updateRestaurants();
            });
            break;
        case 'restaurant.html':
            setInitMap('restaurant.html');
            break;
    }
    initSW(); //init service worker
}).call(this); //ensure application runs in right context
