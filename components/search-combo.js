
/**
 * a drop down component, sort of.. I want to learn either Web Components and\or react
 * to make things like this more often.
 * 
 * Allows the user to both enter and select saved locations. The premise being the ability to 
 * quickly check the wearther in multiple locations.
 * 
 * I have no idea if this is even remotely how this is done. and I figure this is where React and the like
 * come into play.
 * 
 *  SO it seems in order to make use I have to add code into the component code that calls the API fetch fucntions
 *  This is cumbersome. THis had to be done in order to get access to the API code to fetch the weather by location
 * It was hardly convieneint to have to click the search button once a location is recalled as previouslly saved.
 */


// this is some fanagling i had to do to get this to work, it should not be done this way, Im sure. 
import {
    getForecastFromLocation,
} from "../modules/weather-api.js";
import { DOM } from "../main.js";

class SearchComboBox {
    constructor() {
        // Psuedo Component State
        this.state = {
            menuVisible: false,
            save: false,
            menuItems: [],
            currentItem: null,
        };

        // DOM
        this.searchButton = document.querySelector(".button");
        this.textBox = document.querySelector(".text");
        this.expandButton = document.querySelector(".expand");
        this.menu = document.querySelector(".menu");
        this.saveCheck = document.querySelector("#save");
        this.component = document.querySelector(".component");
        this.clearButton = document.querySelector("#clear");

        this.textBox.addEventListener("click", () => {
            viewMenu(false);
        });
        this.expandButton.addEventListener("click", () => {
            viewMenu(true);
        });
        this.menu.addEventListener("click", () => {
            viewMenu(false);
        });

        this.saveCheck.addEventListener("click", () => {
            let checked = document.getElementById("save").checked;
            if (checked) this.state.save = true;
            else this.state.save = false;
        });

        // show the clear button when needed
        this.textBox.addEventListener("keydown", (e) => {
            if (this.textBox.value.length >= 3) {
                showClearButton(true);
            } else if (this.textBox.value.length <= 1) {
                showClearButton(false);
            }
        });

        // hide menu when clicked outside component
        document.addEventListener("click", (e) => {
            let targetEl = e.target; // clicked element
            do {
                if (targetEl == this.component) {
                    return;
                }
                // Go up the DOM
                targetEl = targetEl.parentNode;
            } while (targetEl);

            viewMenu(false);
        });

        this.searchButton.addEventListener("click", () => {
            const newItem = this.textBox.value;
            viewMenu(false);

            if (newItem !== "") {
                // are we saving this?
                if (this.state.save) {
                    // Check to see if this item already exists...
                    // if it does exist, dont save again.
                    const exists = itemExists(newItem);
                    console.log(exists)
                    if (!exists) {
                        // add the input to the menuItems array.
                        const itemObj = addNewItem(newItem);
                        addToMenu(itemObj, itemObj.itemID); // add the item to the menu.
                    }
                }

                // Turn over the location to be searched...
                this.state.currentItem = newItem;
            } else {
                alert("Enter a location to search.");
            }
        });

        this.clearButton.addEventListener("click", () => {
            this.textBox.value = "";
            showClearButton(false);
        });

        // Methods //
        const itemExists = (itemText) => {
            
            for (let i = 0; i < this.state.menuItems.length; i++) {
                   if (
                       this.state.menuItems[i].text.toLowerCase() ===
                       itemText.toLowerCase()
                   ) {
                       console.log("it exists");
                       return true;
                   }
            }
            return false;
        };

        const showClearButton = (show) => {
            return show
                ? (this.clearButton.style = "visibility: visible;")
                : (this.clearButton.style = "visibility: hidden;");
        };

        // show or hide the menu.
        const viewMenu = (view) => {
            if (view) {
                this.menu.style = "visibility: visible;";
                this.state.menuVisible = true;
            } else {
                this.menu.style = "visibility: hidden;";
                this.state.menuVisible = false;
            }
        };

        // loop throught the IDS and return the corresponding text
        const getItemText = (itemID) => {
            for (let i = 0; this.state.menuItems.length; i++) {
                if (itemID === this.state.menuItems[i].itemID) {
                    return this.state.menuItems[i].text;
                }
            }
        };

        // remove this item from the menu and from storage.
        const removeItem = (itemID) => {
            const getItemIndex = (array, id) => {
                for (let i = 0; i < array.length; i++) {
                    if (array[i].itemID == id) {
                        return i;
                    }
                }
                return -1;
            };
            const removeFromDOM = (id) => {
                const menuItems = document.querySelectorAll(".item-container");
                const container = document.querySelector(".menu");
                let thisID = null;

                for (let i = 0; i < menuItems.length; i++) {
                    // slice off the id # after "item-"
                    thisID = menuItems[i].getAttribute("id").split("-")[2];
                    //console.log(thisID)
                    if (thisID == id) {
                        container.removeChild(menuItems[i]);
                        //console.log('match');
                    }
                }
            };
            const removeFromStorage = (index) => {
                if (index != -1) {
                    //console.log(index + " " + bookID);
                    this.state.menuItems.splice(index, 1);

                    localStorage.setItem(
                        "searches",
                        JSON.stringify(this.state.menuItems)
                    );
                }
            };

            removeFromDOM(itemID);
            const itemIndex = getItemIndex(this.state.menuItems, itemID);
            removeFromStorage(itemIndex);
        };

        // listen for the clicks on both the item and the delete Icon and
        // handle accordingly
        const bindItemToDOM = (itemID) => {
            const item = document.querySelector("#item-" + itemID);
            const deleteItem = document.querySelector("#close-" + itemID);

            item.addEventListener("click", () => {
                console.log(`Item: ${itemID} clicked`);
                this.state.currentItem = getItemText(itemID);
                this.textBox.value = this.state.currentItem;
                showClearButton(true);
                // had to import this from the API module. Doesnt feel right but it does work
                // Seems like i shoud be able to get access to this a better way like if this were a 
                // true self contained compoment
                getForecastFromLocation(this.state.currentItem, DOM);
            });
            deleteItem.addEventListener("click", () => {
                console.log(`deleteItem: ${itemID} clicked`);

                // remove this menuitem from the menu and from storage.
                removeItem(itemID);
            });

            item.addEventListener("mouseover", () => {
                item.style =
                    "color: white; background-color: rgba(27, 53, 92, .9);";
                deleteItem.style =
                    "color: gray;  background-color: rgba(27, 53, 92, .9);";
            });

            item.addEventListener("mouseout", () => {
                item.style =
                    "color: black; background-color: rgba(35, 31, 22, .1);";
                deleteItem.style =
                    "color: black;  background-color: rgba(35, 31, 22, .1);";
            });
        };

        // add the input to the menu, one item at a time. Decide if using the truncated name
        // or the name as entered.
        const addToMenu = (inputObj, itemID) => {
            const addElement = (
                tag,
                parent,
                {
                    className = null,
                    idName = null,
                    src = null,
                    width = null,
                    content = null,
                    itemID = null,
                } = {}
            ) => {
                const div = document.createElement(tag);
                if (idName != null) div.id = idName;
                if (className != null) div.className = className;
                if (src != null) div.src = src;
                if (width != null) div.width = width;
                if (content != null) div.innerHTML = content;

                parent.appendChild(div);
                return div;
            };

            const generateItem = (itemObj, itemID) => {
                // is this name too long to display it all?
                const displayText =
                    itemObj.truncatedName === null
                        ? itemObj.text
                        : itemObj.truncatedName;

                // add the item container
                const newItemContainer = addElement("div", this.menu, {
                    className: "item-container",
                    idName: "item-container-" + itemID,
                });
                // add the item
                addElement("div", newItemContainer, {
                    className: "item",
                    idName: "item-" + itemID,
                    content: displayText,
                });
                // add the item delete button
                addElement("div", newItemContainer, {
                    className: "close",
                    idName: "close-" + itemID,
                    content: '<i class="fa-solid fa-trash"></i>', //"&#x2612;", //'<i class="fa-solid fa-trash"></i>',
                });
            };

            generateItem(inputObj, itemID);
            bindItemToDOM(itemID);
        };

        // populate the menu fro storage
        const loadMenu = (menuItems) => {
            for (let i = 0; i < menuItems.length; i++) {
                console.log(menuItems[i].text);
                addToMenu(menuItems[i], menuItems[i].itemID);
            }
        };

        // add the item as on object with the ID to find it by, if the location name
        // entered is > 20 chars, then truncate a copy of the name to be used
        // in the menu later
        const addNewItem = (itemText) => {
            const getCurrIDS = () => {
                // gets all the IDs from the items in storage
                let returnArray = [];
                for (let i = 0; i < this.state.menuItems.length; i++) {
                    returnArray.push(this.state.menuItems[i].itemID);
                }
                return returnArray;
            };

            const getUniqueID = (knownIDs) => {
                let idExists = true;
                let newID = null;

                while (idExists) {
                    newID = Math.floor(Math.random() * 300) + 1;
                    // if this id doesnt exist
                    if (knownIDs.indexOf(newID) === -1) {
                        idExists = false;
                    }
                }
                return newID;
            };

            // returns a shortened name if its longer than maxLength
            const truncName = (text) => {
                const maxLen = 20;
                return text.length > maxLen
                    ? text.slice(0, maxLen) + "..."
                    : null;
            };

            // get all known IDs
            const currIDs = getCurrIDS();
            const newID = getUniqueID(currIDs);

            // prepare the data to be saved
            let itemObj = {
                text: itemText,
                itemID: newID,
                truncatedName: truncName(itemText),
            };
            // get whats already there , if anything and add to it
            this.state.menuItems = localStorage.getItem("searches")
                ? JSON.parse(localStorage.getItem("searches"))
                : [];
            this.state.menuItems.push(itemObj);

            localStorage.setItem(
                "searches",
                JSON.stringify(this.state.menuItems)
            );

            return itemObj;
        };

        // loads searched objects fron localStorage
        const getSearches = () => {
            this.state.menuItems = localStorage.getItem("searches")
                ? JSON.parse(localStorage.getItem("searches"))
                : [];
            this.state.totalItems = this.state.menuItems.length;
            return this.state.menuItems;
        };

        // Display all previoulsy saved locations
        loadMenu(getSearches());
    }
}

const searchBox = new SearchComboBox();

