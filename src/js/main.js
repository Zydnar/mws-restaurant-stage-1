import DBHelper from './dbhelper';

let restaurants,
    neighborhoods,
    cuisines,
    map,
    markers = [];

/**
 * Fetch all neighborhoods and set their HTML.
 * @return {Function}
 */
export const fetchNeighborhoods = () => DBHelper.fetchNeighborhoods(
    (error, neighborhoods) => {
        if (error) { // Got an error
            console.error(error);
        } else {
            self.neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        }
    }
);

/**
 * Set neighborhoods HTML.
 * @param neighborhoods {Object}
 * @return {void}
 */
export const fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
    const select = document.getElementById('neighborhoods-select');
    neighborhoods.forEach(neighborhood => {
        const option = document.createElement('option');
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        try {
            select.append(option)
        } catch (e) {
            select.innerHTML += option.outerHTML;
        }
    });
};

/**
 * Fetch all cuisines and set their HTML.
 * @return {void}
 */
export const fetchCuisines = () => {
    DBHelper.fetchCuisines((error, cuisines) => {
        if (error) { // Got an error!
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
export const fillCuisinesHTML = (cuisines = self.cuisines) => {
    const select = document.getElementById('cuisines-select');

    cuisines.forEach(cuisine => {
        const option = document.createElement('option');
        option.innerHTML = cuisine;
        option.value = cuisine;
        try {
            select.append(option)
        } catch (e) {
            select.innerHTML += option.outerHTML;
        }
    });
};


/**
 * Update page and map for current restaurants.
 * @return {void}
 */
export const updateRestaurants = () => {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();
        }
    })
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 * @param restaurants {Object}
 * @return {void}
 */
export const resetRestaurants = (restaurants) => {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';

    // Remove all map markers
    self.markers = self.markers ? self.markers : [];
    self.markers.forEach(m => m.setMap(null));
    self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 * @param restaurants {Object}
 * @return {void}
 */
export const fillRestaurantsHTML = (restaurants = self.restaurants) => {
    const ul = document.getElementById('restaurants-list');
    restaurants.forEach(restaurant => {
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
export const createResponsiveImg = (url, alt) => {
    const urlWithoutExt = url.slice(0, url.length - 4);
    return `<picture class="restaurant-img">
  <source media="(max-width: 719px)"
    srcset=".${urlWithoutExt}-100-1x.jpg 1x, .${urlWithoutExt}-100-2x.jpg 2x, .${urlWithoutExt}-100-3x.jpg 3x">
  <source  media="(min-width: 720px)"
    srcset=".${url} 1x">
  <img class="restaurant-img" src=".${url}" alt="${alt}">
</picture>`;

};

/**
 * Create restaurant HTML.
 * @param restaurant {Object}
 * @return {Element}
 */
export const createRestaurantHTML = (restaurant) => {
    const container = document.createElement('div');
    const randomId = 'n' + String(Math.random()).split('.')[1];
    container.innerHTML = `<li role="banner" aria-labelledby="${randomId}">
<div id="${randomId}">
${createResponsiveImg(DBHelper.imageUrlForRestaurant(restaurant), restaurant.name)}
<h1 role="heading">${restaurant.name}</h1>
<p>${restaurant.neighborhood}</p>
<p>${restaurant.address}</p>
</div>
<a role="link" href="${DBHelper.urlForRestaurant(restaurant)}">View Details</a></li>`
        .replace(/>\s+</, '><'); //just in case browser will render unwanted space
    return container.firstChild;
};

/**
 * Add markers for current restaurants to the map.
 * @param restaurants {Object}
 * @return {Function}
 */
export const addMarkersToMap = (restaurants = self.restaurants) => restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
        window.location.href = marker.url
    });
    self.markers.push(marker);
});

